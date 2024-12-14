import React, { createContext, useState } from "react";

export const ClassroomContext = createContext();

export const ClassroomProvider = ({ children }) => {
  const [classrooms, setClassrooms] = useState(() => {
    const savedClassrooms = localStorage.getItem("classrooms");
    return savedClassrooms ? JSON.parse(savedClassrooms) : [];
  });

  const addClassroom = (newClassroom) => {
    const updatedClassrooms = [...classrooms, newClassroom];
    setClassrooms(updatedClassrooms);
    localStorage.setItem("classrooms", JSON.stringify(updatedClassrooms));
  };

  const deleteClassroom = (id) => {
    const updatedClassrooms = classrooms.filter((classroom) => classroom.id !== id);
    setClassrooms(updatedClassrooms);
    localStorage.setItem("classrooms", JSON.stringify(updatedClassrooms));
  };

  return (
    <ClassroomContext.Provider value={{ classrooms, addClassroom, deleteClassroom }}>
      {children}
    </ClassroomContext.Provider>
  );
};
