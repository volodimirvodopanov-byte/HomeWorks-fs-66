// Функции для работы со списком продуктов.
// Нормализация нужна ТОЛЬКО для сравнения, на экран выводим исходное название.
// ё -> е: иначе «Свекла» из fridge.json и «Свёкла» от Gemini считались бы разными.
export function normalizeProductName(productName) {
  return String(productName ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("ё", "е");
}

// Убирает дубли внутри массива (с учётом регистра, пробелов и ё/е).
// Оставляет первое встретившееся написание продукта.
export function getUniqueProducts(productNames) {
  const seenKeys = new Set();
  const uniqueProducts = [];

  for (const productName of productNames) {
    const cleanName = String(productName ?? "").trim();
    const key = normalizeProductName(cleanName);

    if (key === "" || seenKeys.has(key)) {
      continue;
    }

    seenKeys.add(key);
    uniqueProducts.push(cleanName);
  }

  return uniqueProducts;
}

// Gemini иногда оборачивает JSON в ```json ... ```, и JSON.parse на этом падает.
// Убираем обёртки перед разбором.
export function parseProductList(aiAnswer) {
  const cleanAnswer = aiAnswer.replace(/```json|```/g, "").trim();

  let parsed;

  try {
    parsed = JSON.parse(cleanAnswer);
  } catch {
    throw new Error("AI вернул ответ не в виде списка. Попробуйте ещё раз.");
  }

  const isListOfStrings =
    Array.isArray(parsed) && parsed.every((item) => typeof item === "string");

  if (!isListOfStrings) {
    throw new Error("AI вернул не список продуктов. Попробуйте ещё раз.");
  }

  return parsed;
}
