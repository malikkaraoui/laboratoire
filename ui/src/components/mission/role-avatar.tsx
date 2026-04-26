import { cn } from "@/lib/utils";

const ROLE_COLORS: Record<string, string> = {
  ceo: "bg-blue-500 text-white",
  cto: "bg-purple-500 text-white",
  cfo: "bg-emerald-500 text-white",
  coo: "bg-amber-500 text-white",
  hr: "bg-pink-500 text-white",
  hrmanager: "bg-pink-500 text-white",
  pm: "bg-indigo-500 text-white",
  default: "bg-zinc-600 text-white",
};

function colorForName(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  if (ROLE_COLORS[key]) return ROLE_COLORS[key];
  // Hash déterministe pour les rôles inconnus
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  const palette = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-pink-500", "bg-indigo-500", "bg-rose-500", "bg-teal-500"];
  return `${palette[hash % palette.length]} text-white`;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+|[_-]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

interface AgentRoleAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AgentRoleAvatar({ name, size = "md", className }: AgentRoleAvatarProps) {
  const sizeCls = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-xs";
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold shrink-0",
        sizeCls,
        colorForName(name),
        className,
      )}
    >
      {initialsOf(name)}
    </div>
  );
}
