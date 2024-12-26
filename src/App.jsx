import React, { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Students from "./components/Students.jsx";
import Classrooms from "./components/Classrooms.jsx";
import Teachers from "./components/Teachers.jsx";
import Courses from "./components/Courses.jsx";
import Dashboard from "./components/Dashboard.jsx";
import StudentsProvider from "./context/StudentsContext";

import { ClassroomProvider } from "./context/ClassroomContext";
import TeachersContextProvider from "./context/TeachersContext.jsx";
import CoursesProvider from "./context/CoursesContext.jsx";

import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <StudentsProvider>
      <CoursesProvider>
        <ClassroomProvider>
          <TeachersContextProvider>
            <div className="app-container">
              <Sidebar setActiveTab={setActiveTab} />
              <div className="content">
                {activeTab === "dashboard" && <Dashboard />}
                {activeTab === "students" && <Students />}
                {activeTab === "teachers" && <Teachers />}
                {activeTab === "classrooms" && <Classrooms />}
                {activeTab === "courses" && <Courses />}
              </div>
            </div>
          </TeachersContextProvider>
        </ClassroomProvider>
      </CoursesProvider>
    </StudentsProvider>
  );
}

export default App;
