console.log("hw_30 run");

// Если изменить адрес на неправильный userzzz получим ошибку API error + 404 Failed to load resource
const API_URL = "https://jsonplaceholder.typicode.com/users";

// Проверяет одного пользователя.
// Сама ошибку НЕ ловит — только бросает (throw).
// Ловит тот, кто её вызывает (try...catch в цикле).
function validateUser(user) {
    if (!user.name) {
        throw new Error("User name is missing");
    }
    if (!user.email) {
        throw new Error("User email is missing");
    }
    if (typeof user.id !== "number") {
        throw new Error("User id must be a number");
    }
}

axios.get(API_URL)
    .then(function (response) {
        const users = response.data;

        // ⭐ Дополнительное задание:

        // users[0].email = null;

        users.forEach((user) => {
            // try...catch ВНУТРИ цикла: ошибка одного пользователя
            // не останавливает проверку остальных,
            // в отличии-от того если-бы мы обернули весь forEach целиком ловим Validation error: User email is missing
            try {
                validateUser(user);
                console.log(`User is valid: ${user.name}`);
            } catch (error) {
                console.log(`Validation error: ${error.message}`);
            }
        });
    })
    .catch(function (error) {
        // Сюда попадаем, только если не удалось получить данные от API
        console.log("API error");
    });

const title = document.querySelector("p");
title.classList.add("highLight");

console.log("hw_30 end");
