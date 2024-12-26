import React, { createContext, useState, useEffect, useContext } from "react";
import { CoursesContext } from "./CoursesContext";

export const ClassroomContext = createContext();

export const ClassroomProvider = ({ children }) => {
  const [classrooms, setClassrooms] = useState(() => {
    const savedClassrooms = localStorage.getItem("classrooms");
    return savedClassrooms ? JSON.parse(savedClassrooms) : [];
  });

  const { courses, setCourses } = useContext(CoursesContext);

  useEffect(() => {
    const handleClassroomData = (event, data) => {
      const formattedData = data.map((classroom) => ({
        id: Date.now() + Math.random(), // Benzersiz ID oluştur
        name: classroom.classroom || classroom.name || "Unnamed Classroom",
        capacity: classroom.capacity || "Unknown Capacity",
      }));

      setClassrooms(formattedData);
      localStorage.setItem("classrooms", JSON.stringify(formattedData));
    };

    // Electron API ile veri işleme
    window.electronAPI?.on("classroom-data", handleClassroomData);

    return () => {
      window.electronAPI?.off("classroom-data", handleClassroomData);
    };
  }, []);

  const addClassroom = (newClassroom) => {
    const updatedClassrooms = [...classrooms, newClassroom];
    setClassrooms(updatedClassrooms);
    localStorage.setItem("classrooms", JSON.stringify(updatedClassrooms));
  };

  const deleteClassroom = (id) => {
    const classroomToDelete = classrooms.find(
      (classroom) => classroom.id === id
    );

    if (!classroomToDelete) {
      console.warn("Classroom not found for deletion.");
      return;
    }

    // Classroom'u classrooms listesinden çıkar
    const updatedClassrooms = classrooms.filter(
      (classroom) => classroom.id !== id
    );

    // Classroom'a ait schedule'ı localStorage'dan sil
    localStorage.removeItem(`schedule_${classroomToDelete.name}`);

    // CoursesContext'e erişip kursları güncelle
    if (setCourses) {
      setCourses((prevCourses) => {
        const updatedCourses = prevCourses.map((course) =>
          course.classroom === classroomToDelete.name
            ? { ...course, classroom: "Unknown Classroom" }
            : course
        );
        localStorage.setItem("courses", JSON.stringify(updatedCourses));
        return updatedCourses;
      });
    } else {
      console.warn(
        "CoursesContext is not properly provided. Ensure ClassroomProvider is wrapped inside CoursesProvider."
      );
    }

    // State ve localStorage'ı güncelle
    setClassrooms(updatedClassrooms);
    localStorage.setItem("classrooms", JSON.stringify(updatedClassrooms));

    console.log(
      `Classroom "${classroomToDelete.name}" and its schedule have been deleted. Courses have been updated.`
    );
  };

  return (
    <ClassroomContext.Provider
      value={{ classrooms, addClassroom, deleteClassroom }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};
