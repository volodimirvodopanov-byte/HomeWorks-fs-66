// ========Рефакторинг программы учёта продуктов в холодильнике=============

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

// =========Работа с JSON-файлом===========

// Записывает массив в файл в формате JSON.
// null — не используем функцию-замену (replacer), 2 — отступ в 2 пробела.
async function writeToJsonFile(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Читает файл и превращает JSON-текст обратно в массив объектов.
async function readFromJsonFile(filePath) {
  const fileData = await readFile(filePath, "utf-8");
  return JSON.parse(fileData);
}

// Дописывает новые элементы к тем, что уже лежат в файле.
// В этом задании не используется, но пусть остаётся в наборе инструментов.
async function appendToJsonFile(filePath, data) {
  const existingData = await readFromJsonFile(filePath);
  const updatedData = [...existingData, ...data];
  await writeToJsonFile(filePath, updatedData);
}

// Печатает СЫРОЕ содержимое файла — как текст, без разбора.
// Нужна, чтобы глазами убедиться: в файле лежит именно то, что мы записали.
async function displayFileJsonContents(filePath) {
  const fileData = await readFile(filePath, "utf-8");
  console.log("Содержимое файла (сырой текст):");
  console.log(fileData);
}

// ===========Работа с массивом продуктов=============

// Поиск продукта по имени БЕЗ учёта регистра: "Хлеб" и "хлеб" — одно и то же.
// Возвращает индекс или -1.
function findProductIndex(fridge, name) {
  return fridge.findIndex(
    (product) => product.name.toLowerCase() === name.toLowerCase(),
  );
}

// Добавляет новый продукт или обновляет существующий.
// Возвращает "added" или "updated" — чтобы вызывающий код знал,
// какое сообщение напечатать.
function addOrUpdateProduct(fridge, name, count, price, expDate) {
  const idx = findProductIndex(fridge, name);

  if (idx !== -1) {
    fridge[idx].count += count; // количество НАКАПЛИВАЕТСЯ
    fridge[idx].price = price; // цена перезаписывается на новую
    fridge[idx].expDate = expDate; // срок годности тоже
    return "updated";
  }

  fridge.push({ name, count, price, expDate });
  return "added";
}

// Удаляет продукт по имени.
// Возвращает true, если было что удалять, и false, если такого продукта нет.
function removeProduct(fridge, name) {
  const idx = findProductIndex(fridge, name);

  if (idx === -1) {
    return false;
  }

  fridge.splice(idx, 1);
  return true;
}

// ===========Вывод на экран===========

function displayFridgeContents(fridge) {
  console.log("=== Содержимое холодильника ===");

  if (fridge.length === 0) {
    console.log("Холодильник пуст.");
    return;
  }

  fridge.forEach((product, index) => {
    console.log(
      `${index + 1}. ${product.name}: ${product.count} шт., ` +
        `${product.price} $, годен до ${product.expDate}`,
    );
  });
}

// ==========Проверка пользовательского ввода=========

// Разбирает строку в неотрицательное число.
// Возвращает число или null, если ввод некорректный.
// Пустую строку проверяем ОТДЕЛЬНО: Number("") === 0, а не NaN.
function parseNonNegativeNumber(raw) {
  const trimmed = raw.trim();

  if (trimmed === "") {
    return null;
  }

  const value = Number(trimmed);

  if (Number.isNaN(value) || value < 0) {
    return null;
  }

  return value;
}

// Проверяет дату в формате YYYY-MM-DD.
// Отсекает и мусор ("завтра"), и несуществующие даты ("2026-02-31").
function isValidExpDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  // Если дата "поехала" (31 февраля → 3 марта), значит её не существует
  return date.toISOString().slice(0, 10) === value;
}

// =======сохранение в CSV============

// Экранирование одного поля по правилам RFC 4180:
// если внутри есть запятая, кавычка или перевод строки — берём поле в кавычки,
// а внутренние кавычки удваиваем.
function escapeCsvField(value) {
  const str = String(value);
  const needsQuoting =
    str.includes(",") || str.includes('"') || str.includes("\n");

  if (!needsQuoting) {
    return str;
  }

  return `"${str.replaceAll('"', '""')}"`;
}

// Собирает весь массив в одну CSV-строку.
function fridgeToCsv(fridge) {
  const header = "Наименование,Количество,Цена,СрокГодности";
  const rows = fridge.map((product) =>
    [product.name, product.count, product.price, product.expDate]
      .map(escapeCsvField)
      .join(","),
  );

  return [header, ...rows].join("\n");
}

