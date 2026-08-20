let myArray = [1, 5, 2, 9, 4];
function binarySearch(myArray, searchValue) {
  let left = 0;
  let right = myArray.length - 1;

  while (left <= right) {
    let middle = Math.floor((left + right) / 2); // средний индекс с помощью методы math.floor
    // если использовать Math.round (округление к ближайшему) или Math.ceil (округление вверх),
    // при определённых значениях left и right алгоритм может зациклиться —
    // mid будет каждый раз указывать на одну и ту же границу, и left/right никогда не сойдутся.
    // Math.floor гарантированно не даёт такой проблемы — это стандартная, проверенная договорённость в алгоритме бинарного поиска

    if (myArray[middle] === searchValue) {
      return middle; // нашли — возвращаем индекс
    } else if (myArray[middle] < searchValue) {
      left = middle + 1; // искомое больше — сдвигаем левую границу вправо
    } else {
      right = middle - 1; // искомое меньше — сдвигаем правую границу влево
    }
  }
  return -1;
}

// внешний цикл — сколько раз повторяем весь проход
for (let i = 0; i < myArray.length; i++) {
  // внутренний цикл — один проход: сравниваем каждую пару соседей
  for (let j = 0; j < myArray.length - 1; j++) {
    // сравниваем текущий элемент со следующим
    if (myArray[j] > myArray[j + 1]) {
      // если левый больше правого — меняем их местами
      let temp = myArray[j];
      myArray[j] = myArray[j + 1];
      myArray[j + 1] = temp; // temp временная переменная в середине цикла
    }
  }
}

console.log(myArray); // отсортированый массив после более 1 прохода в внутренем и внешнем цикле

let index = binarySearch(myArray, 9); // вернул 4 — верно, это его индекс в отсортированном массиве
console.log(index);

let index2 = binarySearch(myArray, 100); // проверка несуществующего индекса
console.log(index2);
