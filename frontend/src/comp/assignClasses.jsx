import React, { useState } from 'react'
import { AssignClass, unassignclasses } from '../apihandle/api';
import { toast } from 'react-toastify';

function AssignClasses({ teachers, classes,AssignedTeacher }) {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedTeacher || !selectedClass) {
      toast.error('Please select both teacher and class');
      return;
    }

    try {
      const jobsuccess = await AssignClass({
        teacher: selectedTeacher,
        class_assign: selectedClass
      });

      if (jobsuccess.status === 201) {
        setSelectedTeacher('');
        setSelectedClass('');
        toast.success('Class Assigned');
        location.reload(); 
      }
    } catch (err) {
      console.error(err);
      toast.error('Getting Error on Assigning Class');
    }
  };
  const UnassignClass= async(classid)=>{
     try {
           const res=  await unassignclasses(classid);
           if (res.status == 204) {
               location.reload();
               toast.success('Class Unassign')
           }
          } catch (err) {
            console.error(err)
            toast.error('Error Removing Assigned Class')
          }
  }

    console.log(AssignedTeacher);
    
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-medium text-gray-900">Class Assignments</h3>
        <p className="mt-1 text-sm text-gray-500">Assign teachers to classes</p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-md font-medium mb-4">Make New Assignment</h4>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleAssign}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Assign Class
              </button>
            </div>
          </form>
        </div>

        <div>
          <h4 className="text-md font-medium mb-4">Current Assignments</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {AssignedTeacher.map(clasname => (
                  <tr key={clasname.class_assign}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{clasname.class_name}-{clasname.class_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clasname.teacher_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{clasname.class_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-red-600 hover:text-red-900" onClick={()=>{UnassignClass(clasname.class_assign)}}>Unassign</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignClasses;
