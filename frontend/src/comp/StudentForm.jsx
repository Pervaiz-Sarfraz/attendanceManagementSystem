import { useState } from "react";
// import { createStudent } from "../apihandle/api";
// import toast from "react-hot-toast";

export default function StudentForm() {
  const semesterOptions = [
    { label: 'first', value: 1 },
    { label: 'second', value: 2 },
    { label: 'third', value: 3 },
    { label: 'fourth', value: 4 },
    { label: 'fifth', value: 5 },
    { label: 'sixth', value: 6 }
  ];

  const [student, setStudent] = useState({
    name: "",
    email: "",
    semester: 1, 
    phone: "",
    parentPhone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: name === "semester" ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!student.name || !student.email) {
    //   toast.error("Name and email are required");
    //   return;
    // }

    // try {
    //   const response = await createStudent(student);

    //   if (response) {
    //     toast.success("Student added successfully!");
    //     onAdd(student);
    //     setStudent({
    //       name: "",
    //       email: "",
    //       semester: 1,
    //       phone: "",
    //       parentPhone: "",
    //     });
    //   }
    // } catch (error) {
    //   toast.error(error.message || "Failed to add student");
    // }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          className="border p-2 flex-1 min-w-[200px]"
          value={student.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 flex-1 min-w-[200px]"
          value={student.email}
          onChange={handleChange}
          required
        />
        <select
          name="semester"
          className="border p-2 flex-1 min-w-[200px]"
          value={student.semester}
          onChange={handleChange}
        >
          {semesterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className="border p-2 flex-1 min-w-[200px]"
          value={student.phone}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="parentPhone"
          placeholder="Parent Phone"
          className="border p-2 flex-1 min-w-[200px]"
          value={student.parentPhone}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Student
        </button>
      </div>
    </form>
  );
}
