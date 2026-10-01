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
    const existingName = li.textContent.trim().toLowerCase();
    if (newName === existingName) {
      return true;
    }
  }
  return false;
}

function addProduct(productName) {
  if (hasProduct(productName)) {
    return false;
  }

  const li = document.createElement("li");
  li.textContent = productName;
  list.append(li);
  return true;
}

function addProductsFromArray(products) {
  products.forEach((productName) => {
    addProduct(productName);
  });
}

function handleSubmit(e) {
  e.preventDefault();
  const productName = input.value.trim();
  if (!productName) {
    return;
  }

  if (!addProduct(productName)) {
    errorMessage.textContent = "Продукт с таким названием уже существует!";
    return;
  }

  errorMessage.textContent = "";
  input.value = "";
  input.focus();
}

function handleShowList() {
  addProductsFromArray(productsV2);
}

function handleAddFromList() {
  addProductsFromArray(productsV3);
}

form.addEventListener("submit", handleSubmit);
showButton.addEventListener("click", handleShowList);
listButton.addEventListener("click", handleAddFromList);
