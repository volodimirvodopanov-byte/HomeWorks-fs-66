//=========HW_26: пользователь с самой высокой температурой===========
// Пользователи — через axios, погода — через fetch

import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// ===== Запросы к API =====

// Получает массив пользователей (axios).
// axios сам выбрасывает ошибку, если сервер ответил не кодом 2xx,
async function getUsers() {
  const response = await axios.get(USERS_URL);

  // Проверка типа - ждём массив
  if (!Array.isArray(response.data)) {
    throw new Error("Сервер пользователей вернул не массив");
  }

  return response.data;
}

// Получает текущую температуру по координатам (fetch).
// fetch не выбрасывает ошибку при 404/500 — проверяем response.ok сами.
async function getTemperature(latitude, longitude) {
  const url = `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Ошибка погоды для координат ${latitude}, ${longitude}: статус ${response.status}`,
    );
  }

  const dataObj = await response.json();
  const temperature = dataObj?.current_weather?.temperature;

  // Температура должна быть настоящим числом, иначе сравнение сломается
  if (typeof temperature !== "number" || Number.isNaN(temperature)) {
    throw new Error(
      `В ответе нет температуры для координат ${latitude}, ${longitude}`,
    );
  }

  return temperature;
}

// ===== Подготовка и проверка данных =====
function parseCoordinate(raw) {
  if (typeof raw !== "string" && typeof raw !== "number") {
    return null;
  }

  if (String(raw).trim() === "") {
    return null;
  }

  const value = Number(raw);
  return Number.isNaN(value) ? null : value;
}

// Берём у пользователя только нужные поля.
// ?. — чтобы не упасть, если у пользователя нет address или geo.
function extractUserInfo(user) {
  return {
    id: user?.id,
    name: user?.name,
    telephone: user?.phone,
    latitude: parseCoordinate(user?.address?.geo?.lat),
    longitude: parseCoordinate(user?.address?.geo?.lng),
  };
}

// Широта: от -90 до 90, долгота: от -180 до 180.
// null проверяем первым: иначе null >= -90 даст true (null превращается в 0).
function isValidCoordinates(latitude, longitude) {
  if (latitude === null || longitude === null) {
    return false;
  }

  return (
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
  );
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

// Проверяем обработаные данные пользователя.
function validatePerson(person) {
  if (!isNonEmptyString(person.name)) {
    return { valid: false, error: "нет имени" };
  }

  if (!isNonEmptyString(person.telephone)) {
    return { valid: false, error: "нет телефона" };
  }

  if (!isValidCoordinates(person.latitude, person.longitude)) {
    return { valid: false, error: "некорректные координаты" };
  }

  return { valid: true };
}

// ===== Обработка результата =====

// Возвращаем пользователя с самой высокой температурой или null, если сравнивать некого.
//  При равных температурах остаётся тот, кто встретился первым.
function findHottestUser(people) {
  if (people.length === 0) {
    return null;
  }

  return people.reduce((hottest, person) =>
    person.temperature > hottest.temperature ? person : hottest,
  );
}

// Печатает то, что требует задание.
function printUser(person) {
  if (person === null) {
    console.log(
      "Не удалось определить пользователя с самой высокой температурой.",
    );
    return;
  }

  console.log("=== Самая высокая температура ===");
  console.log(`Имя: ${person.name}`);
  console.log(`Телефон: ${person.telephone}`);
  console.log(`Температура: ${person.temperature}°C`);
}

// ===== Головная функция =====

async function main() {
  try {
    const users = await getUsers();
    const people = [];

    for (const user of users) {
      const person = extractUserInfo(user);
      const check = validatePerson(person);

      // Некорректные данные не отправляем в API погоды, а пропускаем с пометкой
      if (!check.valid) {
        console.warn(`Пользователь id=${person.id} пропущен: ${check.error}`);
        continue;
      }

      // Ошибка сети или сервера здесь остановит всю программу!!!
      const temperature = await getTemperature(
        person.latitude,
        person.longitude,
      );

      people.push({ ...person, temperature });
    }

    console.log(
      `Пользователей получено: ${users.length}, с погодой: ${people.length}\n`,
    );

    const hottest = findHottestUser(people);
    printUser(hottest);
  } catch (error) {
    console.error("Ошибка при получении данных:", error.message);
  }
}

main();
