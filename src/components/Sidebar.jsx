import React from "react";
import "./Sidebar.css";

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">SCHOOL SM</h3>
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
          className={activeTab === "teachers" ? "active" : ""}
          onClick={() => setActiveTab("teachers")}
        >
          Teachers
        </li>
        <li
          className={activeTab === "courses" ? "active" : ""}
          onClick={() => setActiveTab("courses")}
        >
          Courses
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