// Разбирает ОДНУ строку CSV в массив полей, помня про кавычки.
function parseCsvLine(line) {
  const fields = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (insideQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"'; // удвоенная кавычка = одна настоящая
        i++; // пропускаем вторую кавычку пары
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      insideQuotes = true;
    } else if (char === ",") {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current);
  return fields;
}

// Превращает весь текст CSV обратно в массив объектов.
function csvToFridge(csvContent) {
  const lines = csvContent.split("\n").filter((line) => line.trim() !== "");
  const dataLines = lines.slice(1); // пропускаем заголовок

  return dataLines.map((line) => {
    const [name, count, price, expDate] = parseCsvLine(line);
    return { name, count: Number(count), price: Number(price), expDate };
  });
}

async function writeToCsvFile(filePath, fridge) {
  await writeFile(filePath, fridgeToCsv(fridge), "utf-8");
}

async function readFromCsvFile(filePath) {
  const fileData = await readFile(filePath, "utf-8");
  return csvToFridge(fileData);
}

// ======Главная функция — только диалог с пользователем=======

async function runFridgeApp(jsonFileName, csvFileName, stopWords) {
  const rl = readline.createInterface({ input, output });
  const fridge = [];

  console.log("Программа для учёта продуктов в холодильнике.");
  console.log(
    `Для завершения введите: ${stopWords.join(", ")} (без учёта регистра).`,
  );
  console.log("Количество 0 — удалить продукт из списка.\n");

  while (true) {
    const name = await rl.question("Наименование продукта: ");
    const trimmedName = name.trim();

    if (stopWords.includes(trimmedName.toLowerCase())) {
      break;
    }

    if (trimmedName === "") {
      console.log("Наименование не может быть пустым. Попробуйте снова.\n");
      continue;
    }

    const count = parseNonNegativeNumber(
      await rl.question(`Количество "${trimmedName}": `),
    );

    if (count === null) {
      console.log("Количество введено некорректно. Попробуйте снова.\n");
      continue;
    }

    // Ветка удаления: цену и срок годности спрашивать незачем
    if (count === 0) {
      const wasRemoved = removeProduct(fridge, trimmedName);

      console.log(
        wasRemoved
          ? `Продукт "${trimmedName}" удалён из списка.`
          : `Продукта "${trimmedName}" нет в списке — удалять нечего.`,
      );

      displayFridgeContents(fridge);
      console.log("");
      continue;
    }

    const price = parseNonNegativeNumber(
      await rl.question(`Цена "${trimmedName}" ($): `),
    );

    if (price === null) {
      console.log("Цена введена некорректно. Попробуйте снова.\n");
      continue;
    }

    const expDate = (
      await rl.question(`Срок годности "${trimmedName}" (YYYY-MM-DD): `)
    ).trim();

    if (!isValidExpDate(expDate)) {
      console.log("Дата некорректна. Нужен формат YYYY-MM-DD.\n");
      continue;
    }

    const action = addOrUpdateProduct(
      fridge,
      trimmedName,
      count,
      price,
      expDate,
    );

    console.log(action === "added" ? "Продукт добавлен." : "Продукт обновлён.");

    displayFridgeContents(fridge);
    console.log("");
  }

  rl.close();

  if (fridge.length === 0) {
    console.log("Список продуктов пуст. Данные не были сохранены.");
    return;
  }

  const jsonPath = path.resolve(jsonFileName);
  const csvPath = path.resolve(csvFileName);

  try {
    // --- JSON ---
    await writeToJsonFile(jsonPath, fridge);
    console.log(`\nДанные сохранены в JSON: ${jsonPath}\n`);

    await displayFileJsonContents(jsonPath);

    const savedProducts = await readFromJsonFile(jsonPath);
    console.log("\nПрочитано из JSON и разобрано в массив:");
    displayFridgeContents(savedProducts);
    console.table(savedProducts);

    // --- CSV ---
    await writeToCsvFile(csvPath, fridge);
    console.log(`\nДанные сохранены в CSV: ${csvPath}`);

    const fromCsv = await readFromCsvFile(csvPath);
    console.log("Прочитано из CSV и разобрано в массив:");
    console.table(fromCsv);
  } catch (error) {
    console.error("Ошибка при работе с файлом:", error.message);
  }
}

// ============================================================================

const jsonFileName = "fridge.json";
const csvFileName = "fridge.csv";
const stopWords = ["exit", "выход", "стоп", "stop"];

runFridgeApp(jsonFileName, csvFileName, stopWords);
