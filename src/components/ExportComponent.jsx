import { saveAs } from "file-saver"; // File-Saver kitaplığı

function exportToCSV(data, filename, delimiter = ";") {
  const keys = Object.keys(data[0]);
  const csvContent =
    keys.join(delimiter) +
    "\n" +
    data
      .map((row) =>
        keys
          .map((key) => {
            if (Array.isArray(row[key])) {
              // Join arrays (e.g., students) into a single string
              return `"${row[key].join(",")}"`;
            }
            return typeof row[key] === "string" ? `"${row[key]}"` : row[key];
          })
          .join(delimiter)
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}

function ExportComponent() {
  const handleExport = () => {
    // Courses
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    if (courses.length) {
      exportToCSV(
        courses.map((course) => ({
          Course: course.courseName,
          TimeToStart: course.day + " " + course.hour,
          DurationInLectureHours: course.duration,
          Lecturer: course.teacherName,
          Students: course.students.join(","),
        })),
        "CoursesExport.csv",
        ";"
      );
    }

    // Classrooms
    const classrooms = JSON.parse(localStorage.getItem("classrooms")) || [];
    if (classrooms.length) {
      exportToCSV(
        classrooms.map((classroom) => ({
          Classroom: classroom.name,
          Capacity: classroom.capacity,
        })),
        "ClassroomsExport.csv",
        ";"
      );
    }

    alert("Export işlemi tamamlandı!");
  };

  return (
    <div>
      <button onClick={handleExport}>Export Courses & Classrooms to CSV</button>
    </div>
  );
}

export default ExportComponent;
