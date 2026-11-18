import {useState} from 'react';
import {studentsGroup} from "../data/students.js";

function StudentList() {
    const [students, setStudents] = useState(studentsGroup);

    function addStudent() {
        const newStudent = {
            id: crypto.randomUUID(),
            name: "Sarah",
            isActive: true,
        };

        setStudents((prevStudents) => [...prevStudents, newStudent]);
    }

    function deleteStudent(id) {
        setStudents((prevStudents) =>
            prevStudents.filter((student) => student.id !== id)
        );
    }

    function toggleStatus(id) {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.id === id
                    ? {...student, isActive: !student.isActive}
                    : student
            )
        );
    }

    return (
        <div>
            {students.map((student) => (
                <p key={student.id}>
                    {student.name}
                    {student.isActive ? " — Активен " : " — Неактивен "}
                    <button onClick={() => toggleStatus(student.id)}>Изменить статус</button>
                    <button onClick={() => deleteStudent(student.id)}>Удалить</button>
                </p>
            ))}
            <button onClick={addStudent}>Добавить</button>
        </div>
    );
}

export default StudentList;