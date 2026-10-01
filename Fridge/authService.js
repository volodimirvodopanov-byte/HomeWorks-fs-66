import { ROLES } from "./config.js";

// Чистые функции: ничего не загружают сами, работают только с тем,
// что им передали. Список пользователей загружает main.js.

export function getUserByName(users, userName) {
  const clearName = userName.trim().toLowerCase();

  return users.find((user) => user.name.toLowerCase() === clearName);
}

// Имитация аутентификации: пароля нет, пользователя узнаём по имени.
// Найден     -> возвращаем его вместе с настоящей ролью.
// Не найден  -> считаем гостем и выдаём роль GUEST.
export function getAuthenticatedUser(users, userName) {
  if (!Array.isArray(users)) {
    throw new Error("Список пользователей повреждён: ожидался массив.");
  }

  const user = getUserByName(users, userName);

  if (user) {
    return user;
  }

  return { name: userName.trim(), role: ROLES.GUEST };
}
