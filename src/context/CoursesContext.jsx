import React, { createContext, useState, useEffect } from "react";

export const CoursesContext = createContext();

const CoursesProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    const savedCourses = JSON.parse(localStorage.getItem("courses"));
    return savedCourses || [];
  });

  useEffect(() => {
    window.electronAPI?.onCsvData((data) => {
      const newCourses = data.map((course, index) => {
        // Sütun anahtarlarını normalize ederek küçük harf yap
        const normalizedCourse = Object.keys(course).reduce((acc, key) => {
          acc[key.toLowerCase()] = course[key];
          return acc;
        }, {});

        // TimeToStart ve DurationInLectureHours ayrıştırma
        const timeMatch =
          normalizedCourse["timetostart"] &&
          normalizedCourse["timetostart"].match(/(\w+)\s+(\d{1,2}:\d{2})/);

        const day = timeMatch ? timeMatch[1] : "N/A";
        const hour = timeMatch ? timeMatch[2] : "N/A";

        return {
          id: Date.now() + index,
          courseName: normalizedCourse["course"] || "Unnamed Course",
          teacherName: normalizedCourse["lecturer"] || "Unknown Lecturer",
          day: day,
          hour: hour,
          duration: normalizedCourse["durationinlecturehours"]?.trim() || "N/A",
          students: normalizedCourse["students"]
            ? normalizedCourse["students"].split(",").map((s) => s.trim())
            : [],
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
    });
  }, []);

  return (
    <CoursesContext.Provider value={{ courses }}>
      {children}
    </CoursesContext.Provider>
  );
};

export default CoursesProvider;
