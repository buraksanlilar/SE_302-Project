import React, { useContext } from "react";
import { ClassroomContext } from "../context/ClassroomContext";
import { TeachersContext } from "../context/TeachersContext";
import { CoursesContext } from "../context/CoursesContext";
import "./Dashboard.css";

function Dashboard() {
  const { classrooms } = useContext(ClassroomContext);
  const { teachers } = useContext(TeachersContext);
  const { courses } = useContext(CoursesContext);

  // localStorage'dan öğrencileri çek
  const storedStudents = JSON.parse(localStorage.getItem("students")) || [];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      {/* Kartlar */}
      <div className="cards-container">
        <div className="card">
          <h3>Total Students</h3>
          <p>{storedStudents.length}</p>
        </div>
        <div className="card">
          <h3>Total Teachers</h3>
          <p>{teachers.length}</p>
        </div>
        <div className="card">
          <h3>Total Classrooms</h3>
          <p>{classrooms.length}</p>
        </div>
        <div className="card">
          <h3>Total Courses</h3>
          <p>{courses.length}</p>
        </div>
      </div>

      {/* Öğrenci Katılım Placeholder */}
      <div className="dashboard-data">
        <div className="chart-placeholder">
          <h3>Student Attendance</h3>
          <p>[Chart Placeholder]</p>
        </div>
        {/* Summary */}
        <div className="summary">
          <h3>Summary</h3>
          <p>
            Welcome to your school management system. Here you can keep track of
            students, teachers, classrooms, and courses effectively. Use the
            navigation menu to access specific sections.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
