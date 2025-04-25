import React, { useEffect, useState } from 'react';
import Overview from "../comp/overview";
import Teachers from "../comp/Teachers";
import Classes from "../comp/classes";
import AssignClasses from "../comp/assignClasses";
import { useNavigate } from 'react-router-dom';
import { fetchAssignedClasses, fetchClases, fetchTeachers } from '../apihandle/api';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [teachers,setTeachers] = useState([]);
  const [classes,setClasses] = useState([]);
  const [AssignedTeacher,setAssignedTeacher] = useState([]);

  const navigate= useNavigate()

useEffect(() => {
    fetchTeachers()
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Error fetching teachers", err));
      fetchClases()
      .then((res) => setClasses(res.data))
      .catch((err) => console.error("Error fetching teachers", err));
          fetchAssignedClasses()
            .then((res) => setAssignedTeacher(res.data))
            .catch((err) => console.error("Error fetching teachers", err));
    }, []);
 

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-blue-800 text-white shadow-lg">
        <div className="p-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">Global Admin</h1>
          <p className="text-sm text-blue-200">Management Dashboard</p>
        </div>
        
        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'overview' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:bg-opacity-50'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('teachers')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'teachers' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:bg-opacity-50'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Teachers
          </button>
          
          <button
            onClick={() => setActiveTab('classes')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'classes' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:bg-opacity-50'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
            Classes
          </button>
          
          <button
            onClick={() => setActiveTab('assign')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'assign' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700 hover:bg-opacity-50'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Assign Classes
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm ">
          <div className="px-6 py-4 border-b flex justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'teachers' && 'Teacher Management'}
              {activeTab === 'classes' && 'Class Management'}
              {activeTab === 'assign' && 'Class Assignments'}
            </h2>
          <div className="flex">
            <button className='bg-red-500 p-2.5 text-white font-bold capitalize cursor-pointer' onClick={()=>{
   localStorage.clear()
   navigate('/admin')
            }}>logout</button>
          </div>
          </div>
        </header>
        <main className="p-6">
          {activeTab === 'overview' && (
         <Overview teachers={teachers} classes={classes} AssignedTeacher={AssignedTeacher}/>
          )}
          {activeTab === 'teachers' && (
               <Teachers teachers={teachers}/>
          )}
          {activeTab === 'classes' && (
          <Classes classes={classes}/>
          )}
          {activeTab === 'assign' && (
            <AssignClasses teachers={teachers} classes={classes} AssignedTeacher={AssignedTeacher}/>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;