import { readFromJsonFile } from "./fileService.js";
import { getAuthenticatedUser } from "./authService.js";
import { FRIDGE_FILE, USERS_FILE, ROLES } from "./config.js";
import { createBasePromptByRole, createPrompt } from "./promptService.js";
import { askAi } from "./aiService.js";
import {
  normalizeProductName,
  getUniqueProducts,
  parseProductList,
} from "./productService.js";

// ===================== Элементы страницы =====================

const form = document.getElementById("searchForm");
const userNameInput = document.getElementById("userName");
const dishTitleInput = document.getElementById("dishTitle");
const searchButton = document.getElementById("searchButton");
const roleBadge = document.getElementById("roleBadge");
const result = document.getElementById("result");
const productList = document.getElementById("productList");

const errorModal = document.getElementById("errorModal");
const errorMessage = document.getElementById("errorMessage");
const closeModal = document.getElementById("closeModal");

// ===================== Вспомогательные функции =====================

function validateInput(userName, dishTitle) {
  if (!userName) {
    throw new Error("Введите имя пользователя");
  }

  if (!dishTitle) {
    throw new Error("Введите название блюда");
  }
}

function showError(message) {
  errorMessage.textContent = message;
  errorModal.showModal();
}

// ==== Список продуктов на странице =====

//  ТЗ: «Есть ли такой продукт уже на странице?»
// Сравниваем названия
function isProductOnPage(productName) {
  const key = normalizeProductName(productName);
  const items = [...productList.children];

  return items.some((li) => normalizeProductName(li.textContent) === key);
}

function createProductItem(productName, isNew) {
  const li = document.createElement("li");
  li.textContent = productName;

  if (isNew) {
    // Пометка «купить» рисуется в CSS через ::after,
    // поэтому в textContent она не попадает и сравнению не мешает.
    li.classList.add("product--new");
  }

  return li;
}

// ЕДИНОЕ правило добавления для любых источников
// (продукты холодильника при загрузке и ответ Gemini):
// убрать дубли -> оставить только отсутствующие -> добавить в DOM.
// Возвращает массив реально добавленных продуктов.
function addMissingProducts(productNames, isNew = false) {
  const uniqueProducts = getUniqueProducts(productNames);
  const missingProducts = uniqueProducts.filter(
    (productName) => !isProductOnPage(productName),
  );

  for (const productName of missingProducts) {
    productList.append(createProductItem(productName, isNew));
  }

  return missingProducts;
}

// При открытии страницы показываем, что уже есть в холодильнике.
async function showFridgeProducts() {
  const products = await readFromJsonFile(FRIDGE_FILE);

  if (!Array.isArray(products)) {
    throw new Error("Список продуктов повреждён: ожидался массив.");
  }

  addMissingProducts(products.map((product) => product.name));
}

// ===================== Логика =====================

// Весь путь от имени и блюда до ответа AI.
// Возвращает пользователя (нужна его роль) и текст ответа.
async function searchDish(userName, dishTitle) {
  const users = await readFromJsonFile(USERS_FILE);
  const authenticatedUser = getAuthenticatedUser(users, userName);

  roleBadge.textContent = `${authenticatedUser.name} — роль ${authenticatedUser.role}`;

  const products = await readFromJsonFile(FRIDGE_FILE);

  // Для роли GUEST эта функция бросит ошибку — её поймает catch в handleSearch.
  const basePrompt = createBasePromptByRole(authenticatedUser);
  const prompt = createPrompt(basePrompt, dishTitle, products);

  const answer = await askAi(prompt);

  return { user: authenticatedUser, answer };
}

// Вариант 4: Admin получает список недостающих и дописывает их в список на странице.
function showAdminResult(answer) {
  const productNames = parseProductList(answer);
  const addedProducts = addMissingProducts(productNames, true);

  result.textContent =
    addedProducts.length > 0
      ? `Добавлено в список: ${addedProducts.join(", ")}`
      : "Все нужные продукты уже есть в списке.";
}

// ===================== Обработчик формы =====================

async function handleSearch(event) {
  // Без этого браузер перезагрузит страницу при отправке формы.
  event.preventDefault();

  const userName = userNameInput.value.trim();
  const dishTitle = dishTitleInput.value.trim();

  try {
    validateInput(userName, dishTitle);

    // Пока идёт запрос, кнопка выключена — ни кликом, ни Enter повторно отправить форму нельзя
    searchButton.disabled = true;
    roleBadge.textContent = "";
    result.textContent = "Спрашиваю AI, подождите…";

    const { user, answer } = await searchDish(userName, dishTitle);

    if (user.role === ROLES.ADMIN) {
      showAdminResult(answer);
    } else {
      // USER — сценарий ДЗ 28 без изменений: просто показываем ответ.
      result.textContent = answer;
    }
  } catch (error) {
    console.error("ERROR:", error);
    result.textContent = "";
    showError(error.message);
  } finally {
    searchButton.disabled = false;
  }
}

// submit срабатывает и по клику на кнопку, и по Enter в любом поле формы.
form.addEventListener("submit", handleSearch);

// Escape <dialog> закрывает сам, здесь — только кнопка «Закрыть».
closeModal.addEventListener("click", () => {
  errorModal.close();
});

// Загружаем продукты холодильника сразу при открытии страницы.
showFridgeProducts().catch((error) => {
  console.error("ERROR:", error);
  showError(error.message);
});
