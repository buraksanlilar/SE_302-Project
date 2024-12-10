import React, { useState } from "react";

function WeeklySchedule({ student, updateSchedule }) {
  const [schedule, setSchedule] = useState(student.weeklySchedule);
  const [courseName, setCourseName] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);
  const [startTime, setStartTime] = useState("08:30");
  const [duration, setDuration] = useState(1);

  // Haftalık Ders Saatlerini Oluştur
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
      minute += 45; // Ders süresi
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
      const end = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      slots.push(`${start} - ${end}`);

      minute += 10; // 10 dakika mola
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return slots;
  }

  // Ders Ekleme Fonksiyonu
  const addCourse = () => {
    const updatedSchedule = [...schedule];
    const startIndex = timeSlots.findIndex((slot) =>
      slot.startsWith(startTime)
    );
    if (startIndex !== -1) {
      for (let i = startIndex; i < startIndex + duration && i < 16; i++) {
        updatedSchedule[i][selectedDay] = courseName;
      }
      setSchedule(updatedSchedule);
    }
    setCourseName("");
  };

  // Ders Silme
  const deleteCourse = (row, col) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[row][col] = null;
    setSchedule(updatedSchedule);
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div>
      <h3>Edit Weekly Schedule for {student.name}</h3>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
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
                <td key={colIndex} style={{ textAlign: "center" }}>
                  {course || "-"}
                  {course && (
                    <button onClick={() => deleteCourse(rowIndex, colIndex)}>
                      X
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ders Ekleme */}
      <div>
        <h4>Add Course</h4>
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <select onChange={(e) => setSelectedDay(Number(e.target.value))}>
          {days.map((day, index) => (
            <option key={index} value={index}>
              {day}
            </option>
          ))}
        </select>
        <select onChange={(e) => setStartTime(e.target.value)}>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot.split(" ")[0]}>
              {slot}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          max="16"
          placeholder="Duration (hours)"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />
        <button onClick={addCourse}>Add Course</button>
      </div>

      {/* Save Button */}
      <button onClick={() => updateSchedule(schedule)}>Save Schedule</button>
    </div>
  );
}

export default WeeklySchedule;
