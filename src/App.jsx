import React, { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Students from "./components/Students.jsx";
import Classrooms from "./components/Classrooms.jsx";
import { ClassroomProvider } from "./context/ClassroomContext"; // ClassroomContext'i ekledik

import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <ClassroomProvider> {/* ClassroomProvider ile uygulamayı sarmaladık */}
      <div className="app-container">
        <div className="main-content">
          <Sidebar setActiveTab={setActiveTab} />
          <div className="content">
            {activeTab === "dashboard" && (
              <h1 className="page-title">Dashboard</h1>
            )}
            {activeTab === "students" && <Students />} {/* Students güncellendi */}
            {activeTab === "teachers" && (
              <h1 className="page-title">Teachers</h1>
            )}
            {activeTab === "classrooms" && <Classrooms />} {/* Classrooms */}
            {activeTab === "departments" && (
              <h1 className="page-title">Departments</h1>
            )}
            {activeTab === "subjects" && (
              <h1 className="page-title">Subjects</h1>
            )}
            {activeTab === "invoices" && (
              <h1 className="page-title">Invoices</h1>
            )}
          </div>
        </div>
      </div>
    </ClassroomProvider>
  );
}

export default App;
