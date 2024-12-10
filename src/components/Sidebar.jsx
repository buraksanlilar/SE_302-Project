import React from "react";
import "../Sidebar.css"; // Sidebar için CSS dosyası

function Sidebar({ setActiveTab }) {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">School SM</h3>
      <ul className="sidebar-menu">
        <li onClick={() => setActiveTab("dashboard")}>Dashboard</li>
        <li onClick={() => setActiveTab("students")}>Students</li>
        <li onClick={() => setActiveTab("teachers")}>Teachers</li>
        <li onClick={() => setActiveTab("departments")}>Departments</li>
        <li onClick={() => setActiveTab("subjects")}>Subjects</li>
        <li onClick={() => setActiveTab("invoices")}>Invoices</li>
      </ul>
    </div>
  );
}

export default Sidebar;
