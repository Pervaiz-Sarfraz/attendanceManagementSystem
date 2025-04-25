import axiosInstance from "./axiosInstance";
export const adminLogin = ({ email, password }) =>
  axiosInstance.post(`/login/`, { email, password });
export const createTeacher = (data) =>
  axiosInstance.post(`/teacher/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  export const fetchTeachers = () => axiosInstance.get(`/teacher/`);
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
// export const adminLogin = async ({ email, password }) => {
//   try {
//     const response = await axios.post('http://localhost:8000/login/', { email, password });

//     if (response.status === 200) {
//       const { access, refresh } = response.data;

//       // Store the tokens in localStorage
//       localStorage.setItem('access', access);
//       localStorage.setItem('refresh', refresh);

//       console.log('Login successful:', response.data);
//       return response.data; // Return user data for further usage
//     }
//   } catch (error) {
//     console.error('Login failed:', error.response?.data?.error || error.message);
//     throw error;
//   }
// };
