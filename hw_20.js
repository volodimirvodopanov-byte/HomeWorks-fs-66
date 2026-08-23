let MyFruits = [
  "kiwi",
  "fig",
  "banana",
  "apricot",
  "pineapple",
  "blueberry",
  "pomegranate",
  "passionfruit",
  "watermelon",
  "plum",
];

// Function Declaration
function comparator(a, b) {
  if (a.length > b.length) {
    return 1;
  }
  if (b.length > a.length) {
    return -1;
  }
  return 0;
}

console.log(comparator("kiwi", "fig"));

// Function Expression
let comparatorExpr = function (a, b) {
  if (a.length > b.length) {
    return 1;
  }
  if (b.length > a.length) {
    return -1;
  }
  return 0;
};

console.log(comparatorExpr("pomegranate", "passionfruit"));

// Arrow Function
let comparatorArrow = (a, b) => {
  if (a.length > b.length) {
    return 1;
  }
  if (b.length > a.length) {
    return -1;
  }
  return 0;
};

console.log(comparatorArrow("pineapple", "blueberry"));

function findMax(arr, compareFn) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (compareFn(arr[i], max) === 1) {
      max = arr[i];
    }
  }
  return max;
}

console.log(findMax(MyFruits, comparator));
