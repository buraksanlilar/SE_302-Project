import React, { useContext, useState } from "react";
import { CoursesContext } from "../context/CoursesContext";
import { TeachersContext } from "../context/TeachersContext";
import { ClassroomContext } from "../context/ClassroomContext";
import "./Dashboard.css";
import WeeklySchedule from "./WeeklySchedule";

function Dashboard({ setActiveTab }) {
  const { classrooms } = useContext(ClassroomContext);
  const { teachers } = useContext(TeachersContext);
  const { courses } = useContext(CoursesContext);

  const [selectedCard, setSelectedCard] = useState(null); // Kart modal için
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const storedStudents = JSON.parse(localStorage.getItem("students")) || [];

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const courseStudents = storedStudents.filter((student) =>
    student.weeklySchedule.some((row) =>
      row.some((entry) => entry && entry.includes(selectedCourse?.courseName))
    )
  );

  const renderModalContent = () => {
    switch (selectedCard) {
      case "students":
        return (
          <ul>
            {storedStudents.map((student) => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul>
        );
      case "teachers":
        return (
          <ul>
            {teachers.map((teacher) => (
              <li key={teacher.id}>{teacher.name}</li>
            ))}
          </ul>
        );
      case "classrooms":
        return (
          <ul>
            {classrooms.map((classroom) => (
              <li key={classroom.id}>
                {classroom.name} - Capacity: {classroom.capacity}
              </li>
            ))}
          </ul>
        );
      case "courses":
        return (
          <ul>
            {courses.map((course) => (
              <li key={course.id}>
                {course.courseName} (Teacher: {course.teacherName})
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      {/* Kartlar */}
      <div className="cards-container">
        <div className="card" onClick={() => setSelectedCard("students")}>
          <h3>Total Students</h3>
          <p>{storedStudents.length}</p>
        </div>
        <div className="card" onClick={() => setSelectedCard("teachers")}>
          <h3>Total Teachers</h3>
          <p>{teachers.length}</p>
        </div>
        <div className="card" onClick={() => setSelectedCard("classrooms")}>
          <h3>Total Classrooms</h3>
          <p>{classrooms.length}</p>
        </div>
        <div className="card" onClick={() => setSelectedCard("courses")}>
          <h3>Total Courses</h3>
          <p>{courses.length}</p>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="attendance-section">
        <h3>Student Attendance by Course</h3>

        {!selectedCourse && (
          <>
            <input
              type="text"
              placeholder="Search Courses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <ul className="course-list">
              {filteredCourses.map((course) => (
                <li key={course.id}>
                  {course.courseName} - {course.teacherName}
                  <button onClick={() => setSelectedCourse(course)}>
                    View Students
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {selectedCourse && (
          <div className="course-students">
            <h4>
              Students Enrolled in {selectedCourse.courseName} (Teacher:{" "}
              {selectedCourse.teacherName})
            </h4>
            {courseStudents.length > 0 ? (
              <ul>
                {courseStudents.map((student) => (
                  <li key={student.id}>
                    {student.name}
                    <button onClick={() => setSelectedStudent(student)}>
                      View Schedule
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students enrolled in this course.</p>
            )}
            <button className="back-button" onClick={() => setSelectedCourse(null)}>
              Back
            </button>
          </div>
        )}
      </div>

      {/* WeeklySchedule Modal */}
      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content small-modal">
            <h3>Weekly Schedule for {selectedStudent.name}</h3>
            <WeeklySchedule
              student={selectedStudent}
              updateSchedule={(updatedSchedule) => {
                const updatedStudents = storedStudents.map((s) =>
                  s.id === selectedStudent.id
                    ? { ...s, weeklySchedule: updatedSchedule }
                    : s
                );
                localStorage.setItem("students", JSON.stringify(updatedStudents));
                setSelectedStudent(null);
              }}
            />
            <button onClick={() => setSelectedStudent(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for Cards */}
      {selectedCard && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {selectedCard.charAt(0).toUpperCase() + selectedCard.slice(1)}
            </h3>
            {renderModalContent()}
            <button className="close-button" onClick={() => setSelectedCard(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
