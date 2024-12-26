import React, { useState } from "react";
//import { saveAs } from "file-saver"; // File-Saver kitaplığı
import "./Sidebar.css";

function Sidebar({ activeTab, setActiveTab }) {
  const [showAboutModal, setShowAboutModal] = useState(false);

  const exportToCSV = (data, filename) => {
    const keys = Object.keys(data[0] || {});
    const csvContent =
      keys.join(",") +
      "\n" +
      data
        .map((row) =>
          keys
            .map((key) =>
              typeof row[key] === "string" ? `"${row[key]}"` : row[key]
            )
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  const handleExport = () => {
    // Courses
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    if (courses.length) {
      exportToCSV(courses, "CoursesExport.csv");
    }

    // Classrooms
    const classrooms = JSON.parse(localStorage.getItem("classrooms")) || [];
    if (classrooms.length) {
      exportToCSV(classrooms, "ClassroomsExport.csv");
    }

    alert("Export işlemi tamamlandı!");
  };

  return (
    <>
      <div className="sidebar">
        <h3 className="sidebar-title">Campus Dashboard</h3>
        <ul className="sidebar-menu">
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            Students
          </li>
          <li
            className={activeTab === "teachers" ? "active" : ""}
            onClick={() => setActiveTab("teachers")}
          >
            Teachers
          </li>
          <li
            className={activeTab === "classrooms" ? "active" : ""}
            onClick={() => setActiveTab("classrooms")}
          >
            Classrooms
          </li>
          <li
            className={activeTab === "courses" ? "active" : ""}
            onClick={() => setActiveTab("courses")}
          >
            Courses
          </li>
          <li onClick={handleExport}>Export Courses & Classrooms</li>
          <li onClick={() => setShowAboutModal(true)}>Help</li>
        </ul>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>About Campus Dashboard</h2>
            <p>
              <strong>Welcome to Campus Dashboard!</strong> This application
              helps educational institutions efficiently manage their resources,
              including students, teachers, classrooms, and courses.
            </p>
            <h3>Quick Start Guide</h3>
            <ul>
              <li>
                <strong>Dashboard:</strong> Get an overview of total counts for
                students, teachers, classrooms, and courses. Click on any card
                to explore details.
              </li>
              <li>
                <strong>Students:</strong> Add, delete, and manage students.
                View and edit their weekly schedules.
              </li>
              <li>
                <strong>Teachers:</strong> Maintain your teaching staff list and
                manage course assignments.
              </li>
              <li>
                <strong>Classrooms:</strong> Check classroom availability, add
                new classrooms, and view weekly schedules.
              </li>
              <li>
                <strong>Courses:</strong> Organize course details, assign
                teachers and classrooms, and handle scheduling conflicts.
              </li>
            </ul>
            <h3>Key Features</h3>
            <ul>
              <li>
                <strong>Automated Scheduling:</strong> Assign courses to
                classrooms based on capacity and availability.
              </li>
              <li>
                <strong>Conflict Detection:</strong> Prevent scheduling issues
                with real-time conflict alerts.
              </li>
              <li>
                <strong>Data Management:</strong> Import/export data using CSV
                files for seamless updates.
              </li>
            </ul>
            <h3>Version Information</h3>
            <p>
              <strong>Version:</strong> 1.0.1
              <br />
              <strong>Release Date:</strong> December 2024
            </p>
            <h3>Developed By</h3>
            <ul>
              <li>
                <a
                  href="https://github.com/selenoznur"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#3498db" }}
                >
                  Selen ÖZNUR - 20220602062
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/buraksanlilar"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#3498db" }}
                >
                  Özcan Burak ŞANLILAR - 20210602058
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/sucreistaken"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#3498db" }}
                >
                  Kadir AY - 20210602006
                </a>
              </li>
              <li>Orkun Efe ÖZDEMİR - 20220602061</li>
            </ul>
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              <strong>Thank you for choosing Campus Dashboard!</strong>
            </p>
            <button onClick={() => setShowAboutModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
