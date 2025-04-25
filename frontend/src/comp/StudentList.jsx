
 function StudentList({ students }) {

    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Student List</h2>
        <div>
          {students?.map((student,index) => (
            <div
              key={student.id || `student-${index}`}
              className="flex justify-between items-center border p-2 mb-2 rounded cursor-pointer"
            >
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-600">{student.email}</p>
                <p className="text-sm text-gray-600">{student.name}</p>
                <p className="text-sm text-gray-600">{student.phone}</p>
                <p className="text-sm text-gray-600">{student.parent_phone}</p>
              </div>
              {/* <button
                onClick={() => onDelete(student.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button> */}
            </div>
          ))}
        </div>
      </div>
    );
  }
  export default StudentList;