let item1 = {
  name: "notebook lenovo thinkpad",
  price: 1283,
  description: "cpu intel core7, ram:16gb",
  info: infoFunction,
};

console.log(item1);
console.log(item1.info());

let item2 = new Product("Acer N53", 1600, "Игровой ноутбук");
item2.note = "пробная партия";
console.log("------------------------");
console.log(item2);
console.log(item2.info());

//==============
function Product(name, price, description) {
  this.name = name;
  this.price = price;
  this.description = description;
  this.info = infoFunction;
}

function infoFunction() {
  return `товар: ${this.name}; цена: ${this.price} описание: ${this.description}`;
}

//==============
const arr = [
  item1,
  item2,
  new Product("Смартфон iphone 20pro", "24 камеры", 10000),
];
console.log(arr);
console.log(arr[2]);
console.log("--------printArray----------------");
printArray(arr);

console.log("---------printArray2--------------");
printArray2(arr);

function printArray(arr) {
  if (!Array.isArray(arr)) {
    console.log("неопознанный параметр");
    return;
  } else {
    for (let i = 0; i < arr.length; i++) {
      console.log(`Товар ${i + 1}`);
      let item = arr[i];
      for (let key in item) {
        let value = typeof item[key] !== "function" ? item[key] : item[key]();
        console.log(`   ${key}:${value}`);
      }
    }
  }
}

function printArray2(arr) {
  if (!Array.isArray(arr)) {
    console.log("неопознанный параметр");
    return;
  } else {
    arr.forEach((item, i) => {
      console.log(`Товар ${i + 1}`);
      for (let key in item) {
        let value = typeof item[key] !== "function" ? item[key] : item[key]();
        console.log(`   ${key}:${value}`);
      }
    });
  }
}
