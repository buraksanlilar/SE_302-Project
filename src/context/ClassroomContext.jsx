import React, { createContext, useState, useEffect } from "react";

export const ClassroomContext = createContext();

export const ClassroomProvider = ({ children }) => {
  const [classrooms, setClassrooms] = useState(() => {
    const savedClassrooms = localStorage.getItem("classrooms");
    return savedClassrooms ? JSON.parse(savedClassrooms) : [];
  });

  useEffect(() => {
    const handleClassroomData = (event, data) => {
      const formattedData = data.map((classroom) => ({
        id: Date.now() + Math.random(), // Ensure unique ID
        name: classroom.classroom || classroom.name || "Unnamed Classroom",
        capacity: classroom.capacity || "Unknown Capacity",
      }));
      setClassrooms(formattedData);
      localStorage.setItem("classrooms", JSON.stringify(formattedData));
    };

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
    const updatedClassrooms = classrooms.filter(
      (classroom) => classroom.id !== id
    );
    setClassrooms(updatedClassrooms);
    localStorage.setItem("classrooms", JSON.stringify(updatedClassrooms));
  };

  return (
    <ClassroomContext.Provider
      value={{ classrooms, addClassroom, deleteClassroom }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};
