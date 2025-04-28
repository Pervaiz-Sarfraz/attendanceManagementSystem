import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutTeacher } from '../apihandle/teacherapi';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [newStudent, setNewStudent] = useState({
    name: '',
    roll_number: '',
    email: '',
    class_enrolled: ''
  });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
   const navigate = useNavigate();
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const mockClasses = [
          { id: 1, name: 'Mathematics 101', code: 'MATH101' },
          { id: 2, name: 'Physics 201', code: 'PHY201' },
        ];
        setClasses(mockClasses);
        if (mockClasses.length > 0) {
          setSelectedClass(mockClasses[0].id);
        }
      } catch (error) {
        console.log(error);
        
        toast.error('Failed to fetch classes');
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const fetchStudents = async () => {
        try {
          const mockStudents = [
            { id: 1, name: 'John Doe', roll_number: 'S001', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', roll_number: 'S002', email: 'jane@example.com' },
          ];
          setStudents(mockStudents);
          const initialAttendance = {};
          mockStudents.forEach(student => {
            initialAttendance[student.id] = 'present'; 
          });
          setAttendance(initialAttendance);
        } catch (error) {
            console.log(error);
          toast.error('Failed to fetch students');
        }
      };
      fetchStudents();
    }
  }, [selectedClass]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const submitAttendance = async () => {
    try {
      const attendanceData = {
        class_id: selectedClass,
        date,
        records: Object.entries(attendance).map(([studentId, status]) => ({
          student_id: studentId,
          status
        }))
      };
      
      console.log('Submitting attendance:', attendanceData);
      toast.success('Attendance submitted successfully!');
    } catch (error) {
        console.log(error);

      toast.error('Failed to submit attendance');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding student:', newStudent);
      toast.success('Student added successfully!');
      setNewStudent({
        name: '',
        roll_number: '',
        email: '',
        class_enrolled: selectedClass
      });
    } catch (error) {
        console.log(error);

      toast.error('Failed to add student');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <button 
            onClick={() => {
                logoutTeacher()
              navigate('/');
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`${activeTab === 'attendance' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Mark Attendance
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`${activeTab === 'students' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Manage Students
            </button>
          </nav>
        </div>

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                <select
                  value={selectedClass || ''}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {students.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.roll_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            value={attendance[student.id] || 'present'}
                            onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                            className="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={submitAttendance}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Submit Attendance
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No students found for the selected class.</p>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Students</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Add New Student</h3>
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={newStudent.roll_number}
                    onChange={(e) => setNewStudent({...newStudent, roll_number: e.target.value})}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={newStudent.class_enrolled || selectedClass || ''}
                    onChange={(e) => setNewStudent({...newStudent, class_enrolled: e.target.value})}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.code})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Student List</h3>
              {students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.roll_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No students found.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}