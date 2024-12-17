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
    "08:30 ",
    "09:25 ",
    "10:20 ",
    "11:15 ",
    "13:00 ",
    "13:55 ",
    "14:50 ",
    "15:45 ",
    "16:40 ",
    "17:40 ",
    "18:35 ",
    "19:30 ",
    "20:25 ",
    "21:20 ",
    "22:15 ",
  ];

 const handleAddCourse = () => {
  if (!newCourse.trim() || !selectedTeacher || !selectedDay || !selectedHour || !duration) {
    alert("Please fill in all required fields (Course Name, Teacher, Day, Hour, Duration).");
    return;
  }

  const newCourseData = {
    id: Date.now(),
    courseName: newCourse,
    teacherName: selectedTeacher,
    classroom: selectedClassroom || "Not Assigned",
    day: selectedDay,
    hour: selectedHour,
    duration: `${duration} hours`,
  };

  addCourse(newCourseData);

  // State güncellendikten hemen sonra auto-assign yap
  setTimeout(() => {
    autoAssignClassroom(newCourseData);
  }, 0);

  // Input alanlarını temizle
  setNewCourse("");
  setSelectedTeacher("");
  setSelectedClassroom("");
  setSelectedDay("");
  setSelectedHour("");
  setDuration("");
};


  // Auto-Assign Fonksiyonu
  const autoAssignCourses = () => {
    const updatedCourses = courses.map((course) => {
      let assigned = false;
      const studentCount = course.students ? course.students.length : 0;

      for (const classroom of classrooms) {
        // Sınıf dolu değilse ve kapasite kursa uyuyorsa ata
        if (!classroom.isOccupied && classroom.capacity >= studentCount) {
          course.classroom = classroom.name;
          classroom.isOccupied = true; // Sınıfı işaretle
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        course.classroom = "No Available Classroom";
      }
      return course;
    });

    alert("Auto-Assign Completed!");
    console.log(updatedCourses);
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
      <button onClick={autoAssignCourses}>Auto-Assign Classrooms</button>

      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.courseName} | {course.teacherName}{" "}
            {course.day && `| ${course.day}`}{" "}
            {course.hour && `| ${course.hour}`} | Classroom:{" "}
            {course.classroom || "Not Assigned"} | Duration: {course.duration}
            <button onClick={() => deleteCourse(course.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Courses;
