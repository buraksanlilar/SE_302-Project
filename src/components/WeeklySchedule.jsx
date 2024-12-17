import React, { useState, useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";
import "./WeeklySchedule.css";
 
function WeeklySchedule({ student, updateSchedule }) {
  const { courses } = useContext(CoursesContext);
  const [schedule, setSchedule] = useState(student.weeklySchedule);
  const [selectedCell, setSelectedCell] = useState(null);
  const [newCourse, setNewCourse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
 
  const timeSlots = generateTimeSlots();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
 
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
      const end = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      slots.push(`${start} - ${end}`);
 
      minute += 10;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return slots;
  }
 
  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ rowIndex, colIndex });
    setNewCourse(schedule[rowIndex][colIndex] || "");
    setErrorMessage("");
  };
 
  const changeCourse = () => {
    if (!newCourse) {
      setErrorMessage("Please select a valid course.");
      return;
    }
    const updatedSchedule = [...schedule];
    updatedSchedule[selectedCell.rowIndex][selectedCell.colIndex] = newCourse;
    setSchedule(updatedSchedule);
    setSelectedCell(null);
    setNewCourse("");
  };
 
  return (
    <div className="schedule-container">
      <h3>Edit Weekly Schedule for {student.name}</h3>
 
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
          <h4>Change Course</h4>
          <select
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option
                key={course.id}
                value={`${course.courseName} (${course.teacherName})`}
              >
                {course.courseName} (Teacher: {course.teacherName})
              </option>
            ))}
          </select>
          <button onClick={changeCourse}>Save</button>
          <button onClick={() => setSelectedCell(null)}>Cancel</button>
        </div>
      )}
 
      <button onClick={() => updateSchedule(schedule)}>Save Schedule</button>
    </div>
  );
}
 
export default WeeklySchedule;
 
 