let dataset = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(dataset);

dataset.push(11);
dataset.unshift(0);
console.log(dataset);
console.log(dataset.length);

dataset.pop();
dataset.shift();
console.log(dataset);

console.log("=============================");
console.log(dataset[2]);
console.log("=============================");

dataset[2] = 99;
console.log(dataset);

console.log(dataset.length);
