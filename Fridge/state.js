import { CATEGORIES, FILTERS } from "./config.js";
import { isDuplicate, getNextId, filterByStatus } from "./productService.js";

// Единственное место, где хранятся и меняются данные.
// DOM этот файл не трогает: после изменения main.js сам вызывает рендер.

// ===================== Состояние =====================

// let, а не const: при сохранении черновика products получает новый массив.
let products = [
  {
    id: 1,
    name: "Молоко",
    category: "Молочные продукты",
    bought: false,
  },
  {
    id: 2,
    name: "Хлеб",
    category: "Выпечка",
    bought: true,
  },
  {
    id: 3,
    name: "Сыр",
    category: "Молочные продукты",
    bought: false,
  },
  {
    id: 4,
    name: "Яблоки",
    category: "Фрукты",
    bought: false,
  },
];

// Какая кнопка фильтра сейчас выбрана.
// Без этого после клика по продукту фильтр «сбрасывался» бы на «Все».
let currentFilter = FILTERS.ALL;

// null — черновика нет. Массив — черновик открыт, все изменения идут в него.
let draftProducts = null;

// ===================== Чтение состояния =====================

// С каким массивом сейчас работаем: черновик, если он открыт, иначе основной.
// ?? берёт правое значение, только если левое null или undefined.
export function getActiveProducts() {
  return draftProducts ?? products;
}

// Что показать на экране: активный массив, пропущенный через фильтр.
export function getVisibleProducts() {
  return filterByStatus(getActiveProducts(), currentFilter);
}

export function getCurrentFilter() {
  return currentFilter;
}

export function isDraftMode() {
  return draftProducts !== null;
}

// ===================== Изменение состояния =====================

// Добавление одного продукта (ручная форма).
// Ошибки бросаем: пользователь должен увидеть, что пошло не так.
export function addProduct(name, category) {
  const cleanName = String(name ?? "").trim();

  if (cleanName === "") {
    throw new Error("Введите название продукта");
  }

  if (!CATEGORIES.includes(category)) {
    throw new Error(`Неизвестная категория: ${category}`);
  }

  // Добавляем в активный массив, а не в отфильтрованную копию:
  // копия исчезнет при следующем рендере вместе с новым продуктом.
  const activeProducts = getActiveProducts();

  if (isDuplicate(activeProducts, cleanName)) {
    throw new Error(`«${cleanName}» уже есть в списке`);
  }

  const newProduct = {
    id: getNextId(activeProducts),
    name: cleanName,
    category,
    bought: false,
  };

  activeProducts.push(newProduct);

  return newProduct;
}

// Добавление списка продуктов от AI.
// Дубли пропускаем молча: один повтор не должен отменять остальные продукты.
// Возвращает массив реально добавленных продуктов.
export function addMissingProducts(items) {
  const addedProducts = [];

  for (const item of items) {
    if (isDuplicate(getActiveProducts(), item.name)) {
      continue;
    }

    addedProducts.push(addProduct(item.name, item.category));
  }

  return addedProducts;
}

// Куплено <-> не куплено.
// find() возвращает сам объект из массива, а не копию,
// поэтому изменение bought сразу видно в массиве.
export function toggleProduct(id) {
  const product = getActiveProducts().find((item) => item.id === id);

  if (!product) {
    throw new Error(`Продукт с id ${id} не найден`);
  }

  product.bought = !product.bought;
}

// Меняется только выбранный фильтр, сам массив не трогаем.
export function filterProducts(filter) {
  if (!Object.values(FILTERS).includes(filter)) {
    throw new Error(`Неизвестный фильтр: ${filter}`);
  }

  currentFilter = filter;
}

// ===================== Черновик =====================

// structuredClone, а не [...products]:
// spread копирует только массив, а объекты внутри остались бы общими,
// и правка черновика испортила бы основной список.
export function createDraft() {
  if (isDraftMode()) {
    return;
  }

  draftProducts = structuredClone(products);
}

// Черновик становится текущим состоянием. Здесь и нужен let у products.
export function saveDraft() {
  if (!isDraftMode()) {
    return;
  }

  products = draftProducts;
  draftProducts = null;
}

// Черновик выбрасываем, products никто не трогал — он остался как был.
export function cancelDraft() {
  draftProducts = null;
}
