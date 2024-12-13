import React, { useState, useEffect } from "react";
import "./Classrooms.css";

function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroom, setNewClassroom] = useState("");
  const [capacity, setCapacity] = useState("");

  // localStorage'dan sınıfları yükle
  useEffect(() => {
    const savedClassrooms = JSON.parse(localStorage.getItem("classrooms"));
    if (savedClassrooms) {
      setClassrooms(savedClassrooms);
    }
  }, []);

  // localStorage'a sınıfları kaydet
  useEffect(() => {
    if (classrooms.length > 0) {
      localStorage.setItem("classrooms", JSON.stringify(classrooms));
    }
  }, [classrooms]);

  // Yeni sınıf ekleme
  const addClassroom = () => {
    if (newClassroom.trim() && capacity > 0) {
      const newClass = {
        id: Date.now(),
        name: newClassroom,
        capacity: capacity,
      };
      setClassrooms((prevClassrooms) => [...prevClassrooms, newClass]);
      setNewClassroom("");
      setCapacity("");
    }
  };

  const deleteClassroom = (id) => {
    const updatedClassrooms = classrooms.filter((classroom) => classroom.id !== id);
    setClassrooms(updatedClassrooms);
  };

  return (
    <div className="classrooms-container">
      <h3>Manage Classrooms</h3>

      {/* Yeni sınıf ekleme formu */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter classroom name"
          value={newClassroom}
          onChange={(e) => setNewClassroom(e.target.value)}
        />
        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        <button onClick={addClassroom}>Add Classroom</button>
      </div>

      {/* Sınıf listesi */}
      <ul>
        {classrooms.map((classroom) => (
          <li key={classroom.id}>
            {classroom.name} - Capacity: {classroom.capacity}
            <button onClick={() => deleteClassroom(classroom.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Classrooms;
