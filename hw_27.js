// ===================== HW_27 FRIDGE =====================

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";

// ===================== Настройки =====================

const FRIDGE_FILE = path.resolve("fridge.json");
const SHOPPING_FILE = path.resolve("shopping-list.json");
const AI_MODEL = "gemini-3.6-flash";
const MAX_LOGIN_ATTEMPTS = 3;

// ===================== Имитация БД пользователей =====================
// Пароли открытым текстом — ТОЛЬКО для учебного примера.

const users = [
  { login: "alex", password: "1111", name: "Alex", role: "USER" },
  { login: "john", password: "2222", name: "John", role: "ADMIN" },
];

// ===================== Работа с JSON =====================

async function writeToJsonFile(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Читает JSON. Если файла ещё нет — возвращает значение по умолчанию.
// Если файл есть, но испорчен — выбрасывает понятную ошибку.
async function readFromJsonFile(filePath, defaultValue) {
  try {
    const fileData = await readFile(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") {
      return defaultValue; // файла нет — это нормально при первом запуске
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Файл ${filePath} повреждён: внутри не JSON.`);
    }
    throw error; // любая другая ошибка — пробрасываем дальше
  }
}

// ===================== Контроль доступа =====================

const ACTIONS = [
  "viewFridge",
  "addProduct",
  "removeProduct",
  "getRecipe",
  "viewShoppingList",
  "addToShoppingList",
  "removeFromShoppingList",
  "orderProducts",
];

const USER_FORBIDDEN_ACTIONS = ["removeFromShoppingList", "orderProducts"];

function can(user, action) {
  if (!ACTIONS.includes(action)) {
    return false; // неизвестное действие — запрещено
  }
  if (user.role === "ADMIN") {
    return true; // админ может всё
  }
  if (user.role === "USER") {
    return !USER_FORBIDDEN_ACTIONS.includes(action);
  }
  return false; // неизвестная роль — доступ запрещён по умолчанию
}

// ===================== Аутентификация =====================

function authenticate(loginInput, passwordInput) {
  const login = loginInput.trim().toLowerCase();
  return (
    users.find((u) => u.login === login && u.password === passwordInput) ?? null
  );
}

async function login(rl) {
  for (let attempt = 1; attempt <= MAX_LOGIN_ATTEMPTS; attempt++) {
    const loginInput = await rl.question("Логин: ");
    const passwordInput = await rl.question("Пароль: ");
    const user = authenticate(loginInput, passwordInput);

    if (user) {
      console.log(`\nПривет, ${user.name}! Роль: ${user.role}\n`);
      return user;
    }

    console.log(
      `Неверный логин или пароль. Осталось попыток: ${MAX_LOGIN_ATTEMPTS - attempt}\n`,
    );
  }
  return null;
}

// ===================== Работа с массивом продуктов =====================

function findProductIndex(list, name) {
  return list.findIndex(
    (product) => product.name.toLowerCase() === name.toLowerCase(),
  );
}

function addOrUpdateProduct(fridge, name, count, price, expDate) {
  const idx = findProductIndex(fridge, name);

  if (idx !== -1) {
    fridge[idx].count += count;
    fridge[idx].price = price;
    fridge[idx].expDate = expDate;
    return "updated";
  }

  fridge.push({ name, count, price, expDate });
  return "added";
}

// Работает и для холодильника, и для списка покупок
function removeProduct(list, name) {
  const idx = findProductIndex(list, name);

  if (idx === -1) {
    return false;
  }

  list.splice(idx, 1);
  return true;
}

function addToShoppingList(shoppingList, name, count) {
  const idx = findProductIndex(shoppingList, name);

  if (idx !== -1) {
    shoppingList[idx].count += count;
    return "updated";
  }

  shoppingList.push({ name, count });
  return "added";
}

// Даты в формате YYYY-MM-DD можно сравнивать как строки.
function getUsableProducts(fridge) {
  const today = new Date().toISOString().slice(0, 10);
  return fridge.filter((product) => product.expDate >= today);
}

// ===================== Вывод на экран =====================

function displayFridgeContents(fridge) {
  console.log("=== Содержимое холодильника ===");

  if (fridge.length === 0) {
    console.log("Холодильник пуст.");
    return;
  }

  fridge.forEach((product, index) => {
    console.log(
      `${index + 1}. ${product.name}: ${product.count} шт., ` +
        `${product.price} $, годен до ${product.expDate}`,
    );
  });
}

function displayShoppingList(shoppingList) {
  console.log("=== Список покупок ===");

  if (shoppingList.length === 0) {
    console.log("Список покупок пуст.");
    return;
  }

  shoppingList.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name}: ${item.count}`);
  });
}

