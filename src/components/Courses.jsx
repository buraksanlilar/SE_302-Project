import React, { useState, useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";
import { TeachersContext } from "../context/TeachersContext";
import { ClassroomContext } from "../context/ClassroomContext";
import "./components.css";

function Courses() {
  const { courses, addCourse, deleteCourse, updateCourse } = useContext(CoursesContext);
  const { teachers } = useContext(TeachersContext);
  const { classrooms } = useContext(ClassroomContext);

  const [newCourse, setNewCourse] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [duration, setDuration] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "08:30", "09:25", "10:20", "11:15", "13:00", "13:55",
    "14:50", "15:45", "16:40", "17:40", "18:35", "19:30", "20:25", "21:20"
  ];

  // Auto Assign Fonksiyonu
  const autoAssignCourses = () => {
    const updatedCourses = courses.map((course) => {
      if (!course.classroom) {
        const suitableClassroom = classrooms.find((classroom) => {
          if (classroom.capacity < (course.students?.length || 0)) return false;
          return true;
        });

        if (suitableClassroom) {
          course.classroom = suitableClassroom.name;
        }
      }
      return course;
    });

    updateCourse(updatedCourses);
    alert("Auto Assign completed successfully!");
  };

  const handleAddCourse = () => {
    if (!newCourse || !selectedTeacher || !selectedClassroom || !selectedDay || !selectedHour || !duration) {
      alert("Please fill in all fields!");
      return;
    }

    const newCourseData = {
      id: Date.now(),
      courseName: newCourse,
      teacherName: selectedTeacher,
      classroom: selectedClassroom,
      day: selectedDay,
      hour: selectedHour,
      duration: duration,
    };

    addCourse(newCourseData);
    setNewCourse("");
    setSelectedTeacher("");
    setSelectedClassroom("");
    setSelectedDay("");
    setSelectedHour("");
    setDuration("");
  };

  return (
    <div className="container">
      <h3>Manage Courses</h3>

      {/* Form */}
      <input
        type="text"
        placeholder="Course Name"
        value={newCourse}
        onChange={(e) => setNewCourse(e.target.value)}
      />

      {/* Select Classroom */}
      <select value={selectedClassroom} onChange={(e) => setSelectedClassroom(e.target.value)}>
        <option value="">Select Classroom</option>
        {classrooms.map((classroom) => (
          <option key={classroom.id} value={classroom.name}>
            {classroom.name}
          </option>
        ))}
      </select>

      {/* Select Teacher */}
      <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
        <option value="">Select Teacher</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.name}>
            {teacher.name}
          </option>
        ))}
      </select>

      {/* Select Day */}
      <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
        <option value="">Select Day</option>
        {days.map((day) => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      {/* Select Hour */}
      <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)}>
        <option value="">Select Hour</option>
        {hours.map((hour) => (
          <option key={hour} value={hour}>{hour}</option>
        ))}
      </select>

      {/* Duration */}
      <input
        type="number"
        placeholder="Duration (hours)"
        value={duration}
        min="1"
        onChange={(e) => setDuration(e.target.value)}
      />

      {/* Button Group */}
      <div className="button-group">
        <button onClick={handleAddCourse}>Add Course</button>
        <button className="auto-assign-button" onClick={autoAssignCourses}>Auto Assign</button>
      </div>

      {/* Kurs Listesi */}
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.courseName} | {course.teacherName} | {course.day} | {course.hour} | 
            Classroom: {course.classroom || "Not Assigned"} | Duration: {course.duration} hours
            <button className="delete-button" onClick={() => deleteCourse(course.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Courses;
