/* HasnAI Brain v1 — privacy-first offline fallback + secure online AI connector.
   Set window.HASNAI_AI_ENDPOINT to your own HTTPS backend URL after deploying it.
   Never put provider API keys in this Android app. */
(() => {
  "use strict";
  const clean = value => String(value || "").trim();
  const replies = [
    { keys: ["namaste", "नमस्ते", "hello", "हेलो", "hi", "हाय"], answer: "नमस्ते! मैं HasnAI हूँ। बताइए, आज क्या करना है?" },
    { keys: ["kaise ho", "कैसे हो"], answer: "मैं बढ़िया हूँ! आपकी मदद के लिए तैयार हूँ।" },
    { keys: ["tum kaun", "आप कौन", "तुम कौन", "who are you"], answer: "मैं HasnAI हूँ, आपका व्यक्तिगत AI सहायक।" },
    { keys: ["thank", "धन्यवाद", "शुक्रिया"], answer: "आपका स्वागत है।" },
    { keys: ["help", "मदद", "क्या कर सकते"], answer: "मैं सवालों के जवाब, गणित, हिंदी बातचीत और जानकारी खोजने में मदद कर सकता हूँ। ऑनलाइन AI के लिए सुरक्षित सर्वर कनेक्शन सेट होना बाकी है।" },
    { keys: ["trading", "ट्रेडिंग", "chart", "चार्ट", "crypto", "क्रिप्टो"], answer: "Trading analysis के लिए coin या asset का नाम और chart का timeframe बताइए। मैं trend, support, resistance और risk को समझने में मदद करूँगा; यह financial advice नहीं है।" }
  ];
  async function ask(message) {
    const prompt = clean(message);
    if (!prompt) return "कृपया अपना सवाल लिखें या बोलें।";
    const endpoint = clean(window.HASNAI_AI_ENDPOINT);
    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: prompt, language: "hi", app: "HasnAI" })
        });
        if (!response.ok) throw new Error("AI server HTTP " + response.status);
        const data = await response.json();
        const answer = clean(data.answer || data.reply || data.output);
        if (answer) return answer;
      } catch (error) {
        console.warn("HasnAI online brain unavailable:", error);
      }
    }
    const normalized = prompt.toLowerCase();
    const match = replies.find(item => item.keys.some(key => normalized.includes(key)));
    if (match) return match.answer;
    return "मैंने आपका सवाल समझने की कोशिश की, लेकिन मेरा offline brain इसका भरोसेमंद जवाब नहीं दे पा रहा। Online AI जोड़ने के लिए सुरक्षित AI server configure करना होगा।";
  }
  window.HasnAIBrain = Object.freeze({ ask, version: "1.0.0", onlineReady: () => !!clean(window.HASNAI_AI_ENDPOINT) });
})();