import { add, subtract, multiply, divide } from "./math.js";
import { PI, getCircleArea, getRectangleArea, getCircleLength } from "./geometry.js";

// Математические операции
console.log(`15 + 7 = ${add(15, 7)}`);
console.log(`20 - 8 = ${subtract(20, 8)}`);
console.log(`6 * 9 = ${multiply(6, 9)}`);
console.log(`100 / 4 = ${divide(100, 4)}`);
console.log(`10 / 0 = ${divide(10, 0)}`);

console.log(""); // пустая строка между блоками

// Геометрические вычисления
console.log(`PI = ${PI}`);
console.log(`Circle area (r=5): ${getCircleArea(5)}`);
console.log(`Rectangle area (8x12): ${getRectangleArea(8, 12)}`);
console.log(`Circle length (r=10): ${getCircleLength(10)}`);