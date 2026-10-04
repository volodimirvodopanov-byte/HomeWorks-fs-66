import { CATEGORIES } from "./config.js";
import {
  categorySelect,
  filterButtons,
  createDraftButton,
  saveDraftButton,
  cancelDraftButton,
  draftBadge,
  productList,
  roleBadge,
  result,
  errorModal,
  errorMessage,
} from "./dom.js";

// Функции этого файла только РИСУЮТ. Данные они не меняют,
// всё нужное получают параметрами.

// ===================== Список продуктов =====================

function createProductItem(product) {
  const li = document.createElement("li");
  li.className = "product";

  // Связь DOM-элемента с объектом в массиве.
  // При клике прочитаем id обратно через li.dataset.id (там будет строка!).
  li.dataset.id = product.id;

  // Второй аргумент toggle: true — класс добавить, false — убрать.
  // Вид «куплено» описан в style.css, здесь только переключаем класс.
  li.classList.toggle("product--bought", product.bought);

  const name = document.createElement("span");
  name.className = "product__name";
  name.textContent = product.name;

  const category = document.createElement("span");
  category.className = "product__category";
  category.textContent = product.category;

  li.append(name, category);

  return li;
}

// Перерисовывает список целиком по переданному массиву.
// Ей всё равно, полный это список или отфильтрованный.
export function renderProducts(productsToRender) {
  if (productsToRender.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "products__empty";
    emptyItem.textContent = "В этом списке пока ничего нет.";

    productList.replaceChildren(emptyItem);
    return;
  }

  // replaceChildren удаляет старые <li> и вставляет новые одним действием.
  productList.replaceChildren(...productsToRender.map(createProductItem));
}

// ===================== Форма и кнопки =====================

// Варианты <select> создаём из CATEGORIES, а не пишем руками в HTML:
// так список категорий существует только в одном месте — в config.js.
export function renderCategoryOptions() {
  const options = CATEGORIES.map((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    return option;
  });

  categorySelect.replaceChildren(...options);
}

// Подсвечивает кнопку выбранного фильтра.
// aria-pressed сообщает программам чтения с экрана, какая кнопка нажата.
export function renderFilterButtons(currentFilter) {
  for (const button of filterButtons) {
    const isActive = button.dataset.filter === currentFilter;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

// Вне черновика видна только «Создать черновик»,
// в черновике — «Сохранить» и «Отменить» и пометка о режиме.
export function renderDraftControls(isDraft) {
  createDraftButton.hidden = isDraft;
  saveDraftButton.hidden = !isDraft;
  cancelDraftButton.hidden = !isDraft;
  draftBadge.hidden = !isDraft;
}

// ===================== Помощник AI =====================

export function showRole(user) {
  roleBadge.textContent = user ? `${user.name} — роль ${user.role}` : "";
}

export function showResult(text) {
  result.textContent = text;
}

// ===================== Ошибки =====================

export function showError(message) {
  errorMessage.textContent = message;
  errorModal.showModal();
}
