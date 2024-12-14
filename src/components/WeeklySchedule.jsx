import React, { useState } from "react";
import "./WeeklySchedule.css";

function WeeklySchedule({ student, classrooms, updateSchedule }) {
  const [schedule, setSchedule] = useState(student.weeklySchedule);
  const [courseName, setCourseName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [className, setClassName] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(1);
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

  const addCourse = () => {
    if (!courseName.trim() || !teacherName.trim() || !className || !selectedDay || !selectedTime) {
      setErrorMessage("All fields are required.");
      return;
    }

    const dayIndex = days.indexOf(selectedDay);
    const timeIndex = timeSlots.indexOf(selectedTime);
    if (dayIndex === -1 || timeIndex === -1) {
      setErrorMessage("Invalid day or time selected.");
      return;
    }

    const updatedSchedule = [...schedule];

    for (let i = 0; i < duration; i++) {
      const currentTimeIndex = timeIndex + i;
      if (currentTimeIndex >= timeSlots.length) {
        setErrorMessage("Duration exceeds available time slots.");
        return;
      }
      if (updatedSchedule[currentTimeIndex][dayIndex]) {
        setErrorMessage("One or more time slots are already occupied.");
        return;
      }
    }

    for (let i = 0; i < duration; i++) {
      const currentTimeIndex = timeIndex + i;
      updatedSchedule[currentTimeIndex][dayIndex] = `${courseName} (${teacherName}, ${className})`;
    }

    setSchedule(updatedSchedule);
    setCourseName("");
    setTeacherName("");
    setClassName("");
    setSelectedDay("");
    setSelectedTime("");
    setDuration(1);
    setErrorMessage("");
  };

  const deleteCourse = (rowIndex, colIndex) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[rowIndex][colIndex] = null;
    setSchedule(updatedSchedule);
  };

  return (
    <div className="schedule-container">
      <h3>Edit Weekly Schedule for {student.name}</h3>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div>
        <h4>Add Course</h4>
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teacher Name"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
        />
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        >
          <option value="">Select Classroom</option>
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.name}>
              {classroom.name}
            </option>
          ))}
        </select>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          <option value="">Select Day</option>
          {days.map((day, idx) => (
            <option key={idx} value={day}>
              {day}
            </option>
          ))}
        </select>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Select Time</option>
          {timeSlots.map((time, idx) => (
            <option key={idx} value={time}>
              {time}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          max="4"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duration (hours)"
        />
        <button onClick={addCourse}>Add Course</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              {days.map((day, idx) => (
                <th key={idx}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{timeSlots[rowIndex]}</td>
                {row.map((course, colIndex) => (
                  <td key={colIndex}>
                    {course || "-"}
                    {course && (
                      <button onClick={() => deleteCourse(rowIndex, colIndex)}>X</button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => updateSchedule(schedule)}>Save Schedule</button>
    </div>
  );
}

export default WeeklySchedule;
