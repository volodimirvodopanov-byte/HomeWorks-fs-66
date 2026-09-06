// Программа запрашивает наименование продуктов в вашем холодильнике
// и их количество. После ввода всех продуктов, программа выводит список
// продуктов с их количеством и сохраняет данные в виде CSV в
// файл в корне проекта.

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

// --- Экранирование одного CSV-поля (RFC 4180) ---
function escapeCsvField(value) {
  const str = String(value);
  const needsQuoting =
    str.includes(",") || str.includes('"') || str.includes("\n");

  if (!needsQuoting) {
    return str;
  }

  const escaped = str.replaceAll('"', '""');
  return `"${escaped}"`;
}

// --- Сборка CSV-строки из массива продуктов ---
function fridgeToCsv(fridge) {
  const header = "Наименование,Количество";
  const rows = fridge.map(
    (product) =>
      `${escapeCsvField(product.name)},${escapeCsvField(product.count)}`,
  );
  return [header, ...rows].join("\n");
}

// --- Разбор одной CSV-строки обратно в массив полей (с учётом кавычек) ---
function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (insideQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"'; // экранированная кавычка внутри поля
        i++; // пропускаем вторую кавычку пары
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ",") {
        fields.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  fields.push(current);
  return fields;
}

// --- Разбор всего CSV-файла обратно в массив объектов { name, count } ---
function csvToFridge(csvContent) {
  const lines = csvContent.split("\n").filter((line) => line.trim() !== "");
  const dataLines = lines.slice(1); // пропускаем заголовок

  return dataLines.map((line) => {
    const [name, count] = parseCsvLine(line);
    return { name, count: Number(count) };
  });
}

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

    const exitWords = ["exit", "выход", "стоп", "stop"];
    if (exitWords.includes(trimmedName.toLowerCase())) {
      break;
    }

    if (trimmedName === "") {
      console.log(
        "Наименование продукта не может быть пустым. Попробуйте снова.",
      );
      continue;
    }

    const countInput = await rl.question(
      `Введите количество продукта "${trimmedName}": `,
    );
    const trimmedCount = countInput.trim();

    // Number("") === 0, а не NaN — поэтому пустую строку проверяем отдельно,
    // до преобразования в число
    if (trimmedCount === "") {
      console.log("Количество не может быть пустым. Попробуйте снова.");
      continue;
    }

    const count = Number(trimmedCount);

    if (Number.isNaN(count)) {
      console.log("Количество введено некорректно. Попробуйте снова.");
      continue;
    }

    if (count < 0) {
      console.log("Количество не может быть отрицательным. Попробуйте снова.");
      continue;
    }

    // Сравнение без учёта регистра: "Хлеб" и "хлеб" — один и тот же продукт.
    // При этом само название в массиве сохраняем как ввёл пользователь.
    const idx = fridge.findIndex(
      (product) => product.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (idx !== -1 && count === 0) {
      fridge.splice(idx, 1);
      console.log(`Продукт "${trimmedName}" удалён из списка.`);
    } else if (idx !== -1) {
      fridge[idx].count = count;
      console.log(
        `Количество продукта "${trimmedName}" обновлено:`,
        fridge[idx],
      );
    } else if (count === 0) {
      // Новый продукт с нулевым количеством — добавлять нечего и нечего удалять
      console.log(`Продукта "${trimmedName}" нет в списке, нечего удалять.`);
      continue;
    } else {
      fridge.push({ name: trimmedName, count });
      console.log("Продукт добавлен:", { name: trimmedName, count });
    }

    console.log("Текущий список продуктов:");
    console.table(fridge);
  }

  rl.close();

  if (fridge.length > 0) {
    const filePath = path.resolve("fridge.csv");
    try {
      const csvContent = fridgeToCsv(fridge);
      await writeFile(filePath, csvContent, "utf-8");
      console.log(`Данные о продуктах сохранены в файл: ${filePath}`);

      console.log("Считываем данные из файла...");
      const fileData = await readFile(filePath, "utf-8");
      console.log("Данные из файла (CSV):\n", fileData);

      const savedProducts = csvToFridge(fileData);
      console.log("Данные из файла (объект):", savedProducts);

      console.log("Список продуктов в холодильнике:");
      console.table(savedProducts);
    } catch (error) {
      console.error("Ошибка при работе с файлом:", error.message);
    }
  } else {
    console.log("Список продуктов пуст. Данные не были сохранены.");
  }
}

runFridgeApp();
