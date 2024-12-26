Campus Dashboard 

Overview 

Campus Dashboard is a comprehensive management application for educational institutions. It facilitates efficient management of students, teachers, classrooms, and courses, providing essential tools for scheduling and resource organization. 

                       

Features 

- Dashboard Overview: Quick insights into total students, teachers, classrooms, and courses. Interactive cards for exploring detailed information. 

- Student Management: Add, update, and delete student records. View and edit weekly schedules. 

                             

                                    

                           

 

- Teacher Management: Maintain and manage the list of teaching staff. Assign courses to teachers. 

                              

 

                                   

- Classroom Management: Add, update, and delete classrooms. Check classroom availability and schedules. 

                  

                                                           

- Course Management: Create, update, and delete courses. Automatically assign classrooms based on capacity and availability. Detect and handle scheduling conflicts.       

                

 

- Attendance Tracking: Track student attendance for specific courses. 

Technologies Used 

Frontend Framework: React.js 
State Management: Context API 
Backend Integration: Electron APIs 
Storage: LocalStorage 
Styling: CSS Modules 
Libraries: UUID for unique student IDs, CSV support for data import/export 

Setup 

Clone the repository: 
   git clone https://github.com/your-repo-url.git 
   cd campus-dashboard 

Install dependencies: 
   npm install 

Start the application: 
   npm start 

To build the application for production: 
   npm run build 

Usage 

- Dashboard Tab: View an overview of total resources. 

- Students Tab: Add and manage student records. Edit weekly schedules. 

- Teachers Tab: Add and manage teacher records. 

- Classrooms Tab: Manage classroom details and schedules. 

- Courses Tab: Add, assign, and organize courses. 

- Attendance Tab: Mark and track student attendance. 

Application Architecture 

Contexts: 

- CoursesContext: Manage course data including addition, updates, and auto-assignment. Handle scheduling conflicts and persist data in LocalStorage. 

- ClassroomContext: Manage classroom data and weekly schedules. Integrate with Electron APIs for data updates. 

- StudentsContext: Add, update, and delete students. Manage student weekly schedules and handle course additions. 

- TeachersContext: Maintain a list of teaching staff and manage course assignments. 

Key Components: 

- Dashboard.jsx: Interactive dashboard overview. 

- Students.jsx: Student management panel with schedule editing. 

- Teachers.jsx: Teacher management interface. 

- Classrooms.jsx: Classroom management and schedule visualization. 

- Courses.jsx: Course creation and auto-assignment system. 

- Attendance.jsx: Attendance tracking tool. 

- Sidebar.jsx: Navigation bar for tab switching. 

Key Features 

- Automated Scheduling: Intelligent assignment of courses to classrooms based on capacity and availability. 

- Conflict Detection: Real-time alerts for scheduling conflicts. 

- Data Management: Import/export data using CSV files for seamless updates. 

Contribution 

Contributions are welcome! Please follow the steps below: 
1. Fork the repository. 
2. Create a feature branch: 
   git checkout -b feature-name 
3. Commit your changes: 
   git commit -m "Add new feature" 
4. Push to the branch: 
   git push origin feature-name 
5. Create a pull request. 

License 

This project is licensed under the MIT License. 

Developers 

- Selen ÖZNUR - [GitHub](https://github.com/selenoznur) (20220602062) 

- Özcan Burak ŞANLILAR - [GitHub](https://github.com/buraksanlilar) (20210602058) 

- Kadir AY - [GitHub](https://github.com/sucreistaken) (20210602006) 

- Orkun Efe ÖZDEMİR (20220602061) 
