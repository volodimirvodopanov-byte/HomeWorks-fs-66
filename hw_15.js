console.log(false == 0); // true  — false приводится к числу 0, получается 0 == 0
console.log(false === 0); // false — строгое сравнение: boolean и number, приведения типов нет

console.log("" == 0); // true  — пустая строка приводится к числу 0, получается 0 == 0
console.log("" === 0); // false — строгое сравнение: string и number, приведения нет

console.log(null == undefined); // true  — спец-правило: при == null и undefined равны только друг другу
console.log(null === undefined); // false — строгое сравнение: это разные типы (null vs undefined)

console.log("55" == 55); // true  — строка "55" приводится к числу 55, получается 55 == 55
console.log("55" === 55); // false — строгое сравнение: string и number, приведения нет

console.log("true" == true); // false — true→1, а "true"→Number("true")→NaN, и NaN != 1
console.log("true" === true); // false — строгое сравнение: string и boolean, приведения нет

// ПЛАВАЮЩАЯ ТОЧКА (IEEE 754): 0.1 и 0.2 нельзя сохранить точно в двоичной,
// каждое хранится с крошечным избытком:
//   0.10000000000000000555
// + 0.20000000000000001110
// = 0.30000000000000004441   ← сумма избытков дала «4» в 17-м знаке
// Поэтому x = 0.2 + 0.1 - 0.3  НЕ равен 0, а равен 5.55e-17 (крошечный хвостик).

console.log(0.2 + 0.1 - 0.3 == true); // false: true → 1, а 5.55e-17 != 1
console.log(0.2 + 0.1 - 0.3 === true); // false: строго — number vs boolean, приведения нет
console.log(0.2 + 0.1 - 0.3 == false); // false: false → 0, но x != 0 (тот самый хвостик!)
console.log(0.2 + 0.1 - 0.3 === false); // false: строго — number vs boolean, приведения нет

// Правильный способ сравнивать дробные числа — через допуск (не через ==):
console.log(Math.abs(0.2 + 0.1 - 0.3) < Number.EPSILON); // true

// ===== ДОПОЛНИТЕЛЬНО: сравнение объектов =====
// ОБЪЕКТЫ сравниваются ПО ССЫЛКЕ, а не по содержимому.
// Каждый {} — это новый объект в памяти со своим адресом.

console.log({} == {}); // false: две РАЗНЫЕ ссылки (разные объекты в памяти)
console.log({} === {}); // false: то же самое, содержимое не сравнивается

// При == объект приводится к примитиву через toString():  {} → "[object Object]"
console.log({} == "[object Object]"); // true:  "[object Object]" == "[object Object]"
console.log({} === "[object Object]"); // false: строго — object vs string, приведения нет

// Дальше объект → "[object Object]" → Number("[object Object]") = NaN,
// а NaN не равен ничему, поэтому все сравнения с числами дают false:
console.log({} == true); // false: true→1, {}→NaN, NaN != 1
console.log({} == false); // false: false→0, {}→NaN, NaN != 0
console.log({} == 0); // false: {}→"[object Object]"→NaN, NaN != 0
console.log({} == NaN); // false: NaN не равен ничему, даже самому себе
