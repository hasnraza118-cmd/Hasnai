// HasnAI secure AI gateway — Cloudflare Worker
// Configure OPENAI_API_KEY as a Worker secret. Never put it in the Android app.
const SYSTEM_PROMPT = `You are HasnAI, a helpful personal assistant. Reply naturally in the user's language, especially Hindi/Hinglish. Be honest about uncertainty. Do not claim to control the phone, unlock it, access private files, or perform actions. Ask permission before suggesting consequential actions. For crypto/trading, explain trend, support/resistance and risk only from supplied data; never promise profit or invent live prices. State when live chart/market data is missing.`;

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return Response.json({ error: "Use POST" }, { status: 405, headers: cors });
    if (!env.OPENAI_API_KEY) return Response.json({ error: "AI gateway is not configured" }, { status: 503, headers: cors });
    try {
      const body = await request.json();
      const message = String(body.message || "").trim();
      if (!message || message.length > 8000) {
        return Response.json({ error: "Message must be 1–8000 characters" }, { status: 400, headers: cors });
      }
      const upstream = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + env.OPENAI_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || "gpt-6.2-astra",
          instructions: SYSTEM_PROMPT,
          input: message,
          max_output_tokens: 700,
          store: false
        })
      });
      const data = await upstream.json();
      if (!upstream.ok) {
        return Response.json({ error: "AI provider request failed", detail: data.error?.message || "Unknown provider error" }, { status: 502, headers: cors });
      }
      const answer = (data.output || [])
        .filter(item => item.type === "message")
        .flatMap(item => item.content || [])
        .filter(part => part.type === "output_text")
        .map(part => part.text)
        .join("\n").trim();
      if (!answer) return Response.json({ error: "No text response received" }, { status: 502, headers: cors });
      return Response.json({ answer }, { headers: cors });
    } catch (error) {
      return Response.json({ error: "Invalid request or gateway error" }, { status: 400, headers: cors });
    }
  }
};
