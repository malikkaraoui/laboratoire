export const type = "ollama_local";
export const label = "Ollama (local)";

export const models: { id: string; label: string }[] = [];

export const agentConfigurationDoc = `# ollama_local agent configuration

Adapter: ollama_local

Core fields:
- baseUrl (string, optional): Ollama API base URL, default "http://localhost:11434/v1"
- apiKey (string, optional): API key — required for OpenRouter (https://openrouter.ai/api/v1)
- model (string, optional): model id, e.g. "llama3.2", "mistral", "openai/gpt-4o" (OpenRouter)
- promptTemplate (string, optional): run prompt template
- timeoutSec (number, optional): request timeout in seconds, default 300
- env (object, optional): KEY=VALUE environment variables (for secret resolution)

OpenRouter usage:
  Set baseUrl to "https://openrouter.ai/api/v1" and apiKey to your OpenRouter key.
  Any model listed on openrouter.ai/models can be used as the model id.
`;
