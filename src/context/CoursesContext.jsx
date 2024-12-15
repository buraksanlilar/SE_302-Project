import React, { createContext, useState, useEffect } from "react";

export const CoursesContext = createContext();

const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    const savedCourses = JSON.parse(localStorage.getItem("courses"));
    return savedCourses || [];
  });

  // Yeni kurs ekleme
  const addCourse = (newCourse) => {
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
  };

  // Kurs silme
  const deleteCourse = (id) => {
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
  };

  // Electron'dan CSV verisi dinleme
  useEffect(() => {
    window.electronAPI?.onCsvData((data) => {
      const newCourses = data.map((course, index) => ({
        id: Date.now() + index,
        courseName: course.Course,
        teacherName: course.Lecturer,
      }));

      // Mevcut verilerle birleştirme, yinelenenleri engelleme
      const combinedCourses = [...courses];
      newCourses.forEach((newCourse) => {
        const exists = combinedCourses.some(
          (course) =>
            course.courseName === newCourse.courseName &&
            course.teacherName === newCourse.teacherName
        );
        if (!exists) {
          combinedCourses.push(newCourse);
        }
      });

      setCourses(combinedCourses);
      localStorage.setItem("courses", JSON.stringify(combinedCourses));
    });
  }, [courses]);

  return (
    <CoursesContext.Provider value={{ courses, addCourse, deleteCourse }}>
      {children}
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
