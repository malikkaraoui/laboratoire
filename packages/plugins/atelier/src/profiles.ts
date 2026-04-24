export type ProfileName = "full" | "lean" | "review-only";

export interface AtelierProfile {
  skills: string[];
  hooks: string[];
  mcp: Record<string, unknown>;
}

export const PROFILES: Record<ProfileName, AtelierProfile> = {
  full: {
    skills: [
      "superpowers:brainstorming",
      "superpowers:systematic-debugging",
      "superpowers:test-driven-development",
      "superpowers:writing-plans",
      "superpowers:executing-plans",
      "superpowers:verification-before-completion",
      "superpowers:finishing-a-development-branch",
      "superpowers:requesting-code-review",
      "superpowers:receiving-code-review",
      "superpowers:dispatching-parallel-agents",
      "superpowers:subagent-driven-development",
      "superpowers:using-git-worktrees",
      "superpowers:using-superpowers",
      "superpowers:writing-skills",
      "simplify",
      "feature-dev:feature-dev",
      "code-review:code-review",
      "review",
    ],
    hooks: ["session-model", "user-prompt-submit", "pre-tool-use", "post-tool-use"],
    mcp: {
      github: {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-github"],
        env: { GITHUB_PERSONAL_ACCESS_TOKEN: "${GITHUB_TOKEN}" },
      },
    },
  },
  lean: {
    skills: [
      "superpowers:verification-before-completion",
      "superpowers:systematic-debugging",
      "simplify",
    ],
    hooks: ["pre-tool-use"],
    mcp: {},
  },
  "review-only": {
    skills: ["superpowers:verification-before-completion", "code-review:code-review"],
    hooks: ["pre-tool-use"],
    mcp: {},
  },
};
