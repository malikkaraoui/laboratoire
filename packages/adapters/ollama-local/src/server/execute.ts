import type { AdapterExecutionContext, AdapterExecutionResult } from "@paperclipai/adapter-utils";
import {
  asString,
  asNumber,
  parseObject,
  renderTemplate,
  renderPaperclipWakePrompt,
  joinPromptSections,
  DEFAULT_PAPERCLIP_AGENT_PROMPT_TEMPLATE,
} from "@paperclipai/adapter-utils/server-utils";

export async function execute(ctx: AdapterExecutionContext): Promise<AdapterExecutionResult> {
  const { config, runId, agent, context, onLog } = ctx;

  const baseUrl = asString(config.baseUrl, "http://localhost:11434/v1").replace(/\/$/, "");
  const apiKey = asString(config.apiKey, "") || process.env.OPENROUTER_KEY || process.env.OPENROUTER_API_KEY || "";
  const model = asString(config.model, "llama3.2");
  const timeoutSec = asNumber(config.timeoutSec, 300);
  const promptTemplate = asString(config.promptTemplate, DEFAULT_PAPERCLIP_AGENT_PROMPT_TEMPLATE);

  const templateData = {
    agentId: agent.id,
    companyId: agent.companyId,
    runId,
    company: { id: agent.companyId },
    agent,
    run: { id: runId, source: "on_demand" },
    context,
  };

  const wakePrompt = renderPaperclipWakePrompt(context.paperclipWake, { resumedSession: false });
  const sessionHandoffNote = asString(context.paperclipSessionHandoffMarkdown, "").trim();
  const taskContextNote = asString(context.paperclipTaskMarkdown, "").trim();
  const renderedPrompt = renderTemplate(promptTemplate, templateData);
  const userMessage = joinPromptSections([wakePrompt, sessionHandoffNote, taskContextNote, renderedPrompt]);

  const systemParts: string[] = [];
  const configSystemPrompt = asString(config.systemPrompt, "").trim();
  if (configSystemPrompt) systemParts.push(configSystemPrompt);
  const systemPromptAppend = asString(context.paperclipSystemPromptAppend, "").trim();
  if (systemPromptAppend) systemParts.push(systemPromptAppend);
  const systemMessage = systemParts.join("\n\n");

  const messages: { role: string; content: string }[] = [];
  if (systemMessage) messages.push({ role: "system", content: systemMessage });
  messages.push({ role: "user", content: userMessage });

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  await onLog("stdout", `[paperclip] Ollama adapter calling ${baseUrl}/chat/completions (model: ${model})\n`);

  const controller = new AbortController();
  // timeoutSec <= 0 => pas de timeout (utile pour Ollama local : le 1er appel
  // peut prendre plusieurs minutes le temps que le modèle soit chargé en VRAM).
  const timer = timeoutSec > 0
    ? setTimeout(() => controller.abort(), timeoutSec * 1000)
    : null;

  let fullContent = "";
  let timedOut = false;

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ model, messages, stream: true }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      throw new Error(`Ollama API error ${res.status}: ${errBody.slice(0, 240)}`);
    }

    if (!res.body) throw new Error("Ollama API returned no response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.replace(/^data:\s*/, "").trim();
        if (!trimmed || trimmed === "[DONE]") continue;
        try {
          const chunk = JSON.parse(trimmed) as {
            choices?: { delta?: { content?: string }; finish_reason?: string }[];
          };
          const delta = chunk.choices?.[0]?.delta?.content ?? "";
          if (delta) {
            fullContent += delta;
            await onLog("stdout", delta);
          }
        } catch {
          // skip malformed SSE lines
        }
      }
    }

    await onLog("stdout", "\n");
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      timedOut = true;
      await onLog("stderr", `[paperclip] Ollama request timed out after ${timeoutSec}s\n`);
    } else {
      const msg = err instanceof Error ? err.message : String(err);
      await onLog("stderr", `[paperclip] Ollama error: ${msg}\n`);
      return { exitCode: 1, signal: null, timedOut: false, errorMessage: msg, errorCode: "ollama_error" };
    }
  } finally {
    if (timer) clearTimeout(timer);
  }

  return {
    exitCode: timedOut ? null : 0,
    signal: null,
    timedOut,
    summary: fullContent.trim().slice(0, 500) || undefined,
    model,
  };
}
