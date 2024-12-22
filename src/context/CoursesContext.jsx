import React, { createContext, useState, useEffect } from "react";

export const CoursesContext = createContext();

const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    const savedCourses = JSON.parse(localStorage.getItem("courses"));
    return savedCourses || [];
  });

  useEffect(() => {
    // Electron'dan gelen kurs verilerini işleme
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
          students: Array.isArray(normalizedCourse["students"])
            ? normalizedCourse["students"]
            : normalizedCourse["students"]?.split(",").map((s) => s.trim()) ||
              [],
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
    console.log("Adding new course:", newCourse); // Debugging için
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses, newCourse];
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      return updatedCourses;
    });
  };

  // Kurs silme fonksiyonu
  const deleteCourse = (id) => {
    console.log("Deleting course with ID:", id); // Debugging için
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.filter((course) => course.id !== id);
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      return updatedCourses;
    });
  };

  // Kurs güncelleme fonksiyonu
  const updateCourse = (updatedCourses) => {
    try {
      console.log("Updating Courses with:", updatedCourses);

      const coursesCopy = [...updatedCourses]; // Yeni referans oluştur

      setCourses(coursesCopy); // React state'i güncelle

      localStorage.setItem("courses", JSON.stringify(coursesCopy)); // Yerel depolamayı güncelle

      console.log("Courses Successfully Updated:", coursesCopy);
    } catch (error) {
      console.error("Error updating courses:", error);
    }
  };

  return (
    <CoursesContext.Provider
      value={{ courses, addCourse, deleteCourse, updateCourse }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
