import React, { useState, useContext } from "react";
import { ClassroomContext } from "../context/ClassroomContext";
import "./Classrooms.css";

function Classrooms() {
  const { classrooms, addClassroom, deleteClassroom } = useContext(ClassroomContext);
  const [newClassroom, setNewClassroom] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleAddClassroom = () => {
    if (newClassroom.trim() && capacity > 0) {
      const newClass = { id: Date.now(), name: newClassroom, capacity };
      addClassroom(newClass);
      setNewClassroom("");
      setCapacity("");
    }
  };

  return (
    <div className="classrooms-container">
      <h3>Manage Classrooms</h3>
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
        <button onClick={handleAddClassroom}>Add Classroom</button>
      </div>

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
