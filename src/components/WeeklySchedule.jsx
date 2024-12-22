import React, { useState, useEffect, useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";
import "./WeeklySchedule.css";

function WeeklySchedule({ student, updateSchedule }) {
  const { courses } = useContext(CoursesContext);
  const [schedule, setSchedule] = useState(
    student.weeklySchedule ||
      Array.from({ length: 16 }, () => Array(5).fill(null))
  );
  const [notification, setNotification] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = generateTimeSlots();

  function generateTimeSlots() {
    const slots = [];
    let hour = 8;
    let minute = 30;

    for (let i = 0; i < 16; i++) {
      const start = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      slots.push(start.trim());
      minute += 45;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
      minute += 10;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return slots;
  }

  const handleDeleteCourse = (courseName) => {
    const updatedSchedule = schedule.map((row) =>
      row.map((course) => (course === courseName ? null : course))
    );

    setSchedule(updatedSchedule);
    setNotification(`All instances of "${courseName}" have been removed.`);
  };

  const saveSchedule = () => {
    updateSchedule(schedule);
    alert("Schedule saved successfully!");
  };

  return (
    <div className="schedule-container">
      <h3>Weekly Schedule for {student.name}</h3>

      {notification && <p style={{ color: "green" }}>{notification}</p>}

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
                  <td key={colIndex} style={{ position: "relative" }}>
                    {course || "-"}
                    {course && (
                      <button
                        onClick={() => handleDeleteCourse(course)}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "5px",
                          transform: "translateY(-50%)",
                          fontSize: "10px",
                          padding: "2px 5px",
                        }}
                      >
                        X
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={saveSchedule}>Save Schedule</button>
    </div>
  );
}

export default WeeklySchedule;
