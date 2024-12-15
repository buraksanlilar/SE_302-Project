import React, { useState, useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";
import { TeachersContext } from "../context/TeachersContext";
import "./components.css"; // Ortak CSS dosyasını ekleyin

function Courses() {
  const { courses, addCourse, deleteCourse } = useContext(CoursesContext);
  const { teachers } = useContext(TeachersContext);

  const [newCourse, setNewCourse] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const handleAddCourse = () => {
    if (!newCourse.trim() || !selectedTeacher) {
      alert("Please fill in all fields.");
      return;
    }

    const newCourseData = {
      id: Date.now(),
      courseName: newCourse,
      teacherName: selectedTeacher,
    };

    addCourse(newCourseData);
    setNewCourse("");
    setSelectedTeacher("");
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
      <button onClick={handleAddCourse}>Add Course</button>

      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.courseName} (Teacher: {course.teacherName})
            <button onClick={() => deleteCourse(course.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Courses;
