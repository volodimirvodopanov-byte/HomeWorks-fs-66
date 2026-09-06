// Программа запрашивает наименование продуктов в вашем холодильнике
// и их количество. После ввода всех продуктов, программа выводит список
// продуктов с их количеством и сохраняет данные в виде JSON в
// файл в корне проекта.
// readline.createInterface() используется для создания интерфейса
// чтения данных из стандартного ввода (stdin) и записи данных в
// стандартный вывод (stdout).

// JSON.stringify(fridge, null, 2 ) используется для преобразования
// объекта JavaScript в строку JSON,
// где null означает, что не используется функция замены replacer,
// а 2 указывает на количество пробелов для отступа в формате JSON.

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

async function runFridgeApp() {
  const rl = readline.createInterface({ input, output });
  const fridge = [];

  console.log("Программа для учета продуктов в холодильнике.");
  console.log(
    "Введите продукты в холодильнике. Для завершения введите 'exit', 'выход', 'стоп' или 'stop'.",
  );

  while (true) {
    const name = await rl.question("Введите наименование продукта: ");
    const trimmedName = name.trim();

    // --- Пункт 2: несколько стоп-слов, без учёта регистра ---
    const exitWords = ["exit", "выход", "стоп", "stop"];
    if (exitWords.includes(trimmedName.toLowerCase())) {
      break;
    }

    if (trimmedName === "") {
      // Проверка на пустую строку
      console.log(
        "Наименование продукта не может быть пустым. Попробуйте снова.",
      );
      continue;
    }

    const countInput = await rl.question(
      `Введите количество продукта "${trimmedName}": `,
    );
    const count = Number(countInput.trim()); // "12ю5" -->> NaN

    if (Number.isNaN(count)) {
      console.log("Количество введено некорректно. Попробуйте снова.");
      continue;
    }

    // Ищем, есть ли уже такой продукт в массиве
    const idx = fridge.findIndex((product) => product.name === trimmedName);

    if (idx !== -1 && count === 0) {
      fridge.splice(idx, 1);
      console.log(`Продукт "${trimmedName}" удалён из списка.`);
    } else if (idx !== -1) {
      fridge[idx].count = count;
      console.log(
        `Количество продукта "${trimmedName}" обновлено:`,
        fridge[idx],
      );
    } else {
      fridge.push({ name: trimmedName, count });
      console.log("Продукт добавлен:", { name: trimmedName, count });
    }

    console.log("Текущий список продуктов:");
    console.table(fridge);
  }

  rl.close(); // Закрываем интерфейс readline после завершения ввода данных

  if (fridge.length > 0) {
    const filePath = path.resolve("fridge.json"); // Путь к файлу в корне проекта
    try {
      // 1. Сохраняем данные в файл
      await writeFile(filePath, JSON.stringify(fridge, null, 2), "utf-8");
      console.log(`Данные о продуктах сохранены в файл: ${filePath}`);

      // 2. Читаем данные из файла
      console.log("Считываем данные из файла...");
      const fileData = await readFile(filePath, "utf-8");
      console.log("Данные из файла:", fileData);

      // 3. Преобразуем данные из JSON в объект JavaScript
      const saveProducts = JSON.parse(fileData);
      console.log("Данные из файла (объект):", saveProducts);

      // 4. Выводим список продуктов с их количеством красиво
      console.log("1. Список продуктов в холодильнике:");
      saveProducts.forEach((product) => {
        console.log(`- ${product.name}: ${product.count}`);
      });
      console.log("2. Список продуктов в холодильнике:");
      console.table(saveProducts);
    } catch (error) {
      console.error("Ошибка при работе с файлом:", error.message);
    }
  } else {
    console.log("Список продуктов пуст. Данные не были сохранены.");
  }
}

runFridgeApp();

/*
1.ADV. САМОСТОЯТЕЛЬНО ИЗУЧИТЬ
Переделайте программу так, чтобы она сохраняла данные в CSV файл (такая возможность есть в Экселе)
в корне проекта вместо JSON файла.
*/
