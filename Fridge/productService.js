import { CATEGORIES, DEFAULT_CATEGORY, FILTERS } from "./config.js";

// Чистые функции: получают массив параметром, ничего не хранят
// и не трогают DOM. Состояние живёт в state.js.

// Нормализация нужна ТОЛЬКО для сравнения, на экран выводим исходное название.
// ё -> е: иначе «Свекла» и «Свёкла» считались бы разными продуктами.
export function normalizeProductName(productName) {
  return String(productName ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("ё", "е");
}

// Есть ли в списке продукт с таким названием?
// some() отвечает true/false и останавливается на первом совпадении.
export function isDuplicate(productsList, productName) {
  const key = normalizeProductName(productName);

  return productsList.some(
    (product) => normalizeProductName(product.name) === key,
  );
}

// Следующий свободный id: максимальный существующий + 1.
// 0 первым аргументом защищает от пустого списка:
// Math.max() без аргументов вернёт -Infinity, а Math.max(0) вернёт 0.
export function getNextId(productsList) {
  const ids = productsList.map((product) => product.id);

  return Math.max(0, ...ids) + 1;
}

// filter() всегда возвращает НОВЫЙ массив, исходный не меняется.
// Для «Все» тоже отдаём копию, чтобы функция вела себя одинаково во всех случаях.
export function filterByStatus(productsList, filter) {
  switch (filter) {
    case FILTERS.TO_BUY:
      return productsList.filter((product) => !product.bought);

    case FILTERS.BOUGHT:
      return productsList.filter((product) => product.bought);

    default:
      return [...productsList];
  }
}

// Если категории нет в нашем списке — подставляем категорию по умолчанию.
// Так AI не сможет «придумать» новую категорию вроде «Свежие овощи».
export function normalizeCategory(category) {
  const cleanCategory = String(category ?? "").trim();

  return CATEGORIES.includes(cleanCategory) ? cleanCategory : DEFAULT_CATEGORY;
}

// Разбор ответа Gemini. Не доверяем ответу вслепую:
// 1) убираем обёртку ```json ... ```, на которой падает JSON.parse;
// 2) проверяем, что это массив;
// 3) элементы без названия отбрасываем — без имени продукт бессмыслен;
// 4) неизвестную категорию исправляем на «Другое» — её можно починить.
export function parseProductList(aiAnswer) {
  const cleanAnswer = aiAnswer.replace(/```json|```/g, "").trim();

  let parsed;

  try {
    parsed = JSON.parse(cleanAnswer);
  } catch {
    throw new Error("AI вернул ответ не в виде списка. Попробуйте ещё раз.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("AI вернул не список продуктов. Попробуйте ещё раз.");
  }

  return parsed
    .filter((item) => typeof item?.name === "string" && item.name.trim() !== "")
    .map((item) => ({
      name: item.name.trim(),
      category: normalizeCategory(item.category),
    }));
}
