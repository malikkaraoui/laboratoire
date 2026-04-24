declare module "claude-atelier" {
  export type ProfileName = "full" | "lean" | "review-only";

  export interface ApplyProfileOpts {
    cwd: string;
    profile: ProfileName;
    skills?: string[];
    hooks?: string[];
    mcp?: Record<string, unknown>;
    mergeStrategy?: "repo-wins" | "atelier-wins";
    dryRun?: boolean;
  }

  export interface ApplyResult {
    applied: string[];
    skipped: string[];
    warnings: string[];
  }

  export function applyProfile(opts: ApplyProfileOpts): Promise<ApplyResult>;
  export const PROFILES: Record<ProfileName, unknown>;
}
