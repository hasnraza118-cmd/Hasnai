# HasnAI AI Gateway

This folder contains a Cloudflare Worker that securely calls the OpenAI Responses API. The API key stays on the server and is never included in the APK.

## Deploy (one-time setup)
1. Create a Cloudflare account and a Worker named `hasnai-ai`.
2. Deploy `worker.js` as the Worker source.
3. In Worker Settings → Variables and Secrets, add a **secret** named `OPENAI_API_KEY` with your own OpenAI API key. Never paste the key into GitHub, HTML, or chat.
4. (Optional) Add a text variable `OPENAI_MODEL` if you want to choose another model supported by your API account.
5. Copy the Worker HTTPS URL.

## Connect the Android app
In `ai-brain.js`, set `window.HASNAI_AI_ENDPOINT` to the Worker HTTPS URL near the top of the file. Rebuild the APK after saving.

## Important
- OpenAI API usage is billed separately from a ChatGPT subscription.
- Do not expose the Worker URL as a secret; protect it with rate limits / authentication before public distribution.
- Requests use `store: false`; the gateway does not intentionally save conversation history.
- This gateway does not provide live market prices or chart feeds. Trading analysis needs actual chart/market data as input.
