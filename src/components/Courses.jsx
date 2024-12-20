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
  const [duration, setDuration] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "08:30", "09:25", "10:20", "11:15", "13:00", "13:55",
    "14:50", "15:45", "16:40", "17:40", "18:35", "19:30", "20:25", "21:20"
  ];

  // Çakışma kontrolü
  const checkForConflicts = () => {
    return courses.some((course) => {
      if (
        course.classroom === selectedClassroom &&
        course.day === selectedDay
      ) {
        const existingHourIndex = hours.indexOf(course.hour);
        const newHourIndex = hours.indexOf(selectedHour);
        const courseDuration = parseInt(course.duration) || 1;
        const newDuration = parseInt(duration) || 1;

        // Yeni dersin zaman dilimiyle mevcut dersin zaman dilimi çakışıyor mu kontrol et
        for (let i = 0; i < courseDuration; i++) {
          for (let j = 0; j < newDuration; j++) {
            if (existingHourIndex + i === newHourIndex + j) {
              return true;
            }
          }
        }
      }
      return false;
    });
  };

  // Yeni ders ekleme
  const handleAddCourse = () => {
    if (!newCourse || !selectedTeacher || !selectedDay || !selectedHour || !duration) {
      alert("Please fill in all fields!");
      return;
    }

    if (checkForConflicts()) {
      alert("There is a scheduling conflict! This classroom already has a course at the selected time.");
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

    // Inputları temizle
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

      <input
        type="text"
        placeholder="Course Name"
        value={newCourse}
        onChange={(e) => setNewCourse(e.target.value)}
      />

      <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
        <option value="">Select Teacher</option>
        {teachers.map((teacher) => (
          <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
        ))}
      </select>

      <select value={selectedClassroom} onChange={(e) => setSelectedClassroom(e.target.value)}>
        <option value="">Select Classroom</option>
        {classrooms.map((classroom) => (
          <option key={classroom.id} value={classroom.name}>{classroom.name}</option>
        ))}
      </select>

      <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
        <option value="">Select Day</option>
        {days.map((day) => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)}>
        <option value="">Select Hour</option>
        {hours.map((hour) => (
          <option key={hour} value={hour}>{hour}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Duration (hours)"
        value={duration}
        min="1"
        onChange={(e) => setDuration(e.target.value)}
      />

      <button onClick={handleAddCourse}>Add Course</button>

      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.courseName} | {course.teacherName} | {course.day} | {course.hour} | 
            Classroom: {course.classroom} | Duration: {course.duration} hours
            <button onClick={() => deleteCourse(course.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Courses;
