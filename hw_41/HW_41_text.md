# HW_41 text

ПУСТЬ Наша CRM хранит список студентов.

Для этого нам понадобится массив в состоянии React.

```jsx
import { useState } from "react";

function StudentList() {

    const [students, setStudents] = useState([
        {
            id: 1,
            name: "Anna"
        },
        {
            id: 2,
            name: "David"
        }
    ]);

    return (
        <div>

            {students.map((student) => (
                <p key={student.id}>
                    {student.name}
                </p>
            ))}

        </div>
    );
}

export default StudentList;
```

Пока список только отображается.

Но теперь мы можем изменять его через `setStudents`.

## Реализуйте по аналогии с объектом (как на уроке)

### 1.Добавление элемента в массив

В обычном JavaScript мы могли бы написать:

```javascript
students.push(newStudent);
```

Но в React так делать нельзя, если `students` — массив состояния.

`push()` изменяет исходный массив.

Вместо этого создаём новый массив.


### Схема

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

#  ADV !!!!!!!!!!!!!!!!!!

## 2.Реализуйте Схему УДАЛЕНИЯ ЭЛЕМЕНТА ПО ID

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

## Hint: 
```
const newStudent = {
            id: crypto.randomUUID(),
            name: "Sarah"
        };
```