import React, { useState, useContext } from "react";
import { ClassroomContext } from "../context/ClassroomContext";
import WeeklySchedule from "./WeeklySchedule"; // Haftalık programı göstermek için
import "./Classrooms.css";

function Classrooms() {
  const { classrooms, addClassroom, deleteClassroom } = useContext(ClassroomContext);
  const [newClassroom, setNewClassroom] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState(null); // Seçilen sınıf
  const [showSchedule, setShowSchedule] = useState(false); // Haftalık programı gösterme durumu

  const handleAddClassroom = () => {
    if (newClassroom.trim() && capacity > 0) {
      const newClass = { id: Date.now(), name: newClassroom, capacity, weeklySchedule: Array(16).fill(Array(5).fill(null)) }; // Sınıfa haftalık program ekle
      addClassroom(newClass);
      setNewClassroom("");
      setCapacity("");
    }
  };

  const handleViewSchedule = (classroom) => {
    setSelectedClassroom(classroom);
    setShowSchedule(true);
  };

  const handleCloseSchedule = () => {
    setShowSchedule(false);
    setSelectedClassroom(null);
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
            <button onClick={() => handleViewSchedule(classroom)}>View Schedule</button>
          </li>
        ))}
      </ul>

      {/* Sınıfın haftalık programını göster */}
      {showSchedule && selectedClassroom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedClassroom.name} Weekly Schedule</h3>
            <WeeklySchedule
              schedule={selectedClassroom.weeklySchedule} // Seçilen sınıfın haftalık programı
              updateSchedule={(updatedSchedule) => {
                // Burada programı güncelleyebilirsiniz, örneğin yeni dersler eklenebilir.
              }}
            />
            <button onClick={handleCloseSchedule}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classrooms;
