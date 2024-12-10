import React, { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Students from "./components/Students.jsx";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="app-container">
      <Sidebar setActiveTab={setActiveTab} />
      <div className="content">
        {activeTab === "dashboard" && <h1>Dashboard</h1>}
        {activeTab === "students" && <Students />}
        {activeTab === "teachers" && <h1>Teachers</h1>}
        {activeTab === "departments" && <h1>Departments</h1>}
        {activeTab === "subjects" && <h1>Subjects</h1>}
        {activeTab === "invoices" && <h1>Invoices</h1>}
      </div>
    </div>
  );
}

export default App;