// ===================== Проверка ввода =====================

function parseNonNegativeNumber(raw) {
  const trimmed = raw.trim();

  if (trimmed === "") {
    return null;
  }

  const value = Number(trimmed);

  if (Number.isNaN(value) || value < 0) {
    return null;
  }

  return value;
}

function isValidExpDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.toISOString().slice(0, 10) === value;
}

// ===================== AI ПРОМТ п.3–5) =====================

function createBasePrompt() {
  return `
Ты — квалифицированный повар.
Тебе дают список продуктов из холодильника и, возможно, название желаемого блюда.
Твоя задача — предложить до 3 рецептов.

Правила:
- в "ingredients" перечисли все продукты, нужные для рецепта;
- в "missing" перечисли только те продукты, которых НЕТ в холодильнике;
- названия продуктов пиши на русском, в именительном падеже;
- "steps" — короткие шаги приготовления.

Отвечай СТРОГО в формате JSON, без пояснений и без markdown:
{"recipes":[{"title":"...","ingredients":["..."],"missing":["..."],"steps":["..."]}]}
`;
}

function createPrompt(basePrompt, dishTitle, availableProducts) {
  // отправляем AI только нужное — имя и количество, без цен и дат
  const productsText =
    availableProducts.length > 0
      ? availableProducts.map((p) => `${p.name} (${p.count})`).join(", ")
      : "холодильник пуст";

  const dishText = dishTitle
    ? `Желаемое блюдо: ${dishTitle}.`
    : "Блюдо не выбрано: предложи блюда, для которых подходит больше всего имеющихся продуктов.";

  return `${basePrompt}
${dishText}
Продукты в холодильнике: ${productsText}.`;
}

async function askAi(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "Не найден GEMINI_API_KEY. Запустите: node --env-file=.env smartFridge.js",
    );
  }

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await genAI.models.generateContent({
    model: AI_MODEL,
    contents: prompt,
  });

  if (!response.text) {
    throw new Error("AI вернул пустой ответ.");
  }

  return response.text;
}

// ======== Проверка ответа AI ===========
function parseAiRecipes(aiText) {
  const cleanText = aiText.replace(/```json|```/g, "").trim();

  let data;
  try {
    data = JSON.parse(cleanText);
  } catch {
    throw new Error("AI ответил не в формате JSON. Попробуйте ещё раз.");
  }

  if (!Array.isArray(data.recipes) || data.recipes.length === 0) {
    throw new Error("В ответе AI нет списка рецептов.");
  }

  return data.recipes.map((recipe) => ({
    title: String(recipe.title ?? "Без названия"),
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map(String)
      : [],
    missing: Array.isArray(recipe.missing) ? recipe.missing.map(String) : [],
    steps: Array.isArray(recipe.steps) ? recipe.steps.map(String) : [],
  }));
}

// Настоящая ссылка на поиск рецепта — AI не может её выдумать
function createRecipeSearchLink(title) {
  return `https://www.google.com/search?q=${encodeURIComponent(title + " рецепт")}`;
}

// ===================== Обработчики пунктов меню =====================

async function handleViewFridge(rl, user, state) {
  displayFridgeContents(state.fridge);
}

