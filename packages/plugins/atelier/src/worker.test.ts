import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestHarness } from "@paperclipai/plugin-sdk/testing";
import manifest from "./manifest.js";
import plugin from "./worker.js";
import type { InjectionResult } from "./injector.js";

vi.mock("./injector.js", () => ({
  injectIntoWorktree: vi.fn(),
}));

import { injectIntoWorktree } from "./injector.js";
const mockInject = vi.mocked(injectIntoWorktree);

const WORKSPACE_READY_PAYLOAD = {
  runId: "run-test-123",
  issueId: "issue-456",
  projectId: "proj-789",
  companyId: "company-abc",
  agentId: "agent-def",
  cwd: "/tmp/test-worktree",
  branchName: "feat/test-branch",
  baseRef: "main",
};

function makeHarness(config?: Record<string, unknown>) {
  return createTestHarness({
    manifest,
    capabilities: manifest.capabilities,
    config: config ?? { defaultProfile: "lean" },
  });
}

describe("plugin-atelier worker", () => {
  beforeEach(() => {
    mockInject.mockReset();
  });

  it("s'enregistre sur agent.run.workspace_ready au setup", async () => {
    const harness = makeHarness();
    await plugin.definition.setup(harness.ctx);
    // Le setup ne doit pas lever d'exception
    expect(harness.logs.some((l) => l.message.includes("workspace_ready"))).toBe(true);
  });

  it("appelle injectIntoWorktree avec les bons paramètres", async () => {
    mockInject.mockResolvedValue({
      applied: [".claude/settings.json", ".claude/hooks/pre-push.sh"],
      skipped: [],
      warnings: [],
    } satisfies InjectionResult);

    const harness = makeHarness({ defaultProfile: "lean" });
    await plugin.definition.setup(harness.ctx);
    await harness.emit("agent.run.workspace_ready", WORKSPACE_READY_PAYLOAD);

    expect(mockInject).toHaveBeenCalledOnce();
    expect(mockInject).toHaveBeenCalledWith({
      cwd: WORKSPACE_READY_PAYLOAD.cwd,
      agentId: WORKSPACE_READY_PAYLOAD.agentId,
      config: expect.objectContaining({ defaultProfile: "lean" }),
    });
  });

  it("log l'activité quand des fichiers sont injectés", async () => {
    mockInject.mockResolvedValue({
      applied: [".claude/settings.json"],
      skipped: [],
      warnings: [],
    } satisfies InjectionResult);

    const harness = makeHarness();
    await plugin.definition.setup(harness.ctx);
    await harness.emit("agent.run.workspace_ready", WORKSPACE_READY_PAYLOAD);

    const activityEntry = harness.activity.find((a) =>
      a.message.includes("claude-atelier injecté"),
    );
    expect(activityEntry).toBeDefined();
    expect(activityEntry?.entityId).toBe(WORKSPACE_READY_PAYLOAD.runId);
    expect(activityEntry?.metadata?.cwd).toBe(WORKSPACE_READY_PAYLOAD.cwd);
  });

  it("émet un warn si injection retourne des avertissements", async () => {
    mockInject.mockResolvedValue({
      applied: [],
      skipped: [".claude/hooks/pre-push.sh"],
      warnings: ["claude-atelier introuvable dans l'environnement du plugin."],
    } satisfies InjectionResult);

    const harness = makeHarness();
    await plugin.definition.setup(harness.ctx);
    await harness.emit("agent.run.workspace_ready", WORKSPACE_READY_PAYLOAD);

    expect(harness.logs.some((l) => l.level === "warn" && l.message.includes("introuvable"))).toBe(true);
    // Pas d'entrée d'activité si rien n'a été appliqué
    expect(harness.activity.find((a) => a.message.includes("injecté"))).toBeUndefined();
  });

  it("absorbe les erreurs d'injection sans faire planter le handler", async () => {
    mockInject.mockRejectedValue(new Error("EACCES: permission refusée"));

    const harness = makeHarness();
    await plugin.definition.setup(harness.ctx);

    // Ne doit pas lever d'exception — l'erreur est loggée
    await expect(
      harness.emit("agent.run.workspace_ready", WORKSPACE_READY_PAYLOAD),
    ).resolves.not.toThrow();

    expect(harness.logs.some((l) => l.level === "error" && l.message.includes("EACCES"))).toBe(true);
  });

  it("respecte le profil par défaut lean quand config absente", async () => {
    mockInject.mockResolvedValue({ applied: [], skipped: [], warnings: [] });

    const harness = makeHarness({});
    await plugin.definition.setup(harness.ctx);
    await harness.emit("agent.run.workspace_ready", WORKSPACE_READY_PAYLOAD);

    expect(mockInject).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({ defaultProfile: "lean" }),
      }),
    );
  });

  it("passe le profil full si configuré", async () => {
    mockInject.mockResolvedValue({ applied: [".claude/settings.json"], skipped: [], warnings: [] });

    const harness = makeHarness({ defaultProfile: "full" });
    await plugin.definition.setup(harness.ctx);
    await harness.emit("agent.run.workspace_ready", WORKSPACE_READY_PAYLOAD);

    expect(mockInject).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({ defaultProfile: "full" }),
      }),
    );
  });

  it("onHealth répond ok", async () => {
    const health = await plugin.definition.onHealth?.({} as never);
    expect(health?.status).toBe("ok");
  });
});
