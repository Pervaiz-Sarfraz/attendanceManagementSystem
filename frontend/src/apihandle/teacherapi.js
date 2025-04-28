import axios from 'axios';

const API_URL = 'http://localhost:8000/';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Interceptor to handle 401 errors and refresh tokens
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('teacherrefresh');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_URL}teacher/token/refresh/`, {
          refresh: refreshToken
        });

        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh; // Store new refresh token
        localStorage.setItem('teacheraccess', newAccessToken);
        localStorage.setItem('teacherrefresh', newRefreshToken);

        // Update the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear localStorage and redirect to login on refresh failure
        localStorage.removeItem('teacheraccess');
        localStorage.removeItem('teacherrefresh');
        localStorage.removeItem('teacher_id');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('is_first_login');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const teacherLogin = async (email, password = null) => {
  const payload = password ? { email, password } : { email };
  return await api.post('teacher/login/', payload);
};

export const teacherSetPassword = async (data) => {
  return await api.post('teacher/set-password/', {
    email: data.email,
    password: data.email,
    confirm_password: data.confirm_password
  });
};

export const logoutTeacher = async () => {
  const refreshToken = localStorage.getItem('teacherrefresh');
  const accessToken = localStorage.getItem('teacheraccess');
  try {
    await api.post('teacher/logout/', { refresh: refreshToken }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem('teacheraccess');
    localStorage.removeItem('teacherrefresh');
    localStorage.removeItem('teacher_id');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('is_first_login');
    window.location.href = '/';
  }
};