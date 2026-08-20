let myArray = [1, 5, 2, 9, 4];

function bubbleSort(myArrayToSort) {
  let unsortedLength = myArrayToSort.length; // граница неотсортированной части

  while (unsortedLength > 1) {
    let lastSwapIndex = 0; // позиция последнего обмена за проход

    for (let j = 0; j < unsortedLength - 1; j++) {
      // сравниваем текущий элемент со следующим
      if (myArrayToSort[j] > myArrayToSort[j + 1]) {
        // меняем местами через деструктуризацию — без временной переменной
        [myArrayToSort[j], myArrayToSort[j + 1]] = [
          myArrayToSort[j + 1],
          myArrayToSort[j],
        ];
        lastSwapIndex = j + 1; // запоминаем, докуда доходил беспорядок
      }
    }

    // всё правее последнего обмена уже на своих местах — сужаем границу сразу до неё.
    // если обменов не было, lastSwapIndex останется 0 и цикл закончится сам
    unsortedLength = lastSwapIndex;
  }

  return myArrayToSort;
}

function binarySearch(myArrayToSearch, searchValue) {
  let left = 0;
  let right = myArrayToSearch.length - 1;

  while (left <= right) {
    // Math.floor — конвенция: при чётной длине берём левую из двух середин.
    // зацикливания здесь не будет ни при каком округлении, потому что обе ветки
    // сдвигают границу ЗА middle (+1 / -1) и исключают его из следующего диапазона
    let middle = Math.floor((left + right) / 2);

    if (myArrayToSearch[middle] === searchValue) {
      return middle; // нашли — возвращаем индекс
    } else if (myArrayToSearch[middle] < searchValue) {
      left = middle + 1; // искомое больше — сдвигаем левую границу вправо
    } else {
      right = middle - 1; // искомое меньше — сдвигаем правую границу влево
    }
  }

  return -1;
}

bubbleSort(myArray);
console.log(myArray); // отсортированный массив

let index = binarySearch(myArray, 9); // вернул 4 — верно, это его индекс в отсортированном массиве
console.log(index);

let index2 = binarySearch(myArray, 100); // проверка несуществующего значения
console.log(index2);
