export interface ChatbotApiResponse {
  reply: string;
}

function getBackendBaseUrl(): string {
  const url = (import.meta as any).env?.VITE_BACKEND_URL as string | undefined;
  if (!url) return "";
  return url.replace(/\/$/, "");
}

export async function sendChatMessage(message: string): Promise<string> {
  const baseUrl = getBackendBaseUrl();
  const endpoint = `${baseUrl}/chatbot/api/`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error(`Chatbot API error (${res.status})`);
  }

  const data = (await res.json()) as Partial<ChatbotApiResponse> & Record<string, unknown>;
  const reply = typeof data.reply === "string" ? data.reply : "";

  if (!reply) {
    throw new Error("Chatbot API returned empty reply");
  }

  return reply;
}
