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
        {activeTab === "dashboard" && <h1 className="page-title">Dashboard</h1>}
        {activeTab === "students" && <Students />}
        {activeTab === "teachers" && <h1 className="page-title">Teachers</h1>}
        {activeTab === "departments" && (
          <h1 className="page-title">Departments</h1>
        )}
        {activeTab === "subjects" && <h1 className="page-title">Subjects</h1>}
        {activeTab === "invoices" && <h1 className="page-title">Invoices</h1>}
      </div>
    </div>
  );
}

export default App;
