import { GEMINI_API_KEY } from "./secret.js";

const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  GUEST: "GUEST",
};

const AI_MODEL = "gemini-3.5-flash-lite";

const FRIDGE_FILE = "./fridge.json";
const USERS_FILE = "./users.json";

// Единый список категорий для всего приложения.
// Из него строится <select> в форме, и он же подставляется в промт для Gemini.
// Один источник — значит, списки в форме и в промте никогда не разойдутся.
const CATEGORIES = [
  "Молочные продукты",
  "Выпечка",
  "Фрукты",
  "Овощи",
  "Мясо и рыба",
  "Бакалея",
  "Другое",
];

// Сюда попадает всё, что не подошло ни под одну категорию.
const DEFAULT_CATEGORY = "Другое";

// Значения фильтра. Должны совпадать с data-filter у кнопок в index.html.
const FILTERS = {
  ALL: "all",
  TO_BUY: "toBuy",
  BOUGHT: "bought",
};

export {
  ROLES,
  AI_MODEL,
  FRIDGE_FILE,
  USERS_FILE,
  GEMINI_API_KEY,
  CATEGORIES,
  DEFAULT_CATEGORY,
  FILTERS,
};
