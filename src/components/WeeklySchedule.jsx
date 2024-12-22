import React, { useState, useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";
import "./WeeklySchedule.css";

function WeeklySchedule({ student, updateSchedule }) {
  const { courses, updateCourse } = useContext(CoursesContext);
  const [schedule, setSchedule] = useState(
    student.weeklySchedule ||
      Array.from({ length: 16 }, () => Array(5).fill(null))
  );
  const [selectedCourse, setSelectedCourse] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = useState("");
  const [deletedCourses, setDeletedCourses] = useState([]); // Silinen kursları takip et

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
    const studentName = student.name.toLowerCase(); // Öğrenci adını küçük harfe çevir

    // Haftalık programdan kursu kaldır
    const updatedSchedule = schedule.map((row) =>
      row.map((course) => (course === courseName ? null : course))
    );

    setSchedule(updatedSchedule);

    // İlgili kursu bul ve öğrenciyi "" ile değiştir
    const deletedCourse = courses.find(
      (course) => course.courseName.toLowerCase() === courseName.toLowerCase()
    );

    if (deletedCourse) {
      const updatedStudents = deletedCourse.students.map((s) =>
        s.toLowerCase() === studentName ? "" : s
      );

      const updatedCourse = {
        ...deletedCourse,
        students: updatedStudents,
      };

      // Güncellenmiş kursu bağlamda kaydetmek için kullan
      const updatedCourses = courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      );

      updateCourse(updatedCourses);

      setNotification(
        `"${student.name}" has been removed from "${courseName}".`
      );
    }
  };

  const saveSchedule = () => {
    console.log("Final Schedule Before Saving:", schedule);

    // Haftalık programı bağlama kaydet
    updateSchedule(schedule);

    // Yerel depolamayı kontrol et
    const savedCourses = JSON.parse(localStorage.getItem("courses"));
    console.log("LocalStorage Courses After Update:", savedCourses);

    alert("Schedule saved successfully!");
  };

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

    if (dayIndex === -1 || startSlot === -1) {
      setErrorMessage("Invalid day or time in course data.");
      return;
    }

    const updatedSchedule = schedule.map((row) => [...row]);
    const courseDuration = parseInt(course.duration, 10);

    // Check for conflicts and duration overflow
    for (let i = 0; i < courseDuration; i++) {
      const currentSlot = startSlot + i;
      if (currentSlot >= updatedSchedule.length) {
        setErrorMessage("Course duration exceeds available time slots.");
        return;
      }
      if (updatedSchedule[currentSlot][dayIndex] !== null) {
        setErrorMessage(
          `Conflict detected with "${updatedSchedule[currentSlot][dayIndex]}".`
        );
        return;
      }
    }

    // Place the course in the schedule
    for (let i = 0; i < courseDuration; i++) {
      updatedSchedule[startSlot + i][dayIndex] = course.courseName;
    }

    setSchedule(updatedSchedule);
    setErrorMessage("");
    setNotification(`"${course.courseName}" has been placed successfully.`);
  };

  return (
    <div className="schedule-container">
      <h3>Weekly Schedule for {student.name}</h3>

      {/* Notification Message */}
      {notification && <p style={{ color: "green" }}>{notification}</p>}

      {/* Course Selection */}
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

      {/* Error Message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Weekly Schedule Table */}
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

      {/* Save Schedule Button */}
      <button onClick={saveSchedule}>Save Schedule</button>
    </div>
  );
}

export default WeeklySchedule;
