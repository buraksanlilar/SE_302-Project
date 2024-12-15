import React, { createContext, useState, useEffect } from "react";

// Context oluştur
export const TeachersContext = createContext();

const TeachersContextProvider = ({ children }) => {
  const [teachers, setTeachers] = useState([]);

  // Local storage'dan öğretmenleri yükle
  useEffect(() => {
    const savedTeachers = JSON.parse(localStorage.getItem("teachers"));
    if (savedTeachers) {
      setTeachers(savedTeachers);
    }
  }, []);

  // Öğretmenleri local storage'a kaydet
  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  // Öğretmen ekleme fonksiyonu
  const addTeacher = (newTeacher) => {
    setTeachers((prevTeachers) => [...prevTeachers, newTeacher]);
  };

  // Öğretmen silme fonksiyonu
  const deleteTeacher = (id) => {
    setTeachers((prevTeachers) =>
      prevTeachers.filter((teacher) => teacher.id !== id)
    );
  };

  return (
    <TeachersContext.Provider value={{ teachers, addTeacher, deleteTeacher }}>
      {children}
    </TeachersContext.Provider>
  );
};

export default TeachersContextProvider;
