/* 1. Function Declaration
   (обычное объявление через ключевое слово function)
 */

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(x, y) {
  return x / y;
}

function calculator(number1, number2, operation) {
  return operation(number1, number2);
}

console.log(calculator(10, 5, add)); // 15
console.log(calculator(10, 5, subtract)); // 5
console.log(calculator(10, 5, multiply)); // 50
console.log(calculator(10, 5, divide)); // 2

/* 
   2. Function Expression
   (функция записывается как значение переменной,
   через const/let = function(...) {...})
*/

const addExpr = function (x, y) {
  return x + y;
};

const subtractExpr = function (x, y) {
  return x - y;
};

const multiplyExpr = function (x, y) {
  return x * y;
};

const divideExpr = function (x, y) {
  return x / y;
};

const calculatorExpr = function (number1, number2, operation) {
  return operation(number1, number2);
};

console.log(calculatorExpr(10, 5, addExpr)); // 15
console.log(calculatorExpr(10, 5, subtractExpr)); // 5
console.log(calculatorExpr(10, 5, multiplyExpr)); // 50
console.log(calculatorExpr(10, 5, divideExpr)); // 2

/* 
   3. Arrow Function
   (Вариант без {} и return)
*/

const addArrow = (x, y) => x + y;
const subtractArrow = (x, y) => x - y;
const multiplyArrow = (x, y) => x * y;
const divideArrow = (x, y) => x / y;

const calculatorArrow = (number1, number2, operation) =>
  operation(number1, number2);

console.log(calculatorArrow(10, 5, addArrow)); // 15
console.log(calculatorArrow(10, 5, subtractArrow)); // 5
console.log(calculatorArrow(10, 5, multiplyArrow)); // 50
console.log(calculatorArrow(10, 5, divideArrow)); // 2
