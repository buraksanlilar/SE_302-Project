import React, { useState, useContext } from "react";
import { CoursesContext } from "../context/CoursesContext";
import { TeachersContext } from "../context/TeachersContext";
import { ClassroomContext } from "../context/ClassroomContext";
import "./components.css";

function Courses() {
  const { courses, addCourse, deleteCourse, updateCourse } =
    useContext(CoursesContext);
  const { teachers } = useContext(TeachersContext);
  const { classrooms } = useContext(ClassroomContext);

  const [newCourse, setNewCourse] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [duration, setDuration] = useState("");
  const [students, setStudents] = useState("");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = [
    "8:30",
    "9:25",
    "10:20",
    "11:15",
    "12:10",
    "13:05",
    "14:00",
    "14:55",
    "15:50",
    "16:45",
    "17:40",
    "18:35",
    "19:30",
    "20:25",
  ];

  const autoAssignCourses = () => {
    const updatedCourses = [...courses]; // Kursların kopyasını al
 
    // Tüm sınıfların haftalık programlarını takip etmek için bir yapı oluştur
    const classroomSchedules = {};
 
    classrooms.forEach((classroom) => {
      // LocalStorage'dan mevcut programı al
      const savedSchedule = JSON.parse(localStorage.getItem(`schedule_${classroom.name}`)) || [];
      const schedule = savedSchedule.length
        ? savedSchedule
        : Array.from({ length: 16 }, () => new Array(5).fill(null));
      classroomSchedules[classroom.name] = schedule; // Sınıfın adına göre tabloyu sakla
    });
 
    console.log("Classroom Schedules Initialized:", classroomSchedules);
 
    const unassignedCourses = []; // Atanamayan kursları kaydetmek için
 
    updatedCourses.forEach((course) => {
      if (!course.classroom || course.classroom === "Unknown Classroom") {
        let assigned = false;
 
        for (const classroom of classrooms) {
          const schedule = classroomSchedules[classroom.name];
          const dayIndex = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ].indexOf(course.day);
          const timeSlots = generateTimeSlots();
          const normalizeTimeFormat = (time) => {
            const [hour, minute] = time.split(":").map((t) => parseInt(t, 10));
            return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
              2,
              "0"
            )}`;
          };
 
          // Normalizasyonu uygulayın:
          const normalizedCourseHour = normalizeTimeFormat(course.hour.trim());
          const startSlot = timeSlots.indexOf(normalizedCourseHour);
 
          const duration = parseInt(course.duration, 10);
 
          if (dayIndex === -1 || startSlot === -1 || duration <= 0) {
            console.warn(
              `Invalid day or time for course: ${course.courseName}`
            );
            break;
          }
 
          // Çakışma kontrolü
          const hasConflict = schedule
            .slice(startSlot, startSlot + duration)
            .some((row) => row[dayIndex] !== null);
 
          // Art arda aynı dersin sınıfta olmamasını sağlamak için kontrol ekle
          const hasBackToBackConflict = schedule[startSlot - 1]?.[dayIndex] === course.courseName ||
            schedule[startSlot + duration]?.[dayIndex] === course.courseName;
 
          // Kapasite kontrolü
          const isCapacitySufficient =
            classroom.capacity >= (course.students?.length || 0);
 
          if (!hasConflict && !hasBackToBackConflict && isCapacitySufficient) {
            // Kursu sınıfa ata
            for (let i = startSlot; i < startSlot + duration; i++) {
              schedule[i][dayIndex] = course.courseName;
            }
            course.classroom = classroom.name;
            assigned = true;
            break;
          }
        }
 
        if (!assigned) {
          unassignedCourses.push({
            course: course.courseName,
            reason: `No suitable classroom for ${course.courseName} on ${course.day} at ${course.hour}`,
          });
        }
      }
    });
 
    // Güncellenen kursları kaydet
    updateCourse(updatedCourses);
 
    // Sınıf programlarını güncelle ve localStorage'a kaydet
    classrooms.forEach((classroom) => {
      const schedule = classroomSchedules[classroom.name];
      classroom.schedule = schedule;
      localStorage.setItem(`schedule_${classroom.name}`, JSON.stringify(schedule));
    });
 
    // Atanamayan kursları raporla
    if (unassignedCourses.length > 0) {
      console.warn(
        `Unassigned courses (${unassignedCourses.length}):`,
        unassignedCourses
      );
      alert(
        `Some courses could not be assigned:\n${unassignedCourses
          .map((c) => `${c.course}: ${c.reason}`)
          .join("\n")}`
      );
    } else {
      alert("All courses have been successfully assigned!");
    }
  };
 

  function generateTimeSlots() {
    const slots = [];
    let hour = 8;
    let minute = 30;

    for (let i = 0; i < 16; i++) {
      const start = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      slots.push(start.trim());
      minute += 45;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
      minute += 10;
      if (minute >= 60) {
        hour += 1;
        minute -= 60;
      }
    }
    return slots;
  }

  const handleAddCourse = () => {
    if (
      !newCourse ||
      !selectedTeacher ||
      !selectedDay ||
      !selectedHour ||
      !duration
    ) {
      alert("Please fill in all fields!");
      return;
    }

    const newCourseData = {
      id: Date.now(),
      courseName: newCourse,
      teacherName: selectedTeacher,
      classroom: selectedClassroom,
      day: selectedDay,
      hour: selectedHour,
      duration: duration,
      students: students
        ? students.split(",").map((student) => student.trim())
        : [],
    };

    addCourse(newCourseData);
    setNewCourse("");
    setSelectedTeacher("");
    setSelectedClassroom("");
    setSelectedDay("");
    setSelectedHour("");
    setDuration("");
    setStudents("");
  };

  return (
    <div className="container">
      <h3>Manage Courses</h3>

      <input
        type="text"
        placeholder="Course Name"
        value={newCourse}
        onChange={(e) => setNewCourse(e.target.value)}
      />

      <select
        value={selectedClassroom}
        onChange={(e) => setSelectedClassroom(e.target.value)}
      >
        <option value="">Select Classroom</option>
        {classrooms.map((classroom, index) => (
          <option key={`${classroom.id}-${index}`} value={classroom.name}>
            {classroom.name}
          </option>
        ))}
      </select>

      <select
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
      >
        <option value="">Select Teacher</option>
        {teachers.map((teacher, index) => (
          <option key={`${teacher.id}-${index}`} value={teacher.name}>
            {teacher.name}
          </option>
        ))}
      </select>

      <select
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
      >
        <option value="">Select Day</option>
        {days.map((day, index) => (
          <option key={`${day}-${index}`} value={day}>
            {day}
          </option>
        ))}
      </select>

      <select
        value={selectedHour}
        onChange={(e) => setSelectedHour(e.target.value)}
      >
        <option value="">Select Hour</option>
        {hours.map((hour, index) => (
          <option key={`${hour}-${index}`} value={hour}>
            {hour}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Duration (hours)"
        value={duration}
        min="1"
        onChange={(e) => setDuration(e.target.value)}
      />

      <div className="button-group">
        <button onClick={handleAddCourse}>Add Course</button>
        <button className="auto-assign-button" onClick={autoAssignCourses}>
          Auto Assign
        </button>
      </div>

      <ul>
        {courses.map((course, index) => (
          <li key={`${course.id}-${index}`}>
            {course.courseName} | {course.teacherName} | {course.day} |{" "}
            {course.hour} | Classroom: {course.classroom || "Not Assigned"} |
            Duration: {course.duration} hours
            <button
              className="delete-button"
              onClick={() => deleteCourse(course.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Courses;
