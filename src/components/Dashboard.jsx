import React, { useContext, useState } from "react";
import { CoursesContext } from "../context/CoursesContext";
import { TeachersContext } from "../context/TeachersContext";
import { ClassroomContext } from "../context/ClassroomContext";
import { StudentsContext } from "../context/StudentsContext";
import "./Dashboard.css";
import WeeklySchedule from "./weeklySchedule";

function Dashboard({ setActiveTab }) {
  const { classrooms } = useContext(ClassroomContext);
  const { teachers } = useContext(TeachersContext);
  const { courses } = useContext(CoursesContext);
  const { students } = useContext(StudentsContext);

  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [classroomSearchQuery, setClassroomSearchQuery] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "08:30",
    "09:25",
    "10:20",
    "11:15",
    "13:00",
    "13:55",
    "14:50",
    "15:45",
    "16:40",
    "17:40",
    "18:35",
    "19:30",
    "20:25",
    "21:20",
  ];

  const filteredCourses = courses.filter((course) =>
    course.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.name.toLowerCase().includes(classroomSearchQuery.toLowerCase())
  );

  const courseStudents = students.filter((student) =>
    student.weeklySchedule.some((row) =>
      row.some((entry) => entry && entry.includes(selectedCourse?.courseName))
    )
  );

  const getClassroomSchedule = (classroomName) => {
    const schedule = Array.from({ length: hours.length }, () =>
      Array(days.length).fill("-")
    );

    courses
      .filter((course) => course.classroom === classroomName)
      .forEach((course) => {
        const dayIndex = days.indexOf(course.day);
        const hourIndex = hours.indexOf(course.hour.trim());
        const duration = parseInt(course.duration) || 1;

        if (dayIndex !== -1 && hourIndex !== -1) {
          for (let i = 0; i < duration; i++) {
            if (hourIndex + i < hours.length) {
              schedule[hourIndex + i][dayIndex] = course.courseName;
            }
          }
        }
      });

    return schedule;
  };

  const renderModalContent = () => {
    switch (selectedCard) {
      case "students":
        return (
          <ul>
            {students.map((student) => (
              <li key={`${student.id}-${student.name}`}>{student.name}</li>
            ))}
          </ul>
        );
      case "teachers":
        return (
          <ul>
            {teachers.map((teacher) => (
              <li key={`${teacher.id}-${teacher.name}`}>{teacher.name}</li>
            ))}
          </ul>
        );
      case "classrooms":
        return (
          <ul>
            {classrooms.map((classroom) => (
              <li key={`${classroom.id}-${classroom.name}`}>
                {classroom.name} - Capacity: {classroom.capacity}
              </li>
            ))}
          </ul>
        );
      case "courses":
        return (
          <ul>
            {courses.map((course) => (
              <li key={`${course.id}-${course.courseName}`}>
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
      <div className="cards-container">
        <div className="card" onClick={() => setSelectedCard("students")}>
          <h3>Total Students</h3>
          <p>{students.length}</p>
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
      <div className="attendance-section">
        <h3>Student Attendance by Course</h3>
        {!selectedCourse ? (
          <>
            <input
              type="text"
              placeholder="Search Courses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="scrollable-list">
              <ul className="course-list">
                {filteredCourses.map((course) => (
                  <li key={`${course.id}-${course.courseName}`}>
                    {course.courseName} - {course.teacherName}
                    <button onClick={() => setSelectedCourse(course)}>
                      View Students
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="course-students">
            <h4>
              Students Enrolled in {selectedCourse.courseName} (Teacher:{" "}
              {selectedCourse.teacherName})
            </h4>
            <ul>
              {courseStudents.map((student) => (
                <li key={`${student.id}-${student.name}`}>
                  {student.name}
                  <button onClick={() => setSelectedStudent(student)}>
                    View Schedule
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="back-button"
              onClick={() => setSelectedCourse(null)}
            >
              Back
            </button>
          </div>
        )}
      </div>
      <div className="attendance-section">
        <h3>Search by Classroom</h3>
        <input
          type="text"
          placeholder="Search Classrooms"
          value={classroomSearchQuery}
          onChange={(e) => setClassroomSearchQuery(e.target.value)}
        />
        <div className="scrollable-list">
          <ul className="classroom-list">
            {filteredClassrooms.map((classroom) => (
              <li key={`${classroom.id}-${classroom.name}`}>
                {classroom.name} - Capacity: {classroom.capacity}
                <button onClick={() => setSelectedClassroom(classroom)}>
                  View Schedule
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedClassroom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Weekly Schedule for {selectedClassroom.name}</h3>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  {days.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getClassroomSchedule(selectedClassroom.name).map(
                  (row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      <td>{hours[rowIndex]}</td>
                      {row.map((cell, cellIndex) => (
                        <td key={`cell-${rowIndex}-${cellIndex}`}>
                          {cell || "-"}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <button onClick={() => setSelectedClassroom(null)}>Close</button>
          </div>
        </div>
      )}
      {selectedCard && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {selectedCard.charAt(0).toUpperCase() + selectedCard.slice(1)}
            </h3>
            {renderModalContent()}
            <button
              className="close-button"
              onClick={() => setSelectedCard(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
