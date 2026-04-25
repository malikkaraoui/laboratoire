import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import type { AtelierInstanceConfig } from "./config-schema.js";
import { injectIntoWorktree } from "./injector.js";

const PLUGIN_NAME = "plugin-atelier";

const plugin = definePlugin({
  async setup(ctx) {
    ctx.logger.info(`${PLUGIN_NAME} setup — en attente de agent.run.workspace_ready`);

    ctx.events.on("agent.run.workspace_ready", async (event) => {
      const payload = event.payload as {
        runId: string;
        issueId: string | null;
        projectId: string | null;
        companyId: string;
        agentId: string;
        cwd: string;
        branchName: string | null;
        baseRef: string | null;
      };

      const raw = (await ctx.config.get()) as Partial<AtelierInstanceConfig>;
      const config: AtelierInstanceConfig = {
        ...raw,
        defaultProfile: raw.defaultProfile ?? "lean",
      };

      ctx.logger.info(
        `${PLUGIN_NAME} workspace_ready — agentId=${payload.agentId} cwd=${payload.cwd}`,
      );

      try {
        const result = await injectIntoWorktree({
          cwd: payload.cwd,
          agentId: payload.agentId,
          config,
        });

        if (result.warnings.length > 0) {
          for (const w of result.warnings) ctx.logger.warn(`${PLUGIN_NAME} ${w}`);
        }
        if (result.applied.length > 0) {
          ctx.logger.info(`${PLUGIN_NAME} injecté : ${result.applied.join(", ")}`);
          await ctx.activity.log({
            companyId: payload.companyId,
            message: `claude-atelier injecté dans ${payload.cwd}`,
            entityType: "heartbeat_run",
            entityId: payload.runId,
            metadata: {
              agentId: payload.agentId,
              cwd: payload.cwd,
              applied: result.applied,
            },
          });
        }
      } catch (err) {
        ctx.logger.error(
          `${PLUGIN_NAME} échec injection cwd=${payload.cwd} : ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    });
  },

  async onHealth() {
    return { status: "ok", message: `${PLUGIN_NAME} ready` };
  },
});

export default plugin;
runWorker(plugin, import.meta.url);
