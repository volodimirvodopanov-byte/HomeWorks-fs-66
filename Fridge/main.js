import { readFromJsonFile } from "./fileService.js";
import { getAuthenticatedUser } from "./authService.js";
import { FRIDGE_FILE, USERS_FILE } from "./config.js";
import { createBasePromptByRole, createPrompt } from "./promptService.js";
import { askAi } from "./aiService.js";

// ===================== Элементы страницы =====================

const form = document.getElementById("searchForm");
const userNameInput = document.getElementById("userName");
const dishTitleInput = document.getElementById("dishTitle");
const searchButton = document.getElementById("searchButton");
const roleBadge = document.getElementById("roleBadge");
const result = document.getElementById("result");

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

// ===================== Логика =====================

// Весь путь от имени и блюда до ответа AI.
// Страницы касается только в одном месте — показывает роль пользователя.
async function searchDish(userName, dishTitle) {
  const users = await readFromJsonFile(USERS_FILE);
  const authenticatedUser = getAuthenticatedUser(users, userName);

  roleBadge.textContent = `${authenticatedUser.name} — роль ${authenticatedUser.role}`;

  const products = await readFromJsonFile(FRIDGE_FILE);

  // Для роли GUEST эта функция бросит ошибку — её поймает catch в handleSearch !!! ???
  const basePrompt = createBasePromptByRole(authenticatedUser);
  const prompt = createPrompt(basePrompt, dishTitle, products);

  return askAi(prompt);
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

    const answer = await searchDish(userName, dishTitle);

    result.textContent = answer;
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
