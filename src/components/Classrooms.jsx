import React, { useState } from "react";
import "./Classrooms.css";

function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroom, setNewClassroom] = useState("");
  const [capacity, setCapacity] = useState("");

  // Yeni sınıf ekleme
  const addClassroom = () => {
    if (newClassroom.trim() && capacity > 0) {
      setClassrooms([
        ...classrooms,
        {
          id: Date.now(),
          name: newClassroom,
          capacity: capacity,
        },
      ]);
      setNewClassroom("");
      setCapacity("");
    }
  };

  const deleteClassroom = (id) => {
    setClassrooms(classrooms.filter((classroom) => classroom.id !== id));
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
