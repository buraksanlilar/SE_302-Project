import React, { useState, useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";
import { TeachersContext } from "../context/TeachersContext";
import { ClassroomContext } from "../context/ClassroomContext";
import "./components.css";
 
function Courses() {
  const { courses, addCourse, deleteCourse } = useContext(CoursesContext);
  const { teachers } = useContext(TeachersContext);
  const { classrooms } = useContext(ClassroomContext);
 
  const [newCourse, setNewCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [duration, setDuration] = useState(""); // Kaç ders sürecek
 
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "08:30 - 09:15",
    "09:25 - 10:10",
    "10:20 - 11:05",
    "11:15 - 12:00",
    "13:00 - 13:45",
    "13:55 - 14:40",
    "14:50 - 15:35",
    "15:45 - 16:30",
    "16:40 - 17:25",
    "17:40 - 18:25",
    "18:35 - 19:20",
    "19:30 - 20:15",
    "20:25 - 21:10",
    "21:20 - 22:05",
    "22:15 - 23:00",
  ];
 
  const handleAddCourse = () => {
    if (
      !newCourse.trim() ||
      !selectedTeacher ||
      !selectedClassroom ||
      !selectedDay ||
      !selectedHour ||
      !duration
    ) {
      alert("Please fill in all fields.");
      return;
    }
 
    const newCourseData = {
      id: Date.now(),
      courseName: newCourse,
      teacherName: selectedTeacher,
      classroom: selectedClassroom,
      day: selectedDay,
      hour: selectedHour,
      duration: `${duration} hours`, // Kaç ders süreceği
    };
 
    addCourse(newCourseData);
 
    setNewCourse("");
    setSelectedTeacher("");
    setSelectedClassroom("");
    setSelectedDay("");
    setSelectedHour("");
    setDuration("");
    setErrorMessage("");
  };
 
  return (
    <div className="container">
      <h3>Manage Courses</h3>
 
      <input
        type="text"
        placeholder="Course Name"
        value={newCourse}
        onChange={(e) => setNewCourse(e.target.value)}
      />
 
      <select
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
      >
        <option value="">Select Teacher</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.name}>
            {teacher.name}
          </option>
        ))}
      </select>
 
      <select
        value={selectedClassroom}
        onChange={(e) => setSelectedClassroom(e.target.value)}
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
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
 
      <select
        value={selectedHour}
        onChange={(e) => setSelectedHour(e.target.value)}
      >
        <option value="">Select Hour</option>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
 
      <input
        type="number"
        placeholder="Duration (in lessons)"
        value={duration}
        min="1"
        onChange={(e) => setDuration(e.target.value)}
      />
 
      <button onClick={handleAddCourse}>Add Course</button>
 
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.courseName} | {course.teacherName}{" "}
            {course.day && `| ${course.day}`}{" "}
            {course.hour && `| ${course.hour}`} | Duration: {course.duration}
            <button onClick={() => deleteCourse(course.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
 
export default Courses;
 
 