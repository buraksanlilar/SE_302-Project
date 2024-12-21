import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // UUID import

export const StudentsContext = createContext();

const StudentsContextProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const savedStudents = JSON.parse(localStorage.getItem("students"));
    console.log("Loaded Students on Initialization:", savedStudents);
    return savedStudents || [];
  });

  const [error, setError] = useState(null);
  useEffect(() => {
    if (
      students.length > 0 &&
      JSON.parse(localStorage.getItem("courses"))?.length > 0
    ) {
      addCoursesToStudents();
    }
  }, [students]); // students değişince tetiklenir

  useEffect(() => {
    console.log("Saving Students to localStorage:", students);
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const addCoursesToStudents = () => {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    console.log("Courses Loaded:", courses);

    if (!courses.length) {
      console.warn("No courses found in localStorage.");
      return;
    }

    if (!students.length) {
      console.warn("Students array is empty before adding courses.");
      return;
    }

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const courseMap = new Map();

    // Kursları map yapısına dönüştür
    courses.forEach((course) => {
      course.students.forEach((student) => {
        const studentName = student.trim().toLowerCase();
        if (!courseMap.has(studentName)) {
          courseMap.set(studentName, []);
        }
        courseMap.get(studentName).push(course);
      });
    });

    console.log("Course Map:", courseMap);

    // Öğrencileri güncelle
    const updatedStudents = students.map((student) => {
      const studentName = student.name.trim().toLowerCase();
      const relevantCourses = courseMap.get(studentName) || [];
      console.log(`Relevant Courses for ${student.name}:`, relevantCourses);

      if (!relevantCourses.length) return student;

      const updatedSchedule = student.weeklySchedule.map((row) => [...row]);

      relevantCourses.forEach((course) => {
        const dayIndex = days.indexOf(course.day);
        if (dayIndex === -1) {
          console.warn(`Invalid day for course: ${course.courseName}`);
          return;
        }

        const timeSlots = generateTimeSlots();
        const startSlot = timeSlots.indexOf(course.hour.trim());
        if (startSlot === -1) {
          console.warn(`Invalid hour for course: ${course.courseName}`);
          return;
        }

        const duration = parseInt(course.duration, 10);
        const endSlot = startSlot + duration;

        const hasConflict = updatedSchedule
          .slice(startSlot, endSlot)
          .some((slot) => slot[dayIndex] !== null);

        if (!hasConflict) {
          for (let i = startSlot; i < endSlot; i++) {
            updatedSchedule[i][dayIndex] = course.courseName;
          }
        } else {
          console.warn(
            `Conflict detected for ${student.name} in course ${course.courseName}`
          );
        }
      });

      return { ...student, weeklySchedule: updatedSchedule };
    });

    console.log("Updated Students After Adding Courses:", updatedStudents);

  // Yeni öğrenci ekleme fonksiyonu
 

 

  const addStudent = (newStudent) => {
    setStudents((prevStudents) => {
      const existingNames = new Set(prevStudents.map((s) => s.name.toLowerCase()));
  
      if (!existingNames.has(newStudent.name.toLowerCase())) {
        const updatedStudents = [
          ...prevStudents,
          {
            id: uuidv4(), // Benzersiz UUID
            name: newStudent.name.trim(),
            weeklySchedule: Array.from({ length: 16 }, () => Array(5).fill(null)),
          },
        ];
  
        localStorage.setItem("students", JSON.stringify(updatedStudents));
        return updatedStudents;
      }
  
      return prevStudents;
    });
  };
  
  

  // Öğrenci silme fonksiyonu
  const deleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
  };

  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8;
    let minute = 30;

    for (let i = 0; i < 16; i++) {
      const start = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      slots.push(start);
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

          console.log("Unique Students from CSV:", uniqueCsvStudents);
    
          setStudents((prevStudents) => {
            const existingNames = new Set(
              prevStudents.map((s) => s.name.toLowerCase())
            );
    
            const newStudents = uniqueCsvStudents
              .filter((name) => !existingNames.has(name))
              .map((name) => ({
                id: uuidv4(), // Benzersiz UUID
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
        setError("Öğrenci verileri yüklenirken hata oluştu.");
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
        addCoursesToStudents,
      }}
    >
      {children}
      {error && (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      )}
    </StudentsContext.Provider>
  );
};

export default StudentsContextProvider;
