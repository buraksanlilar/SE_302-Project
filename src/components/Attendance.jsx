import React, { useState, useContext, useEffect } from "react";
import { CoursesContext } from "../context/CoursesContext";
import { AppContext } from "../context/AppContext";
import "./components.css";

function Attendance() {
  const { courses } = useContext(CoursesContext); // Kursları çekiyoruz
  const { students } = useContext(AppContext); // Öğrencileri çekiyoruz
  const [selectedCourse, setSelectedCourse] = useState(""); // Seçilen kurs
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtrelenmiş öğrenciler
  const [attendance, setAttendance] = useState({}); // Katılım durumu
  const [search, setSearch] = useState(""); // Arama inputu

  // İlk yüklenmede ve local storage'dan verileri al
  useEffect(() => {
    const savedAttendance = JSON.parse(localStorage.getItem("attendance")) || {};
    setAttendance(savedAttendance);
  }, []);

  // Katılım verilerini localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  // Seçilen kursa göre öğrencileri filtrele
  useEffect(() => {
    if (selectedCourse) {
      const courseStudents = students.filter((student) =>
        student.weeklySchedule.some((week) =>
          week.some((entry) => entry?.includes(selectedCourse))
        )
      );
      setFilteredStudents(courseStudents);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedCourse, students]);

  // Öğrenci arama fonksiyonu
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Katılım toggle
  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container">
      <h3>Student Attendance</h3>

      {/* Kurs Seçimi */}
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.courseName}>
            {course.courseName} (Teacher: {course.teacherName})
          </option>
        ))}
      </select>

      {/* Arama Kutusu */}
      <input
        type="text"
        placeholder="Search student"
        value={search}
        onChange={handleSearch}
      />

      {/* Öğrenci Listesi */}
      <ul>
        {filteredStudents
          .filter((student) =>
            student.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((student) => (
            <li key={student.id} className="attendance-item">
              {student.name}
              <input
                type="checkbox"
                checked={attendance[student.id] || false}
                onChange={() => toggleAttendance(student.id)}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Attendance;
