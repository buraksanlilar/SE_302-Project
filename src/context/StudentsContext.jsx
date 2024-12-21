import React, { createContext, useState, useEffect } from "react";

// Context oluştur
export const StudentsContext = createContext();

const StudentsContextProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    const savedStudents = JSON.parse(localStorage.getItem("students"));
    return savedStudents || [];
  });

  const [error, setError] = useState(null);

  // Öğrencileri localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

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
            id: Date.now(),
            name: newStudent.name.trim(),
            weeklySchedule: Array.from({ length: 16 }, () => Array(5).fill(null)),
          },
        ];
        localStorage.setItem("students", JSON.stringify(updatedStudents));
        return updatedStudents;
      }
      return prevStudents; // Duplicate kontrolü
    });
  };

  // Öğrenci silme fonksiyonu
  const deleteStudent = (id) => {
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
  };

  // CSV'den gelen veriyi işleme
  useEffect(() => {
    const handleCsvData = (event, data) => {
      console.log("Received data:", data); // Gelen veriyi kontrol et
      try {
        if (data && Array.isArray(data)) {
          const uniqueCsvStudents = Array.from(
            new Set(
              data
                .filter((course) => course?.students?.length > 0)
                .flatMap((course) => course.students.map((s) => s.trim().toLowerCase()))
            )
          );

          setStudents((prevStudents) => {
            const existingNames = new Set(
              prevStudents.map((s) => s.name.toLowerCase())
            );

            const newStudents = uniqueCsvStudents
              .filter((name) => !existingNames.has(name))
              .map((name) => ({
                id: Date.now() + Math.random(),
                name: name.charAt(0).toUpperCase() + name.slice(1),
                weeklySchedule: Array.from({ length: 16 }, () => Array(5).fill(null)),
              }));

            const updatedStudents = [...prevStudents, ...newStudents];
            localStorage.setItem("students", JSON.stringify(updatedStudents));
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
    <StudentsContext.Provider value={{ students, addStudent, deleteStudent }}>
      {children}
      {error && (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      )}
    </StudentsContext.Provider>
  );
};

export default StudentsContextProvider;
