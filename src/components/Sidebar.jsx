import React from "react";

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
        <li className="disabled">Teachers</li>
        <li className="disabled">Departments</li>
        <li className="disabled">Subjects</li>
        <li className="disabled">Invoices</li>
      </ul>
    </div>
  );
}

export default Sidebar;
