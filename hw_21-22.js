"use strict";

// ============================================================
//                  HW_21-22  |  ЗАДАНИЕ 1
// ============================================================

// --- 1a. Функция info, общая для всех товаров ---

// Функция объявлена ОДИН раз и лежит отдельно от объектов.
// Она обращается к this.name / this.price / this.description,
// а не к конкретному объекту — значит, подойдёт любому товару.
// this определяется в момент вызова: item.info() -> this === item.
//
// Обычная функция, не стрелочная: у стрелочной нет своего this,
// она взяла бы его из внешней области и не увидела бы поля товара.
function productInfo() {
  return `товар: ${this.name}; цена: ${this.price} описание: ${this.description}`;
}

// --- 1b. Конструктор товаров ---

// Имя с большой буквы — соглашение: вызывать только через new.
function Product(name, price, description) {
  this.name = name;
  this.price = price;
  this.description = description;

  // Присваиваем ССЫЛКУ на уже существующую функцию (без скобок!).
  // productInfo() вызвало бы её прямо здесь и записало бы в поле
  // строку вместо функции.
  //
  // Поле собственное, а не в прототипе, потому что по условию 1c
  // info должна попадать в перебор for...in вместе с остальными.
  this.info = productInfo;
}

// --- 1a + 1b. Массив товаров ---

// Первый — объект-литерал (как в 1a), остальные — через
// конструктор (как в 1b). Для функции вывода разницы нет:
// устроены они одинаково.
const products = [
  {
    name: "notebook lenovo thinkpad",
    price: 1283,
    description: "cpu intel core i7, ram: 16gb, ssd: 512gb",
    info: productInfo,
  },
  new Product("mouse logitech mx master 3", 99, "wireless, 8000 dpi, usb-c"),
  new Product("monitor dell ultrasharp u2723", 615, "27 inch, 4k, ips"),
  new Product("keyboard keychron k8 pro", 189, "mechanical, hot-swap"),
];

// Поле, дописанное уже после создания объекта. Проверка того,
// что printProducts не знает набор полей заранее.
products[1].note = "пробная партия";

// --- 1c. Вывод информации о всех товарах ---

function printProducts(arr) {
  // Защита от неверного аргумента: без неё forEach на строке или
  // на undefined уронит программу с TypeError.
  if (!Array.isArray(arr)) {
    console.log("printProducts: ожидался массив");
    return;
  }

  arr.forEach(function (item, index) {
    console.log(`Товар ${index + 1}`);

    // for...in по строке или числу перебрал бы индексы символов,
    // по null — упал бы. Пропускаем всё, что не объект.
    if (item === null || typeof item !== "object") {
      console.log("    (не объект)");
      return; // return внутри forEach = continue, а не выход из функции
    }

    // for...in даёт ИМЕНА полей: "name", "price", ...
    for (const key in item) {
      // Только собственные поля, не унаследованные от прототипа.
      // Object.hasOwn надёжнее, чем item.hasOwnProperty(key):
      // работает, даже если у объекта есть своё поле с таким именем.
      if (!Object.hasOwn(item, key)) {
        continue;
      }

      // Функцию вызываем именно через объект: item[key]().
      // Если положить её в переменную и вызвать отдельно —
      // this потеряется и внутри будет undefined.
      const value = typeof item[key] === "function" ? item[key]() : item[key];

      console.log(`    ${key}: ${value}`);
    }
  });
}

console.log("=== ЗАДАНИЕ 1 ===");
printProducts(products);

console.log("\n--- проверка защиты ---");
printProducts("не массив");

// ============================================================
//                  HW_21-22  |  ЗАДАНИЕ 2
// ============================================================

// --- вспомогательные функции ---

// Одна проверка суммы на все три метода — правило записано
// в одном месте, менять придётся тоже в одном.
//
// Number.isFinite отсекает сразу всё: строки, undefined, NaN,
// Infinity. Одного typeof мало: typeof NaN === "number",
// а NaN > 0 даёт false, поэтому NaN проскочил бы дальше
// и превратил баланс в NaN.
function isValidAmount(amount) {
  return Number.isFinite(amount) && amount > 0;
}

// --- 2a. Конструктор Account ---

function Account(iban, owner, balance) {
  this.iban = iban;
  this.owner = owner;

  // Начальный баланс тоже проверяем: new Account(..., "тысяча")
  // иначе создал бы счёт со строкой вместо числа.
  this.balance = Number.isFinite(balance) && balance >= 0 ? balance : 0;
}

// Методы — в прототипе, а не в конструкторе: они одинаковы для
// всех счетов, и незачем создавать их заново на каждый new.
// В задании 1 так сделать было нельзя — там info обязана
// попадать в for...in; здесь поля счёта печатаются вручную,
// так что ограничения нет.
Account.prototype.deposit = function (amount) {
  if (!isValidAmount(amount)) {
    return false; // возвращаем результат: по нему transfer поймёт, что делать
  }
  this.balance += amount;
  return true;
};

