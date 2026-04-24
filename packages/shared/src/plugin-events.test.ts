import { describe, expect, it } from "vitest";
import { PLUGIN_EVENT_TYPES, type PluginEventType } from "./index.js";

describe("PLUGIN_EVENT_TYPES", () => {
  it("includes the workspace_ready lifecycle event", () => {
    expect(PLUGIN_EVENT_TYPES).toContain("agent.run.workspace_ready");
  });

  it("keeps the agent.run.* family in the declared order", () => {
    const agentRunEvents = PLUGIN_EVENT_TYPES.filter((t) => t.startsWith("agent.run."));
    expect(agentRunEvents).toEqual([
      "agent.run.started",
      "agent.run.finished",
      "agent.run.failed",
      "agent.run.cancelled",
      "agent.run.workspace_ready",
    ]);
  });

  it("narrows the PluginEventType union to include the new event", () => {
    const ev: PluginEventType = "agent.run.workspace_ready";
    expect(ev).toBe("agent.run.workspace_ready");
  });
});
