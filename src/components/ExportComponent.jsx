import { saveAs } from "file-saver"; // File-Saver kitaplığı

function exportToCSV(data, filename) {
  const keys = Object.keys(data[0]);
  const csvContent =
    keys.join(",") +
    "\n" +
    data
      .map((row) =>
        keys
          .map((key) =>
            typeof row[key] === "string" ? `"${row[key]}"` : row[key]
          )
          .join(",")
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
      exportToCSV(courses, "CoursesExport.csv");
    }

    // Classrooms
    const classrooms = JSON.parse(localStorage.getItem("classrooms")) || [];
    if (classrooms.length) {
      exportToCSV(classrooms, "ClassroomsExport.csv");
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
