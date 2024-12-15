import React from "react";
import "./sidebar.css";

function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">School SM</h3>
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
        <li
          className={activeTab === "departments" ? "active" : ""}
          onClick={() => setActiveTab("departments")}
        >
          Departments
        </li>
        <li
          className={activeTab === "subjects" ? "active" : ""}
          onClick={() => setActiveTab("subjects")}
        >
          Subjects
        </li>
        <li
          className={activeTab === "invoices" ? "active" : ""}
          onClick={() => setActiveTab("invoices")}
        >
          Invoices
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
