import React, { useState, useEffect, useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";
import "./WeeklySchedule.css";

function WeeklySchedule({ student, updateSchedule }) {
  const { courses } = useContext(CoursesContext);
  const [schedule, setSchedule] = useState(
    student.weeklySchedule ||
      Array.from({ length: 16 }, () => Array(5).fill(null))
  );
  const [selectedCourse, setSelectedCourse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

  const placeCourseAutomatically = () => {
    if (!selectedCourse) {
      setErrorMessage("Please select a course.");
      return;
    }

    const course = courses.find((c) => c.courseName === selectedCourse);

    if (!course || !course.day || !course.hour || !course.duration) {
      setErrorMessage("Invalid course data.");
      return;
    }

    const dayIndex = days.indexOf(course.day);
    const normalizedHour = course.hour.trim().padStart(5, "0");
    const startSlot = timeSlots.findIndex((slot) => slot === normalizedHour);
    console.log("Normalized Hour:", normalizedHour);

    if (dayIndex === -1 || startSlot === -1) {
      setErrorMessage("Invalid day or time in course data.");
      return;
    }

    const updatedSchedule = schedule.map((row) => [...row]);
    let conflict = false;

    for (let i = 0; i < parseInt(course.duration, 10); i++) {
      const currentSlot = startSlot + i;
      if (currentSlot >= updatedSchedule.length) {
        setErrorMessage("Course duration exceeds available time slots.");
        return;
      }
      if (updatedSchedule[currentSlot][dayIndex] !== null) {
        conflict = true;
        break;
      }
    }

    if (conflict) {
      setErrorMessage("There is already a course scheduled in this time slot.");
    } else {
      for (let i = 0; i < parseInt(course.duration, 10); i++) {
        const currentSlot = startSlot + i;
        updatedSchedule[currentSlot][dayIndex] = course.courseName;
      }
      setSchedule(updatedSchedule);
      setErrorMessage("");
    }
  };

  const saveSchedule = () => {
    updateSchedule(schedule);
    alert("Schedule saved successfully!");
  };

  return (
    <div className="schedule-container">
      <h3>Weekly Schedule for {student.name}</h3>

      <div className="course-select">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select a Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.courseName}>
              {`${course.courseName} | Day: ${course.day} | Time: ${course.hour} | Duration: ${course.duration}`}
            </option>
          ))}
        </select>
        <button onClick={placeCourseAutomatically}>Place Course</button>
      </div>

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
                  <td key={colIndex}>{course || "-"}</td>
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
