# HW_41_TEXT

Тема урока 41: состояние в React (`useState`). Работа с массивом в состоянии: добавление и удаление элементов без изменения исходного массива.

# 1. Домашнее задание: Student List

Vite + React JavaScript проект. Компонент `StudentList` хранит список студентов в состоянии React и позволяет добавлять и удалять студентов.

## 1.1. Общая задача

CRM хранит список студентов. Список нужно не только отображать, но и изменять через сеттер `setStudents`.

Каждый студент содержит:

- ID.
- Имя.

## 1.2. Исходные данные

Начальный массив вынесен в отдельный файл `src/data/students.js`:

```javascript
export const studentsGroup = [
    {
        id: 1,
        name: "Anna"
    },
    {
        id: 2,
        name: "David"
    }
];
```

Массив назван `studentsGroup`, а не `students`, чтобы имя не совпадало с переменной состояния `students` внутри компонента.

## 1.3. Структура компонентов

```text
App
|
+-- StudentList
    |
    +-- <p> Anna   [Удалить]
    +-- <p> David  [Удалить]
    |
    +-- [Добавить]
```

## 1.4. Состояние

```jsx
const [students, setStudents] = useState(studentsGroup);
```

- `students` — текущее значение состояния (массив студентов).
- `setStudents` — сеттер для изменения состояния.
- `studentsGroup` — начальное значение.

## 1.5. Добавление элемента в массив

В обычном JavaScript можно написать `students.push(newStudent)`, но в React так делать нельзя:

- `push()` изменяет исходный массив, ссылка остаётся прежней;
- React сравнивает ссылки, видит тот же массив и не перерисовывает компонент.

Вместо этого создаётся новый массив:

```text
Старый массив
     |
     +---- Anna
     |
     +---- David
     |
     v
Создаём новый массив
     |
     +---- Anna
     |
     +---- David
     |
     +---- Sarah
     |
     v
setStudents()
     |
     v
React обновляет список
```

```jsx
function addStudent() {
    const newStudent = {
        id: crypto.randomUUID(),
        name: "Sarah"
    };

    setStudents((prevStudents) => [...prevStudents, newStudent]);
}
```

- `newStudent` создаётся внутри функции, поэтому при каждом клике у нового студента свой уникальный `id`.
- `[...prevStudents, newStudent]` — новый массив: все прежние студенты и новый в конце.
- Схема та же, что с объектом на уроке: `{ ...prevStudent, age: ... }` → `[ ...prevStudents, newStudent ]`.

## 1.6. ADV: удаление элемента по ID

```text
students
   |
   +---- ID 1 Anna
   |
   +---- ID 2 David
   |
   +---- ID 3 Sarah
   |
   v
Удаляем ID 2
   |
   v
filter(student.id !== 2)
   |
   v
Новый массив
   |
   +---- ID 1 Anna
   |
   +---- ID 3 Sarah
```

```jsx
function deleteStudent(id) {
    setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== id)
    );
}
```

- `filter()` не меняет исходный массив, а возвращает новый.
- В новый массив попадают все студенты, кроме того, чей `id` совпал.
- Удаление идёт по `id`, а не по имени, поэтому из нескольких Sarah удаляется именно та, по которой кликнули.

Кнопка удаления находится внутри `map()`, у каждого студента своя:

```jsx
<p key={student.id}>
    {student.name}
    <button onClick={() => deleteStudent(student.id)}>Удалить</button>
</p>
```

Стрелочная функция в `onClick` нужна, чтобы передать `id`. Запись `onClick={deleteStudent(student.id)}` вызвала бы функцию сразу при отрисовке, а не по клику.

## 1.7. Структура файлов

```text
hw_41/
|
+-- src/
|   |
|   +-- components/
|   |   +-- StudentList.jsx
|   |
|   +-- data/
|   |   +-- students.js
|   |
|   +-- App.jsx
|   +-- index.css
|   +-- main.jsx
|
+-- index.html
+-- package.json
+-- vite.config.js
```

## 1.8. Запуск

```bash
npm install
npm run dev
```

После запуска открыть ссылку `http://localhost:...` из терминала.
