import React, { useState, useContext } from "react";
import { TeachersContext } from "../context/TeachersContext";
import "./components.css";

function Teachers() {
  const { teachers, addTeacher, deleteTeacher } = useContext(TeachersContext);
  const [newTeacher, setNewTeacher] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" }); // Mesaj ve türü

  const handleAddTeacher = () => {
    if (!newTeacher.trim()) {
      setMessage({ text: "Teacher name cannot be empty!", type: "error" }); // Hata mesajını ayarla
      return;
    }

    const newTeacherData = {
      id: Date.now(),
      name: newTeacher.trim(),
    };

    addTeacher(newTeacherData);
    setNewTeacher(""); // Input alanını temizle
    setMessage({
      text: `"${newTeacherData.name}" has been successfully added to the list.`,
      type: "success", // Başarı mesajını ayarla
    });
  };

  const handleInputChange = (e) => {
    setNewTeacher(e.target.value);
    if (message.type === "error") {
      setMessage({ text: "", type: "" }); // Kullanıcı yazarken hata mesajını temizle
    }
  };

  return (
    <div className="container">
      <h3>Manage Teachers</h3>

      {/* Input Alanı */}
      <input
        type="text"
        placeholder="Enter teacher name"
        value={newTeacher}
        onChange={handleInputChange} // Input değişikliğini yöneten fonksiyon
      />
      <button onClick={handleAddTeacher}>Add Teacher</button>

      {/* Mesaj Gösterimi */}
      {message.text && (
        <p style={{ color: message.type === "success" ? "green" : "red" }}>
          {message.text}
        </p>
      )}

      {/* Öğretmen Listesi */}
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
