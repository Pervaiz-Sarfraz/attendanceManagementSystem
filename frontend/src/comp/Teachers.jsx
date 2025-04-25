import React, { useState } from 'react'
import { createTeacher, deleteTeacher } from '../apihandle/api';
import { toast } from 'react-toastify';

function Teachers({teachers}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
         const jobsuccess= await createTeacher({
            name,
            email,
          });
          if (jobsuccess.status == 201) {
           setName("");
           setEmail("");
           toast.success('Teacher Added')
           location.reload();
         }
        } catch (err) {
          console.error(err);
          toast.error('Getting Error on adding teacher')
        }
      };
const removeTeacher = async (Teacherid)=>{
        try {
       const res=  await deleteTeacher(Teacherid);
       if (res.status == 204) {
           location.reload();
           toast.success('Teacher Removed')
       }
      } catch (err) {
        console.error(err)
        toast.error('Teacher is not removed')
      }
}
  return (
          <>
         <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">Teacher Management</h3>
                <p className="mt-1 text-sm text-gray-500">Add and manage teaching staff</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-md font-medium mb-4">Add New Teacher</h4>
                  <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="name"
                        required
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Email address"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Subject taught"
                      />
                    </div> */}
                    <div className="md:col-span-3">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Teacher
                      </button>
                    </div>
                  </form>
                </div>
                
                <div>
                  <h4 className="text-md font-medium mb-4">Current Teachers</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {teachers.map((teacher) => (
                          <tr key={teacher.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.subject}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {/* <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button> */}
                              <button className="text-red-600 hover:text-red-900" onClick={()=>{removeTeacher(teacher.id)}}>Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
    </>
  )
}

export default Teachers
