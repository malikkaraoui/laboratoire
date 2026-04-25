import type {
  AdapterEnvironmentCheck,
  AdapterEnvironmentTestContext,
  AdapterEnvironmentTestResult,
} from "@paperclipai/adapter-utils";
import { asString, parseObject } from "@paperclipai/adapter-utils/server-utils";

function summarizeStatus(checks: AdapterEnvironmentCheck[]): AdapterEnvironmentTestResult["status"] {
  if (checks.some((c) => c.level === "error")) return "fail";
  if (checks.some((c) => c.level === "warn")) return "warn";
  return "pass";
}

export async function testEnvironment(
  ctx: AdapterEnvironmentTestContext,
): Promise<AdapterEnvironmentTestResult> {
  const checks: AdapterEnvironmentCheck[] = [];
  const config = parseObject(ctx.config);
  const baseUrl = asString(config.baseUrl, "http://localhost:11434/v1");
  const apiKey = asString(config.apiKey, "");
  const model = asString(config.model, "llama3.2");
  const isOpenRouter = baseUrl.includes("openrouter.ai");

  const versionUrl = isOpenRouter
    ? `${baseUrl.replace(/\/v1\/?$/, "")}/models`
    : baseUrl.replace(/\/v1\/?$/, "") + "/api/version";

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const res = await fetch(versionUrl, { signal: AbortSignal.timeout(5000), headers });
    if (res.ok) {
      checks.push({
        code: "ollama_reachable",
        level: "info",
        message: isOpenRouter
          ? `OpenRouter API is reachable at ${baseUrl}`
          : `Ollama is running and reachable at ${baseUrl}`,
      });
    } else {
      checks.push({
        code: "ollama_unreachable",
        level: "error",
        message: `${isOpenRouter ? "OpenRouter" : "Ollama"} returned HTTP ${res.status}`,
        hint: isOpenRouter
          ? "Check your API key and network connectivity."
          : "Make sure Ollama is running: `ollama serve`",
      });
    }
  } catch (err) {
    checks.push({
      code: "ollama_unreachable",
      level: "error",
      message: `Cannot reach ${isOpenRouter ? "OpenRouter" : "Ollama"} at ${baseUrl}`,
      detail: err instanceof Error ? err.message : String(err),
      hint: isOpenRouter
        ? "Check your internet connection and API key."
        : "Start Ollama with `ollama serve`, then retry.",
    });
  }

  const canProbe = checks.every((c) => c.code !== "ollama_unreachable");
  if (canProbe) {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15_000);
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "Respond with hello." }],
          stream: false,
          max_tokens: 32,
        }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));
      if (res.ok) {
        const data = await res.json() as { choices?: { message?: { content?: string } }[] };
        const reply = data.choices?.[0]?.message?.content ?? "";
        const hasHello = /\b(hello|bonjour|hola|ciao|hallo)\b/i.test(reply);
        checks.push({
          code: hasHello ? "ollama_hello_probe_passed" : "ollama_hello_probe_unexpected",
          level: hasHello ? "info" : "warn",
          message: hasHello
            ? `Hello probe succeeded with model ${model}.`
            : `Probe ran but did not return expected greeting. Got: ${reply.slice(0, 120)}`,
        });
      } else {
        const body = await res.text().catch(() => "");
        checks.push({
          code: "ollama_hello_probe_failed",
          level: "warn",
          message: `Hello probe failed: HTTP ${res.status}`,
          detail: body.slice(0, 240),
          hint: isOpenRouter
            ? `Verify the model "${model}" is available on OpenRouter.`
            : `Pull the model first: \`ollama pull ${model}\``,
        });
      }
    } catch (err) {
      checks.push({
        code: "ollama_hello_probe_timeout",
        level: "warn",
        message: "Hello probe timed out or failed.",
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    adapterType: ctx.adapterType,
    status: summarizeStatus(checks),
    checks,
    testedAt: new Date().toISOString(),
  };
}
