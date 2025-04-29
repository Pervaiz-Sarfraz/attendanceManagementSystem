import axiosInstance from "./axiosInstance";
import axios from "axios";
export const createTeacher = (data) =>
  axiosInstance.post(`/t28teachers/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  export const fetchTeachers = () => axiosInstance.get(`/t28teachers/`);
  export const deleteTeacher = (id) =>
    axiosInstance.delete(`/teacher/${id}/`);
  export const createClass = (data) =>
    axiosInstance.post(`/class/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    export const fetchClases = () => axiosInstance.get(`/class/`);
    export const deleteclasses = (id) =>
      axiosInstance.delete(`/class/${id}/`);
    export const AssignClass = (data) =>
      axiosInstance.post(`/assignments/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      export const fetchAssignedClasses = () => axiosInstance.get(`/assignments/`);
      export const unassignclasses = (id) =>
        axiosInstance.delete(`/class/${id}/`);

export const adminLogin = async ({ email, password }) => {
  try {
    const response = await axios.post('http://localhost:8000/login/', { email, password });

    if (response.status === 200) {
      const { access, refresh } = response.data;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      return response;
    }
  } catch (error) {
    console.error('Login failed:', error.response?.data?.error || error.message);
    throw error;
  }
};

export const teacherLogin = async (email, password = null) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const payload = password ? { email, password } : { email };
    const response = await axios.post(
      'http://localhost:8000/teacher/login/',
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const teacherSetPassword = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(
      'http://localhost:8000/teacher/set-password/',
      {
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );
    
    return response;
  } catch (error) {
    throw error;
  }
};



export const logoutTeacher= async ()=> {
  const refreshToken = localStorage.getItem('teacheraccess');
  await fetch('http://localhost:8000/teacher/logout/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }) 
  });
  localStorage.removeItem('teacheraccess');
  localStorage.removeItem('teacherrefresh');
  localStorage.removeItem('teacher_id');
  localStorage.removeItem('email');
  localStorage.removeItem('name');
  localStorage.removeItem('is_first_login');
  window.location.href = '/';
}