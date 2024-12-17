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
      const newCourses = data.map((course, index) => {
        // TimeToStart kolonundaki veriyi parçalama (örnek: "Monday 8:30")
        const timeMatch = course.TimeToStart?.match(/(\w+)\s+(\d{1,2}:\d{2})/);
        const day = timeMatch ? timeMatch[1] : ""; // Gün kısmı
        const hour = timeMatch ? timeMatch[2] : ""; // Saat kısmı
 
        return {
          id: Date.now() + index,
          courseName: course.Course || "Unnamed Course", // Kurs adı
          teacherName: course.Lecturer || "Unknown Lecturer", // Öğretmen adı
          day: day, // Parçalanan gün
          hour: hour, // Parçalanan saat
          duration: course.DurationInLectureHours || "1", // Duration değeri (default: 1)
          students: course.Students
            ? course.Students.split(",").map((s) => s.trim())
            : [], // Virgülle ayrılan öğrenci isimlerini diziye çevir
        };
      });
 
      // Mevcut verilerle birleştirme, yinelenenleri engelleme
      const combinedCourses = [...courses];
      newCourses.forEach((newCourse) => {
        const exists = combinedCourses.some(
          (course) =>
            course.courseName === newCourse.courseName &&
            course.teacherName === newCourse.teacherName &&
            course.day === newCourse.day &&
            course.hour === newCourse.hour
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

const autoAssignClassrooms = (classrooms) => {
  const updatedCourses = courses.map((course) => {
    let assigned = false;

    // Sınıfları gez ve uygun sınıfı bul
    for (const classroom of classrooms) {
      if (classroom.capacity >= course.capacity && !classroom.isOccupied) {
        course.classroom = classroom.name;
        classroom.isOccupied = true; // Sınıfı işaretle
        assigned = true;
        break;
      }
    }

    // Eğer uygun sınıf bulunamazsa uyarı ekle
    if (!assigned) {
      course.classroom = "No Available Classroom";
    }

    return course;
  });

  setCourses(updatedCourses);
  localStorage.setItem("courses", JSON.stringify(updatedCourses));
};

 
export default CoursesProvider;
 
 