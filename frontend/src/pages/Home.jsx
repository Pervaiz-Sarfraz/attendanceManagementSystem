// import { getStudent } from "../apihandle/api";
import StudentForm from "../comp/StudentForm";
import StudentList from "../comp/StudentList";
import { useState ,useEffect} from "react";

export default function Home() {
  const [students, setStudents] = useState([]);
  const handleAdd = (student) => {
    setStudents([...students, { ...student, id: Date.now() }]);
  };

//   const handleDelete = async(id) => {
//     try {
//         await deleteStudent(id);
//         setStudents((prev) => prev.filter((job) => job.job_id !== id));
//       } catch (err) {
//         console.error("Error deleting job", err);
//       }
// };
  useEffect(() => {
    // getStudent()
    //   .then((res) => setStudents(res))
    //   .catch((err) => console.error(err));
  }, []);
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Student Management</h1>
      <StudentForm onAdd={handleAdd} />
      <StudentList students={students}/>
    </div>
  );
}
