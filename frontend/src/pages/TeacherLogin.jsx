import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherSetPassword, teacherLogin } from '../apihandle/teacherapi';
import { toast } from 'react-toastify';

export default function TeacherLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState(1);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('teacheraccess');
    if (accessToken) {
      navigate('/teacher/Dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const checkTeacherStatus = async () => {
    setIsLoading(true);
    try {
      const response = await teacherLogin(credentials.email);
      
      if (response.data.is_first_login) {
        setIsFirstLogin(true);
        setLoginStep(2);
        toast.info("Please set your password");
      } else {
        setIsFirstLogin(false);
        setLoginStep(2);
        toast.info("Please enter your password");
      }
    } catch (error) {
      if (error.response?.data?.error === "Invalid password") {
        setIsFirstLogin(false);
        setLoginStep(2);
        toast.info("Please enter your password");
      } else {
        toast.error(error.response?.data?.error || "Teacher not found");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setIsLoading(true);
    try {
      if (isFirstLogin) {
        const response = await teacherSetPassword({
          email: credentials.email,
          password: credentials.password,
          confirm_password: credentials.confirmPassword
        });

        localStorage.setItem('teacheraccess', response.data.access);
        localStorage.setItem('teacherrefresh', response.data.refresh);
        localStorage.setItem('teacher_id', response.data.teacher_id);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('name', response.data.name);
        toast.success("Password set successfully!");
        navigate('/teacher/Dashboard');
      } else {
        const response = await teacherLogin(credentials.email, credentials.password);
        
        localStorage.setItem('teacheraccess', response.data.access);
        localStorage.setItem('teacherrefresh', response.data.refresh);
        localStorage.setItem('teacher_id', response.data.teacher_id);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('name', response.data.name);
        toast.success("Login successful!");
        navigate('/teacher/Dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      toast.error(errorMessage);
      if (errorMessage === "Invalid password" && !isFirstLogin) {
        setCredentials(prev => ({ ...prev, password: '' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginStep === 1) {
      checkTeacherStatus();
    } else {
      handlePasswordSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Teacher Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {loginStep === 1 ? 'Enter your email to continue' : 
             isFirstLogin ? 'Set your password' : 'Enter your password'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={credentials.email}
              onChange={handleChange}
              disabled={isLoading || loginStep === 2}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {loginStep === 2 && (
            <>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={isFirstLogin ? "Set your password" : "Enter your password"}
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {isFirstLogin && (
                <div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={credentials.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : 
             loginStep === 1 ? "Continue" : 
             isFirstLogin ? "Set Password" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}