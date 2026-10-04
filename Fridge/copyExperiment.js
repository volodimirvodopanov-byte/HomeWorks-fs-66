// Эксперимент из ТЗ: поверхностная копия против глубокой.
// Результат смотреть в консоли браузера (F12 → Console).
// Работаем на отдельном маленьком массиве, чтобы не испортить настоящий список.

export function runCopyExperiment() {
  const original = [
    { id: 1, name: "Молоко", bought: false },
    { id: 2, name: "Хлеб", bought: true },
  ];

  // 1. Простое присваивание: копии нет вообще, обе переменные — один массив.
  const sameArray = original;

  console.group("1. const copy = original");
  console.log("original === copy:", original === sameArray);
  console.groupEnd();

  // 2. Spread: новый массив, но внутри ССЫЛКИ на те же объекты.
  const shallowCopy = [...original];
  shallowCopy[0].bought = true;

  console.group("2. const copy = [...original]");
  console.log("original === copy:", original === shallowCopy);
  console.log("original[0] === copy[0]:", original[0] === shallowCopy[0]);
  console.log("Меняли копию, а original[0].bought стал:", original[0].bought);
  console.groupEnd();

  // Возвращаем исходное значение, которое испортила поверхностная копия.
  original[0].bought = false;

  // 3. structuredClone: копируется и массив, и каждый объект внутри.
  const deepCopy = structuredClone(original);
  deepCopy[0].bought = true;

  console.group("3. const copy = structuredClone(original)");
  console.log("original === copy:", original === deepCopy);
  console.log("original[0] === copy[0]:", original[0] === deepCopy[0]);
  console.log(
    "Меняли копию, а original[0].bought остался:",
    original[0].bought,
  );
  console.groupEnd();
}
