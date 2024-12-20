import React, { createContext, useState, useEffect } from "react";

// Context oluştur
export const TeachersContext = createContext();

const TeachersContextProvider = ({ children }) => {
  const [teachers, setTeachers] = useState(() => {
    const savedTeachers = JSON.parse(localStorage.getItem("teachers"));
    return savedTeachers || [];
  });

  const [error, setError] = useState(null);

  // Öğretmenleri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  // Öğretmen ekleme fonksiyonu (manuel ekleme)
  const addTeacher = (newTeacher) => {
    setTeachers((prevTeachers) => {
      const existingNames = new Set(
        prevTeachers.map((t) => t.name.toLowerCase())
      );
      if (!existingNames.has(newTeacher.name.toLowerCase())) {
        return [
          ...prevTeachers,
          { id: Date.now(), name: newTeacher.name.trim() },
        ];
      }
      return prevTeachers; // Duplicate kontrolü
    });
  };

  // Öğretmen silme fonksiyonu
  const deleteTeacher = (id) => {
    setTeachers((prevTeachers) =>
      prevTeachers.filter((teacher) => teacher.id !== id)
    );
  };

  useEffect(() => {
    const handleCsvData = (event, data) => {
      console.log("Received data:", data); // Gelen veriyi kontrol et
      try {
        if (data && Array.isArray(data)) {
          const uniqueCsvTeachers = Array.from(
            new Set(
              data
                .filter((course) => course?.lecturer?.trim()) // Null check eklendi
                .map((course) => course.lecturer.trim().toLowerCase())
            )
          );

          setTeachers((prevTeachers) => {
            const existingNames = new Set(
              prevTeachers.map((t) => t.name.toLowerCase())
            );

            const newTeachers = uniqueCsvTeachers
              .filter((name) => !existingNames.has(name))
              .map((name) => ({
                id: Date.now() + Math.random(),
                name: name.charAt(0).toUpperCase() + name.slice(1),
              }));

            return [...prevTeachers, ...newTeachers];
          });
        }
      } catch (err) {
        console.error("Error processing CSV data:", err);
        setError("Öğretmen verileri yüklenirken hata oluştu.");
      }
    };

    window.electronAPI?.on("courses-data", handleCsvData);

    return () => {
      window.electronAPI?.off("courses-data", handleCsvData);
    };
  }, []);

  return (
    <TeachersContext.Provider value={{ teachers, addTeacher, deleteTeacher }}>
      {children}
      {error && (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      )}
    </TeachersContext.Provider>
  );
};

export default TeachersContextProvider;
