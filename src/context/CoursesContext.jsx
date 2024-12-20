import React, { createContext, useState, useEffect } from "react";

export const CoursesContext = createContext();

const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    const savedCourses = JSON.parse(localStorage.getItem("courses"));
    return savedCourses || [];
  });

  useEffect(() => {
    const handleCoursesData = (event, data) => {
      const newCourses = data.map((course, index) => {
        const normalizedCourse = Object.keys(course).reduce((acc, key) => {
          acc[key.toLowerCase()] = course[key];
          return acc;
        }, {});
  
        const timeMatch =
          normalizedCourse["timetostart"] &&
          normalizedCourse["timetostart"]
            .trim()
            .match(/(\w+)\s+(\d{1,2}:\d{2})/);
  
        const day = timeMatch ? timeMatch[1] : "N/A";
        const hour = timeMatch ? timeMatch[2] : "N/A";
  
        return {
          id: Date.now() + index,
          courseName: normalizedCourse["course"] || "Unnamed Course",
          teacherName: normalizedCourse["lecturer"] || "Unknown Lecturer",
          day: day,
          hour: hour,
          duration: normalizedCourse["durationinlecturehours"]?.trim() || "N/A",
          classroom: normalizedCourse["classroom"] || "Unknown Classroom",
          courseCode: normalizedCourse["coursecode"] || "N/A",
          students: normalizedCourse["students"] || [], // Artık gelen öğrenciler dizisi
        };
      });
  
      setCourses((prevCourses) => {
        const combinedCourses = [...prevCourses];
  
        newCourses.forEach((newCourse) => {
          const exists = combinedCourses.some(
            (course) =>
              course.courseName === newCourse.courseName &&
              course.teacherName === newCourse.teacherName &&
              course.day === newCourse.day &&
              course.hour === newCourse.hour
          );
  
          if (!exists) combinedCourses.push(newCourse);
        });
  
        localStorage.setItem("courses", JSON.stringify(combinedCourses));
        return combinedCourses;
      });
    };
  
    window.electronAPI?.on("courses-data", handleCoursesData);
  
    return () => {
      window.electronAPI?.off("courses-data", handleCoursesData);
    };
  }, []);
  

  // Yeni kurs ekleme fonksiyonu
  const addCourse = (newCourse) => {
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses, newCourse];
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      return updatedCourses;
    });
  };

  // Kurs silme fonksiyonu
  const deleteCourse = (id) => {
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.filter((course) => course.id !== id);
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      return updatedCourses;
    });
  };

  return (
    <CoursesContext.Provider value={{ courses, addCourse, deleteCourse }}>
      {children}
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
