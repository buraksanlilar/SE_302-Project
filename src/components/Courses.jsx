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
  const [editCourse, setEditCourse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [duration, setDuration] = useState("");
  const [students, setStudents] = useState("");

  const [editCourse, setEditCourse] = useState(null); // Düzenlenecek kurs
  const [newClassroomForEdit, setNewClassroomForEdit] = useState(""); // Yeni sınıf seçimi

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
      const savedSchedule =
        JSON.parse(localStorage.getItem(`schedule_${classroom.name}`)) || [];
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
          const hasBackToBackConflict =
            schedule[startSlot - 1]?.[dayIndex] === course.courseName ||
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
    updatedCourses.forEach((course) => updateCourse(course));

    // Sınıf programlarını güncelle ve localStorage'a kaydet
    classrooms.forEach((classroom) => {
      const schedule = classroomSchedules[classroom.name];
      classroom.schedule = schedule;
      localStorage.setItem(
        `schedule_${classroom.name}`,
        JSON.stringify(schedule)
      );
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
  const handleEditCourse = (course) => {
    setEditCourse(course);
    setSelectedClassroom(course.classroom || ""); // Mevcut sınıfı seçili yap
  };
  const normalizeTimeFormat = (time) => {
    const [hour, minute] = time.split(":").map((t) => parseInt(t, 10));
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}`;
  };

  const handleSaveEdit = () => {
    if (!editCourse || !selectedClassroom) {
      setErrorMessage("Please select a classroom.");
      return;
    }

    // Yeni sınıfın programını al
    const savedSchedule =
      JSON.parse(localStorage.getItem(`schedule_${selectedClassroom}`)) || [];
    const schedule =
      savedSchedule.length > 0
        ? savedSchedule
        : Array.from({ length: 16 }, () => new Array(5).fill(null));

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = generateTimeSlots();

    const dayIndex = days.indexOf(editCourse.day);
    const normalizedCourseHour = normalizeTimeFormat(editCourse.hour.trim());
    const startSlot = timeSlots.indexOf(normalizedCourseHour);
    const duration = parseInt(editCourse.duration, 10);
    console.log(dayIndex);
    console.log(startSlot);
    console.log(duration);
    if (dayIndex === -1 || startSlot === -1 || duration <= 0) {
      setErrorMessage("Invalid course data.");
      return;
    }

    // Çakışma kontrolü
    const hasConflict = schedule
      .slice(startSlot, startSlot + duration)
      .some((slot) => slot[dayIndex] !== null);

    if (hasConflict) {
      setErrorMessage(
        `Classroom "${selectedClassroom}" is not available at ${editCourse.day} ${editCourse.hour}.`
      );
      return;
    }

    // Eski sınıfın programını güncelle
    if (editCourse.classroom) {
      const oldSchedule =
        JSON.parse(localStorage.getItem(`schedule_${editCourse.classroom}`)) ||
        [];
      const oldScheduleUpdated = oldSchedule.map((row) => [...row]);

      for (let i = 0; i < duration; i++) {
        if (startSlot + i < oldScheduleUpdated.length) {
          oldScheduleUpdated[startSlot + i][dayIndex] = null;
        }
      }

      localStorage.setItem(
        `schedule_${editCourse.classroom}`,
        JSON.stringify(oldScheduleUpdated)
      );
    }

    // Yeni sınıfın programını güncelle
    const newSchedule = schedule.map((row) => [...row]);

    for (let i = 0; i < duration; i++) {
      if (startSlot + i < newSchedule.length) {
        newSchedule[startSlot + i][dayIndex] = editCourse.courseName;
      }
    }

    localStorage.setItem(
      `schedule_${selectedClassroom}`,
      JSON.stringify(newSchedule)
    );

    // Kursu güncelle
    const updatedCourses = courses.map((course) =>
      course.id === editCourse.id
        ? { ...editCourse, classroom: selectedClassroom }
        : course
    );

    updateCourse(updatedCourses);
    setEditCourse(null);
    setSelectedClassroom("");
    setErrorMessage("");
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

    if (
      courses.some(
        (course) =>
          course.classroom === newCourseData.classroom &&
          course.day === newCourseData.day &&
          course.hour === newCourseData.hour
      )
    ) {
      alert(
        `Conflict detected: Another course is scheduled in ${newCourseData.classroom} on ${newCourseData.day} at ${newCourseData.hour}.`
      );
      return;
    }

    addCourse(newCourseData);
    setNewCourse("");
    setSelectedTeacher("");
    setSelectedClassroom("");
    setSelectedDay("");
    setSelectedHour("");
    setDuration("");
    setStudents("");
  };

  const handleEditClassroom = () => {
    if (!editCourse || !newClassroomForEdit) {
      alert("Please select a course and a classroom!");
      return;
    }

    const updatedCourse = { ...editCourse, classroom: newClassroomForEdit };

    if (
      courses.some(
        (course) =>
          course.classroom === updatedCourse.classroom &&
          course.day === updatedCourse.day &&
          course.hour === updatedCourse.hour &&
          course.id !== updatedCourse.id
      )
    ) {
      alert(
        `Conflict detected: Another course is scheduled in ${updatedCourse.classroom} on ${updatedCourse.day} at ${updatedCourse.hour}.`
      );
      return;
    }

    const updatedCourses = courses.map((course) =>
      course.id === editCourse.id ? updatedCourse : course
    );

    updateCourse(updatedCourses);
    setEditCourse(null);
    setNewClassroomForEdit("");
    alert("Classroom updated successfully!");
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
        {classrooms?.map((classroom, index) => (
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
        {teachers?.map((teacher, index) => (
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
        {courses?.map((course, index) => (
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
            <button
              className="edit-button"
              onClick={() => handleEditCourse(course)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {editCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Edit Classroom for {editCourse.courseName}</h4>

            <select
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
            >
              <option value="">Select Classroom</option>
              {classrooms?.map((classroom, index) => (
                <option key={`${classroom.id}-${index}`} value={classroom.name}>
                  {classroom.name}
                </option>
              ))}
            </select>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <div className="button-group">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setEditCourse(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
