/* =========== Variant 1-2-3 ============
app
├── h1       «Список продуктов»
├── form
│   ├── input
│   ├── button «Добавить»              ← вариант 1
│   ├── button «Показать список»       ← вариант 2
│   └── button «Добавить из списка»    ← вариант 3
├── p        сообщение об ошибке
└── ul       список продуктов
*/

const app = document.querySelector("#app");

const productsV2 = ["Молоко", "Хлеб", "Сыр", "Молоко", "Яйца", "Хлеб"];
const productsV3 = ["Молоко", "Картофель", "Лук", "Молоко", "Морковь"];

function createUI(app) {
  const title = document.createElement("h1");
  title.textContent = "Список продуктов";
  app.append(title);

  const form = document.createElement("form");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Название продукта";

  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Добавить";

  const showButton = document.createElement("button");
  showButton.type = "button";
  showButton.textContent = "Показать список";

  const listButton = document.createElement("button");
  listButton.type = "button";
  listButton.textContent = "Добавить из списка";

  form.append(input, button, showButton, listButton);

  const errorMessage = document.createElement("p");
  errorMessage.style.color = "red";

  const list = document.createElement("ul");
  app.append(form, errorMessage, list);

  return { form, input, list, errorMessage, showButton, listButton };
}

const { form, input, list, errorMessage, showButton, listButton } =
  createUI(app);

function hasProduct(productName) {
  const newName = productName.trim().toLowerCase();
  for (const li of list.querySelectorAll("li")) {
    const existingName = li.dataset.name.trim().toLowerCase();
    if (newName === existingName) {
      return true;
    }
  }
  return false;
}

function addProduct(rawName) {
  const productName = String(rawName ?? "").trim();

  if (productName === "") {
    return "empty";
  }

  if (hasProduct(productName)) {
    return "duplicate";
  }

  const li = document.createElement("li");
  li.textContent = productName;
  li.dataset.name = productName;
  list.append(li);
  return "added";
}

function addProductsFromArray(products) {
  products.forEach((productName) => {
    addProduct(productName);
  });
}

function handleSubmit(e) {
  e.preventDefault();
  const status = addProduct(input.value);

  if (status === "empty") {
    errorMessage.textContent = "Введите название продукта";
    return;
  }

  if (status === "duplicate") {
    errorMessage.textContent = "Продукт с таким названием уже существует!";
    return;
  }

  errorMessage.textContent = "";
  input.value = "";
  input.focus();
}

function handleShowList() {
  errorMessage.textContent = "";
  addProductsFromArray(productsV2);
}

function handleAddFromList() {
  errorMessage.textContent = "";
  addProductsFromArray(productsV3);
}

form.addEventListener("submit", handleSubmit);
showButton.addEventListener("click", handleShowList);
listButton.addEventListener("click", handleAddFromList);
// Один обработчик на весь список: работает и для продуктов, добавленных позже.
// Клик по продукту добавляет надпись «куплено», повторный клик убирает её.
list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) {
    return;
  }

  const mark = li.querySelector(".mark");

  if (mark) {
    mark.remove();
  } else {
    const newMark = document.createElement("span");
    newMark.className = "mark";
    newMark.textContent = " — куплено";
    li.append(newMark);
  }
});
