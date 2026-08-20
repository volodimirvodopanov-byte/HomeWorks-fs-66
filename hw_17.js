let number = 1210;
let numberStr = number.toString(); // преобразую число в строку, чтобы можно было пройтись по каждой цифре
let sumOdd = 0; // стартуем с нуля, сумма цифр на нечётных позициях
let sumEven = 0; // стартуем с нуля, сумма цифр на чётных позициях

for (let i = 0; i < numberStr.length; i++) {
  let digit = Number(numberStr[i]); // превращаем символ обратно в число
  let position = i + 1; // позиция считается с 1, а не с 0
  if (position % 2 === 0) {
    sumEven += digit; // сумма цифр на чётных позициях
  } else {
    sumOdd += digit; // сумма цифр на нечётных позициях
  }
}
console.log(`Сумма цифр на нечётных позициях: ${sumOdd}`);
console.log(`Сумма цифр на чётных позициях: ${sumEven}`);
if (sumOdd === sumEven) {
  console.log("число счастливое");
} else {
  console.log("число не счастливое");
}

console.log("=================================");

let number2 = 123420;
let number2Str = number2.toString();
console.log(typeof number2Str); // string

let sumFirstHalf = 0; // сумма первых 3 цифр накопится сдесь, стартуя с 0
let sumSecondHalf = 0; // сумма последних 3 цифр

for (let i = 0; i < number2Str.length; i++) {
  let digit = Number(number2Str[i]);
  console.log(typeof digit);
  if (i < number2Str.length / 2) {
    sumFirstHalf += digit;
  } else {
    sumSecondHalf += digit;
  }
}
console.log(typeof digit); // не находит переменную digit, так как она объявлена внутри цикла for и недоступна снаружи.
console.log(`Сумма цифр в первой половине: ${sumFirstHalf}`);
console.log(`Сумма цифр во второй половине: ${sumSecondHalf}`);
if (sumFirstHalf === sumSecondHalf) {
  console.log("число счастливое");
} else {
  console.log("число не счастливое");
}
