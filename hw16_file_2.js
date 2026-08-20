let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(array);

array.splice(0, 11);
array.splice(0, 0, 0);
console.log(array);

array.splice(-1, 1);
array.splice(0, 1);
console.log(array);

array.splice(2, 1, 99);
console.log(array);
