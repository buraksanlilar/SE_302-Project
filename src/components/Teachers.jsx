import React, { useState, useContext } from "react";
import { TeachersContext } from "../context/TeachersContext";
import "./components.css"; // Ortak CSS dosyasını ekleyin

function Teachers() {
  const { teachers, addTeacher, deleteTeacher } = useContext(TeachersContext);
  const [newTeacher, setNewTeacher] = useState("");

  const handleAddTeacher = () => {
    if (!newTeacher.trim()) {
      alert("Teacher name cannot be empty!");
      return;
    }

    const newTeacherData = {
      id: Date.now(),
      name: newTeacher,
    };

    addTeacher(newTeacherData);
    setNewTeacher("");
  };

  return (
    <div className="container">
      <h3>Manage Teachers</h3>
      <input
        type="text"
        placeholder="Enter teacher name"
        value={newTeacher}
        onChange={(e) => setNewTeacher(e.target.value)}
      />
      <button onClick={handleAddTeacher}>Add Teacher</button>
      <ul>
        {teachers.map((teacher) => (
          <li key={teacher.id}>
            {teacher.name}
            <button onClick={() => deleteTeacher(teacher.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Teachers;