async function handleAddProduct(rl, user, state) {
  const name = (await rl.question("Наименование продукта: ")).trim();

  if (name === "") {
    console.log("Наименование не может быть пустым.");
    return;
  }

  const count = parseNonNegativeNumber(
    await rl.question(`Количество "${name}": `),
  );

  if (count === null || count === 0) {
    console.log("Количество должно быть числом больше 0.");
    return;
  }

  const price = parseNonNegativeNumber(
    await rl.question(`Цена "${name}" ($): `),
  );

  if (price === null) {
    console.log("Цена введена некорректно.");
    return;
  }

  const expDate = (
    await rl.question(`Срок годности "${name}" (YYYY-MM-DD): `)
  ).trim();

  if (!isValidExpDate(expDate)) {
    console.log("Дата некорректна. Нужен формат YYYY-MM-DD.");
    return;
  }

  const action = addOrUpdateProduct(state.fridge, name, count, price, expDate);
  await writeToJsonFile(FRIDGE_FILE, state.fridge);

  console.log(action === "added" ? "Продукт добавлен." : "Продукт обновлён.");
}

async function handleRemoveProduct(rl, user, state) {
  const name = (await rl.question("Какой продукт удалить: ")).trim();

  if (removeProduct(state.fridge, name)) {
    await writeToJsonFile(FRIDGE_FILE, state.fridge);
    console.log(`Продукт "${name}" удалён из холодильника.`);
  } else {
    console.log(`Продукта "${name}" нет в холодильнике.`);
  }
}

async function handleGetRecipe(rl, user, state) {
  const dishTitle = (
    await rl.question("Какое блюдо хотите? (Enter — AI предложит сам): ")
  ).trim();

  const usableProducts = getUsableProducts(state.fridge);
  const prompt = createPrompt(createBasePrompt(), dishTitle, usableProducts);

  console.log("\nСпрашиваю AI, подождите...");
  const aiResponse = await askAi(prompt);
  const recipes = parseAiRecipes(aiResponse);

  console.log("\n=== Варианты ===");
  recipes.forEach((recipe, index) => {
    console.log(`${index + 1}. ${recipe.title}`);
  });

  const choice = parseNonNegativeNumber(
    await rl.question(`Выберите рецепт (1–${recipes.length}): `),
  );

  if (
    choice === null ||
    !Number.isInteger(choice) ||
    choice < 1 ||
    choice > recipes.length
  ) {
    console.log("Такого варианта нет.");
    return;
  }

  const recipe = recipes[choice - 1];

  console.log(`\n=== ${recipe.title} ===`);
  console.log("Ингредиенты:", recipe.ingredients.join(", "));
  recipe.steps.forEach((step, index) => {
    console.log(`  ${index + 1}) ${step}`);
  });
  console.log(
    "Найти рецепт в интернете:",
    createRecipeSearchLink(recipe.title),
  );

  // Урок 14: перепроверяем AI — вдруг он назвал недостающим то, что у нас есть
  const reallyMissing = recipe.missing.filter(
    (name) => findProductIndex(usableProducts, name) === -1,
  );

  if (reallyMissing.length === 0) {
    console.log("\nВсе продукты есть — можно готовить!");
    return;
  }

  console.log("\nНе хватает:", reallyMissing.join(", "));

  if (!can(user, "addToShoppingList")) {
    return;
  }

  const answer = (
    await rl.question("Добавить недостающее в список покупок? (да/нет): ")
  )
    .trim()
    .toLowerCase();

  if (["да", "д", "yes", "y"].includes(answer)) {
    reallyMissing.forEach((name) =>
      addToShoppingList(state.shoppingList, name, 1),
    );
    await writeToJsonFile(SHOPPING_FILE, state.shoppingList);
    console.log("Добавлено в список покупок.");
  }
}

async function handleViewShoppingList(rl, user, state) {
  displayShoppingList(state.shoppingList);
}

async function handleAddToShoppingList(rl, user, state) {
  const name = (await rl.question("Что купить: ")).trim();

  if (name === "") {
    console.log("Наименование не может быть пустым.");
    return;
  }

  const count = parseNonNegativeNumber(
    await rl.question(`Сколько "${name}": `),
  );

  if (count === null || count === 0) {
    console.log("Количество должно быть числом больше 0.");
    return;
  }

  addToShoppingList(state.shoppingList, name, count);
  await writeToJsonFile(SHOPPING_FILE, state.shoppingList);
  console.log("Добавлено в список покупок.");
}

