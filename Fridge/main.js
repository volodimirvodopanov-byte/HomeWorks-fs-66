import { readFromJsonFile } from "./fileService.js";
import { getAuthenticatedUser } from "./authService.js";
import { FRIDGE_FILE, USERS_FILE, ROLES } from "./config.js";
import { createBasePromptByRole, createPrompt } from "./promptService.js";
import { askAi } from "./aiService.js";
import { parseProductList } from "./productService.js";
import { runCopyExperiment } from "./copyExperiment.js";
import {
  getVisibleProducts,
  getCurrentFilter,
  isDraftMode,
  addProduct,
  addMissingProducts,
  toggleProduct,
  filterProducts,
  createDraft,
  saveDraft,
  cancelDraft,
} from "./state.js";
import {
  renderProducts,
  renderCategoryOptions,
  renderFilterButtons,
  renderDraftControls,
  showRole,
  showResult,
  showError,
} from "./render.js";
import {
  addForm,
  productNameInput,
  categorySelect,
  filtersBlock,
  createDraftButton,
  saveDraftButton,
  cancelDraftButton,
  productList,
  searchForm,
  userNameInput,
  dishTitleInput,
  searchButton,
  errorModal,
  closeModalButton,
} from "./dom.js";

// main.js — только связка: слушает события, вызывает state.js, потом рендер.
// Схема из ТЗ: изменение массива -> рендер -> DOM.

// Перерисовать всё, что зависит от состояния.
// Вызывается после ЛЮБОГО изменения данных.
function updateView() {
  renderProducts(getVisibleProducts());
  renderFilterButtons(getCurrentFilter());
  renderDraftControls(isDraftMode());
}

// ===================== Список покупок =====================

function handleAddProduct(event) {
  event.preventDefault();

  try {
    addProduct(productNameInput.value, categorySelect.value);

    productNameInput.value = "";
    productNameInput.focus();
    updateView();
  } catch (error) {
    showError(error.message);
  }
}

// Делегирование: один обработчик на весь <ul> вместо обработчика на каждый <li>.
// Клик по <li> или по <span> внутри него всплывает до <ul>.
// Это обязательно, а не только красиво: renderProducts каждый раз создаёт
// новые <li>, и обработчики на старых пропадали бы вместе с ними.
function handleProductClick(event) {
  // closest найдёт <li> с data-id, даже если кликнули по <span> внутри.
  // Строку «список пуст» (без data-id) он не найдёт — тогда выходим.
  const item = event.target.closest("li[data-id]");

  if (!item) {
    return;
  }

  try {
    // dataset всегда возвращает строку, а id в массиве — числа.
    toggleProduct(Number(item.dataset.id));
    updateView();
  } catch (error) {
    showError(error.message);
  }
}

// Тоже делегирование: один обработчик на блок с тремя кнопками.
function handleFilterClick(event) {
  const button = event.target.closest("button[data-filter]");

  if (!button) {
    return;
  }

  filterProducts(button.dataset.filter);
  updateView();
}

function handleCreateDraft() {
  createDraft();
  updateView();
}

function handleSaveDraft() {
  saveDraft();
  updateView();
}

function handleCancelDraft() {
  cancelDraft();
  updateView();
}

// ===================== Помощник AI =====================

function validateInput(userName, dishTitle) {
  if (!userName) {
    throw new Error("Введите имя пользователя");
  }

  if (!dishTitle) {
    throw new Error("Введите название блюда");
  }
}

// Весь путь от имени и блюда до ответа AI.
// Возвращает пользователя (нужна его роль) и текст ответа.
async function searchDish(userName, dishTitle) {
  const users = await readFromJsonFile(USERS_FILE);
  const authenticatedUser = getAuthenticatedUser(users, userName);

  showRole(authenticatedUser);

  // fridge.json — то, что уже лежит в холодильнике. Он нужен только для промта:
  // список покупок на странице — это отдельные данные в state.js.
  const fridgeProducts = await readFromJsonFile(FRIDGE_FILE);

  // Для роли GUEST эта функция бросит ошибку — её поймает catch в handleSearch.
  const basePrompt = createBasePromptByRole(authenticatedUser);
  const prompt = createPrompt(basePrompt, dishTitle, fridgeProducts);

  const answer = await askAi(prompt);

  return { user: authenticatedUser, answer };
}

// ADMIN: ответ разбираем и добавляем недостающие продукты в список покупок.
// Сначала массив (addMissingProducts), потом рендер — как и везде.
function showAdminResult(answer) {
  const items = parseProductList(answer);
  const addedProducts = addMissingProducts(items);

  updateView();

  showResult(
    addedProducts.length > 0
      ? `Добавлено в список: ${addedProducts.map((p) => p.name).join(", ")}`
      : "Все нужные продукты уже есть в списке.",
  );
}

async function handleSearch(event) {
  // Без этого браузер перезагрузит страницу при отправке формы.
  event.preventDefault();

  const userName = userNameInput.value.trim();
  const dishTitle = dishTitleInput.value.trim();

  try {
    validateInput(userName, dishTitle);

    // Пока идёт запрос, кнопка выключена — повторно отправить форму нельзя.
    searchButton.disabled = true;
    showRole(null);
    showResult("Спрашиваю AI, подождите…");

    const { user, answer } = await searchDish(userName, dishTitle);

    if (user.role === ROLES.ADMIN) {
      showAdminResult(answer);
    } else {
      // USER: просто показываем, что использовать из холодильника.
      showResult(answer);
    }
  } catch (error) {
    console.error("ERROR:", error);
    showResult("");
    showError(error.message);
  } finally {
    searchButton.disabled = false;
  }
}

// ===================== Подписка на события =====================

addForm.addEventListener("submit", handleAddProduct);
productList.addEventListener("click", handleProductClick);
filtersBlock.addEventListener("click", handleFilterClick);

createDraftButton.addEventListener("click", handleCreateDraft);
saveDraftButton.addEventListener("click", handleSaveDraft);
cancelDraftButton.addEventListener("click", handleCancelDraft);

// submit срабатывает и по клику на кнопку, и по Enter в любом поле формы.
searchForm.addEventListener("submit", handleSearch);

// Escape <dialog> закрывает сам, здесь — только кнопка «Закрыть».
closeModalButton.addEventListener("click", () => {
  errorModal.close();
});

// ===================== Старт =====================

renderCategoryOptions();
updateView();
runCopyExperiment();
