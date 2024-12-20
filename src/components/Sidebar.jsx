import React, { useState } from "react";
import "./Sidebar.css";

function Sidebar({ activeTab, setActiveTab }) {
  const [showAboutModal, setShowAboutModal] = useState(false);

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
          <li onClick={() => setShowAboutModal(true)}>Help</li>
        </ul>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>About Campus Dashboard</h2>
            <p>
              <strong>Campus Dashboard</strong> is a desktop application designed to assist educational institutions
              in efficiently managing course schedules, classrooms, and student enrollments.
              The software provides a modern, user-friendly interface that simplifies scheduling
              operations and ensures conflict-free course assignments.
            </p>
            <h3>Key Features</h3>
            <ul>
              <li><strong>Course Management:</strong> Add, delete, and reassign courses.</li>
              <li><strong>Classroom Scheduling:</strong> Assign classrooms based on capacity and availability.</li>
              <li><strong>Conflict Detection:</strong> Detect and resolve scheduling conflicts.</li>
              <li><strong>Attendance Tracking:</strong> View and manage attendance lists for each course.</li>
              <li><strong>Weekly Schedules:</strong> View and edit student and classroom schedules.</li>
              <li><strong>Data Persistence:</strong> Save and load schedules and course data.</li>
              <li><strong>File Import/Export:</strong> Seamlessly manage data using CSV files.</li>
            </ul>
            <h3>System Requirements</h3>
            <ul>
              <li><strong>Operating System:</strong> Windows</li>
              <li><strong>Language:</strong> English</li>
              <li><strong>Technologies:</strong> React, Electron, JavaScript</li>
            </ul>
            <h3>Version Information</h3>
            <p>
              <strong>Version:</strong> 1.0.0<br />
              <strong>Release Date:</strong> December 2024<br />
              <strong>Developed By:</strong>
            </p>
            <ul>
              <li>Selen ÖZNUR - 20220602062</li>
              <li>Özcan Burak ŞANLILAR - 20210602058</li>
              <li>Kadir AY - 20210602006</li>
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