async function handleRemoveFromShoppingList(rl, user, state) {
  const name = (await rl.question("Что удалить из списка покупок: ")).trim();

  if (removeProduct(state.shoppingList, name)) {
    await writeToJsonFile(SHOPPING_FILE, state.shoppingList);
    console.log(`"${name}" удалён из списка покупок.`);
  } else {
    console.log(`"${name}" нет в списке покупок.`);
  }
}

// Имитация заказа в интернет-магазине
async function handleOrderProducts(rl, user, state) {
  if (state.shoppingList.length === 0) {
    console.log("Список покупок пуст — заказывать нечего.");
    return;
  }

  displayShoppingList(state.shoppingList);

  const answer = (await rl.question("Оформить заказ? (да/нет): "))
    .trim()
    .toLowerCase();

  if (!["да", "д", "yes", "y"].includes(answer)) {
    console.log("Заказ отменён.");
    return;
  }

  console.log(`Заказ от ${user.name} отправлен в магазин (имитация).`);
  state.shoppingList.length = 0; // очищаем тот же массив
  await writeToJsonFile(SHOPPING_FILE, state.shoppingList);
}

// ===================== Меню =====================

const menu = [
  {
    key: "1",
    title: "Что в холодильнике",
    action: "viewFridge",
    handler: handleViewFridge,
  },
  {
    key: "2",
    title: "Положить продукт",
    action: "addProduct",
    handler: handleAddProduct,
  },
  {
    key: "3",
    title: "Удалить продукт (съели)",
    action: "removeProduct",
    handler: handleRemoveProduct,
  },
  {
    key: "4",
    title: "Рецепт от AI",
    action: "getRecipe",
    handler: handleGetRecipe,
  },
  {
    key: "5",
    title: "Список покупок",
    action: "viewShoppingList",
    handler: handleViewShoppingList,
  },
  {
    key: "6",
    title: "Добавить в список покупок",
    action: "addToShoppingList",
    handler: handleAddToShoppingList,
  },
  {
    key: "7",
    title: "Удалить из списка покупок",
    action: "removeFromShoppingList",
    handler: handleRemoveFromShoppingList,
  },
  {
    key: "8",
    title: "Заказать продукты в магазине",
    action: "orderProducts",
    handler: handleOrderProducts,
  },
];

function showMenu(user) {
  console.log("=== Меню ===");
  menu
    .filter((item) => can(user, item.action))
    .forEach((item) => console.log(`${item.key}. ${item.title}`));
  console.log("0. Выход");
}

// ===================== Главная функция =====================

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    const state = {
      fridge: await readFromJsonFile(FRIDGE_FILE, []),
      shoppingList: await readFromJsonFile(SHOPPING_FILE, []),
    };

    const user = await login(rl);

    if (!user) {
      console.log("Вход не выполнен. Программа завершена.");
      return;
    }

    while (true) {
      showMenu(user);
      const choice = (await rl.question("Выберите пункт: ")).trim();

      if (choice === "0") {
        console.log("До свидания!");
        break;
      }

      // Ищем во ВСЁМ меню, а не только в показанном
      const item = menu.find((menuItem) => menuItem.key === choice);

      if (!item) {
        console.log("Такого пункта нет.\n");
        continue;
      }

      // Проверяем роль перед действием, даже если пункт скрыт
      if (!can(user, item.action)) {
        console.log("Операция запрещена!\n");
        continue;
      }

      // Ошибка в одном пункте не роняет всю программу
      try {
        await item.handler(rl, user, state);
      } catch (error) {
        console.error("Ошибка:", error.message);
      }

      console.log("");
    }
  } catch (error) {
    console.error("Критическая ошибка:", error.message);
  } finally {
    rl.close();
  }
}

main();
