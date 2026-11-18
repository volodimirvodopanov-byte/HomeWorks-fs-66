import {useState} from 'react';
import {studentsGroup} from "../data/students.js";

function StudentList() {
    const [students, setStudents] = useState(studentsGroup);

    function addStudent() {
        const newStudent = {
            id: crypto.randomUUID(),
            name: "Sarah"
        };

        setStudents((prevStudents) => [...prevStudents, newStudent]);
    }

    function deleteStudent(id) {
        setStudents((prevStudents) =>
            prevStudents.filter((student) => student.id !== id)
        );
    }

    return (
        <div>
            {students.map((student) => (
                <p key={student.id}>
                    {student.name}
                    <button onClick={() => deleteStudent(student.id)}>Удалить</button>
                </p>
            ))}
            <button onClick={addStudent}>Добавить</button>
        </div>
    );
}

export default StudentList;