Account.prototype.withdraw = function (amount) {
  if (!isValidAmount(amount)) {
    return false;
  }
  if (amount > this.balance) {
    return false; // не хватило — баланс не трогаем
  }
  this.balance -= amount;
  return true;
};

Account.prototype.getBalance = function () {
  return this.balance;
};

const accounts = [
  new Account("IL62 0108 0000 0009 9999", "Avshalom Vodopianov", 5000),
  new Account("IL10 0102 0000 0001 1111", "Dina Katz", 1200),
  new Account("IL44 0105 0000 0007 7777", "Yossi Mizrahi", 80),
];

function printAccounts(arr) {
  if (!Array.isArray(arr)) {
    console.log("printAccounts: ожидался массив");
    return;
  }

  arr.forEach(function (account, index) {
    console.log(`Счёт ${index + 1}`);
    console.log(`    iban: ${account.iban}`);
    console.log(`    owner: ${account.owner}`);
    console.log(`    balance: ${account.getBalance()}`);
  });
}

console.log("\n=== ЗАДАНИЕ 2a ===");
printAccounts(accounts);

// --- 2b + 2c. Функция transfer ---

// Общая функция-«печать чека» для всех транзакций — тот же приём,
// что и с productInfo в задании 1.
//
// По условию transactionInfo «выводит информацию», поэтому здесь
// console.log, а не return. (В задании 1 сказано «формирует
// строку» — там был return.)
function transactionInfo() {
  if (this.error) {
    console.log(
      `ОШИБКА: перевод ${this.amount} со счёта ${ibanOf(this.account1)} ` +
        `на счёт ${ibanOf(this.account2)} не выполнен. Причина: ${this.error}`,
    );
  } else {
    console.log(
      `УСПЕХ: переведено ${this.amount} со счёта ${this.account1.iban} ` +
        `(${this.account1.owner}) на счёт ${this.account2.iban} ` +
        `(${this.account2.owner})`,
    );
  }
}

// Нужна для сообщения об ошибке: если в transfer передали не счёт,
// обращение к .iban дало бы undefined или уронило бы программу.
function ibanOf(account) {
  return account instanceof Account ? account.iban : "неизвестный счёт";
}

// transfer сама с балансами не работает — только вызывает методы
// счетов. Вся арифметика живёт внутри Account.
function transfer(account1, account2, amount) {
  // Заготовка «чека» — общая часть для обоих исходов.
  // Имена полей взяты из условия дословно.
  const transaction = {
    account1: account1,
    account2: account2,
    amount: amount,
    transactionInfo: transactionInfo,
  };

  // --- проверки ДО списания ---

  if (!(account1 instanceof Account) || !(account2 instanceof Account)) {
    transaction.error = "передан объект, не являющийся счётом";
    return transaction;
  }

  if (!isValidAmount(amount)) {
    transaction.error = "сумма перевода должна быть положительным числом";
    return transaction;
  }

  // === сравнивает ссылки: два РАЗНЫХ объекта с одинаковым iban
  // такую проверку прошли бы. Поэтому сверяем ещё и номер счёта.
  if (account1 === account2 || account1.iban === account2.iban) {
    transaction.error = "счёт списания и счёт зачисления совпадают";
    return transaction;
  }

  // --- сама операция ---

  // ПОРЯДОК ВАЖЕН: сначала снимаем, и только если снятие удалось —
  // зачисляем. Наоборот нельзя: деньги появятся из воздуха.
  if (!account1.withdraw(amount)) {
    transaction.error =
      `недостаточно средств на счёте ${account1.iban} ` +
      `(доступно ${account1.getBalance()})`;
    return transaction;
  }

  if (!account2.deposit(amount)) {
    // Деньги уже сняты, а зачислить не вышло — возвращаем обратно,
    // иначе они просто исчезнут.
    account1.deposit(amount);
    transaction.error = "не удалось зачислить средства, перевод отменён";
    return transaction;
  }

  // Поле error не добавлено — значит, его в объекте физически нет.
  // Не null, не пустая строка, а отсутствует.
  return transaction;
}

// --- проверка transfer ---

console.log("\n=== ЗАДАНИЕ 2b + 2c ===");

const t1 = transfer(accounts[0], accounts[1], 500); // успех
t1.transactionInfo();
console.log("    поле error есть?", "error" in t1);

const t2 = transfer(accounts[2], accounts[0], 1000); // не хватает денег
t2.transactionInfo();
console.log("    поле error есть?", "error" in t2);

const t3 = transfer(accounts[0], accounts[1], -50); // некорректная сумма
t3.transactionInfo();

const t4 = transfer(accounts[0], accounts[0], 100); // тот же счёт
t4.transactionInfo();

const t5 = transfer(accounts[0], { iban: "IL00", owner: "фейк" }, 100); // не счёт
t5.transactionInfo();

const t6 = transfer(accounts[0], accounts[1], "500"); // строка вместо числа
t6.transactionInfo();

console.log("\n=== балансы после операций ===");
printAccounts(accounts);
