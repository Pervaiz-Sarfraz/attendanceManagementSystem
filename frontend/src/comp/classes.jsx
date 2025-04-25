import React, { useState } from 'react';
import { createClass, deleteclasses } from '../apihandle/api';
import { toast } from 'react-toastify';

function Classes({classes}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    schedule: ''
  });
  
    const scheduleOptions = [
    'Mon/Wed/Fri 9:00-10:00',
    'Tue/Thu 10:00-11:30',
    'Mon/Wed 2:00-3:30',
    'Tue/Thu/Fri 1:00-2:30'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      e.preventDefault();
         try {
          const jobsuccess= await createClass({
            name:formData.name,
            code:formData.code,
            schedule:formData.schedule,
           });
           if (jobsuccess.status == 201) {
            setFormData("");
            toast.success('Class Added')
            location.reload();
          }
         } catch (err) {
           console.error(err);
           toast.error('Getting Error on adding teacher')
         }
  };

  const handleDelete = async (classid) => {
         try {
           const res=  await deleteclasses(classid);
           if (res.status == 204) {
               location.reload();
               toast.success('Teacher Removed')
           }
          } catch (err) {
            console.error(err)
            toast.error('Teacher is not removed')
          }
    
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-medium text-gray-900">Class Management</h3>
        <p className="mt-1 text-sm text-gray-500">Add and manage school classes</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-md font-medium mb-4">Add New Class</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Class name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Class name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
              <select
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select schedule</option>
                {scheduleOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Class
              </button>
            </div>
          </form>
        </div>
        
        <div>
          <h4 className="text-md font-medium mb-4">Current Classes</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Class Code {cls.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.schedule}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {/* <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button> */}
                      <button 
                        onClick={() => handleDelete(cls.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
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

export default Classes;