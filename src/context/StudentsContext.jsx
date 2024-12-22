import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // UUID import

export const StudentsContext = createContext();

const StudentsContextProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const savedStudents = JSON.parse(localStorage.getItem("students"));
    console.log("Loaded Students on Initialization:", savedStudents);
    return savedStudents || [];
  });

  const [error, setError] = useState([]);

  // Öğrencileri localStorage'a kaydet
  useEffect(() => {
    console.log("Saving Students to localStorage:", students);
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const [coursesProcessed, setCoursesProcessed] = useState(false); // Kursların işlendiğini takip eden durum

  useEffect(() => {
    // Eğer kurslar işlenmediyse ve öğrenciler yüklendiyse çalıştır
    if (!coursesProcessed && students.length > 0) {
      addCoursesToStudents();
      setCoursesProcessed(true); // Kursların işlendiğini işaretle
    }
  }, [students, coursesProcessed]); // coursesProcessed kontrolü ile tekrar çalışmasını engelle

  // Yeni öğrenci ekleme fonksiyonu
  const addStudent = (newStudent) => {
    setStudents((prevStudents) => {
      const existingNames = new Set(
        prevStudents.map((s) => s.name.toLowerCase())
      );

      if (!existingNames.has(newStudent.name.toLowerCase())) {
        const updatedStudents = [
          ...prevStudents,
          {
            id: uuidv4(), // Benzersiz UUID
            name: newStudent.name.trim(),
            weeklySchedule: Array.from({ length: 16 }, () =>
              Array(5).fill(null)
            ),
          },
        ];

        return updatedStudents;
      }

      return prevStudents;
    });
  };

  // Öğrenci güncelleme fonksiyonu
  const updateStudent = (updatedStudent) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  // Öğrenci silme fonksiyonu
  const deleteStudent = (id) => {
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    );
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

  const addCoursesToStudents = () => {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    console.log("Courses Loaded:", courses);

    if (!courses.length) {
      console.warn("No courses found in localStorage.");
      return;
    }

    // Zaman dilimlerini oluştur ve normalize et
    const generateTimeSlots = () => {
      const slots = [];
      let hour = 8;
      let minute = 30;

      for (let i = 0; i < 16; i++) {
        const start = `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;
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
    };

    const normalizeTimeFormat = (time) => {
      const [hour, minute] = time.split(":").map((t) => parseInt(t, 10));
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
    };

    const timeSlots = generateTimeSlots().map(normalizeTimeFormat);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const courseMap = new Map();
    const conflictList = []; // Çakışmaları toplamak için liste
    const successList = []; // Başarıyla eklenen dersleri tutmak için liste

    // Öğrenci adlarına göre kursları eşleştir
    courses.forEach((course) => {
      course.students.forEach((student) => {
        const studentName = student.trim().toLowerCase();
        if (!courseMap.has(studentName)) {
          courseMap.set(studentName, []);
        }
        courseMap.get(studentName).push(course);
      });
    });

    const updatedStudents = students.map((student) => {
      const studentName = student.name.trim().toLowerCase();
      const relevantCourses = courseMap.get(studentName) || [];
      if (!relevantCourses.length) return student;

      const updatedSchedule = student.weeklySchedule.map((row) => [...row]);

      relevantCourses.forEach((course) => {
        const dayIndex = days.indexOf(course.day);
        if (dayIndex === -1) {
          console.warn(`Invalid day for course: ${course.courseName}`);
          return;
        }

        const normalizedCourseHour = normalizeTimeFormat(course.hour.trim());
        const startSlot = timeSlots.indexOf(normalizedCourseHour);
        if (startSlot === -1) {
          console.warn(
            `Invalid hour for course: ${course.courseName}, hour: ${course.hour}`
          );
          return;
        }

        const duration = parseInt(course.duration, 10);
        const endSlot = startSlot + duration;

        // Kursun zaten programa eklenmiş olup olmadığını kontrol et
        const isAlreadyAdded = updatedSchedule.some((row) =>
          row.some((slot) => slot === course.courseName)
        );
        if (isAlreadyAdded) {
          console.log(`Skipping already added course: ${course.courseName}`);
          return;
        }

        const hasConflict = updatedSchedule
          .slice(startSlot, endSlot)
          .some((slot) => slot[dayIndex] !== null);

        if (hasConflict) {
          conflictList.push(
            `Conflict: ${student.name} - ${course.courseName} on ${course.day} at ${course.hour}`
          );
        } else {
          for (let i = startSlot; i < endSlot; i++) {
            updatedSchedule[i][dayIndex] = course.courseName;
          }
          successList.push(
            `Added: ${student.name} - ${course.courseName} on ${course.day} at ${course.hour}`
          );
        }
      });

      return { ...student, weeklySchedule: updatedSchedule };
    });

    if (conflictList.length > 0) {
      console.warn(
        `Conflicts detected (${conflictList.length}):\n`,
        conflictList.join("\n")
      );
    }

    if (successList.length > 0) {
      console.log(
        `Successfully added (${successList.length}):\n`,
        successList.join("\n")
      );
    }

    setStudents(updatedStudents);
  };

  // CSV'den gelen veriyi işleme
  useEffect(() => {
    const handleCsvData = (event, data) => {
      console.log("Received data:", data);
      try {
        if (data && Array.isArray(data)) {
          const uniqueCsvStudents = Array.from(
            new Set(
              data
                .filter((course) => course?.students?.length > 0)
                .flatMap((course) =>
                  course.students.map((s) => s.trim().toLowerCase())
                )
            )
          );

          setStudents((prevStudents) => {
            const existingNames = new Set(
              prevStudents.map((s) => s.name.toLowerCase())
            );

            const newStudents = uniqueCsvStudents
              .filter((name) => !existingNames.has(name))
              .map((name) => ({
                id: uuidv4(),
                name: name.charAt(0).toUpperCase() + name.slice(1),
                weeklySchedule: Array.from({ length: 16 }, () =>
                  Array(5).fill(null)
                ),
              }));

            const updatedStudents = [...prevStudents, ...newStudents];
            console.log(
              "Updated Students After CSV Processing:",
              updatedStudents
            );
            return updatedStudents;
          });
        }
      } catch (err) {
        console.error("Error processing CSV data:", err);
        setError((prevError) => [
          ...prevError,
          "Error processing student data from CSV.",
        ]);
      }
    };

    window.electronAPI?.on("courses-data", handleCsvData);

    return () => {
      window.electronAPI?.off("courses-data", handleCsvData);
    };
  }, []);

  return (
    <StudentsContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        addCoursesToStudents,
      }}
    >
      {children}
      {error.length > 0 && (
        <div style={{ color: "red", textAlign: "center" }}>
          {error.map((err, index) => (
            <p key={index}>{err}</p>
          ))}
        </div>
      )}
    </StudentsContext.Provider>
  );
};

export default StudentsContextProvider;
