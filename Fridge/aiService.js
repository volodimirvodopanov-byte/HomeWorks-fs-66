import { AI_MODEL, GEMINI_API_KEY } from "./config.js";

// HTTP-запрос к REST API Gemini через fetch.

export async function askAi(prompt) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
    throw new Error("Не найден ключ Gemini API. Проверьте файл secret.js");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    // Тело ошибки может оказаться не JSON — тогда подставим пустой объект.
    const errorData = await response.json().catch(() => ({}));

    console.error("Gemini error:", errorData);

    throw new Error(
      errorData.error?.message || `Ошибка Gemini: ${response.status}`,
    );
  }

  const data = await response.json();

  const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!answer) {
    throw new Error("AI вернул пустой ответ. Попробуйте ещё раз.");
  }

  return answer;
}
