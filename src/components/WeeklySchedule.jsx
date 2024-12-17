import React, { useState, useEffect, useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";
import "./WeeklySchedule.css";

function WeeklySchedule({ student, updateSchedule }) {
  const { courses } = useContext(CoursesContext);
  const [schedule, setSchedule] = useState(
    student.weeklySchedule ||
      Array.from({ length: 16 }, () => Array(5).fill(null))
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = generateTimeSlots();

  // Zaman slotlarını oluştur
  function generateTimeSlots() {
    const slots = [];
    let hour = 8;
    let minute = 30;

    for (let i = 0; i < 16; i++) {
      const start = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      minute += 45;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
      slots.push(`${start}`);
      minute += 10;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return slots;
  }

  // Hücreye tıklama işlemi
  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ rowIndex, colIndex });
    setSelectedCourse("");
    setErrorMessage("");
  };

  // Kurs seçimi ve tabloya ekleme
  const selectCourse = () => {
    if (!selectedCourse) {
      setErrorMessage("Please select a valid course.");
      return;
    }

    const updatedSchedule = schedule.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        rowIndex === selectedCell.rowIndex && colIndex === selectedCell.colIndex
          ? selectedCourse
          : cell
      )
    );

    setSchedule(updatedSchedule);
    setSelectedCell(null);
    setSelectedCourse("");
  };

  // Save Schedule Butonu
  const saveSchedule = () => {
    if (!updateSchedule) {
      console.error("updateSchedule fonksiyonu tanımlı değil!");
      return;
    }
    console.log("Saving Schedule:", schedule);
    updateSchedule(schedule); // Güncellenmiş programı ebeveyn bileşene gönder
    alert("Schedule saved successfully!");
  };

  return (
    <div className="schedule-container">
      <h3>Weekly Schedule for {student.name}</h3>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{timeSlots[rowIndex]}</td>
                {row.map((course, colIndex) => (
                  <td
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    style={{
                      cursor: "pointer",
                      background:
                        selectedCell?.rowIndex === rowIndex &&
                        selectedCell?.colIndex === colIndex
                          ? "#d3d3d3"
                          : "transparent",
                    }}
                  >
                    {course || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCell && (
        <div className="modal">
          <h4>Select Course</h4>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.courseName}>
                {`${course.courseName} | Day: ${course.day} | Time: ${
                  course.hour || "N/A"
                } | Duration: ${course.duration}`}
              </option>
            ))}
          </select>
          <button onClick={selectCourse}>Save</button>
          <button onClick={() => setSelectedCell(null)}>Cancel</button>
        </div>
      )}

      <button onClick={saveSchedule}>Save Schedule</button>
    </div>
  );
}

export default WeeklySchedule;
