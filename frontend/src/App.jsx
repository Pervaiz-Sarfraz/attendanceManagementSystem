import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/AdminLogin";
import TeacherLogin from "./pages/TeacherLogin";
import NotFound from "./pages/NotFound";
import Dasboard from "./pages/Dasboard";
import TeacherDasboard from "./pages/TeacherDashboard";
import { Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";

export default function App() {
  function ProtectedRoute({ children }) {
    const accessToken = localStorage.getItem('teacheraccess');
    return accessToken ? children : <Navigate to="/" />;
  }
  return (
    <BrowserRouter>
         <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<TeacherLogin />} />
        <Route path="/dasboard" element={<Dasboard />} />
        <Route
  path="/teacher/Dashboard"
  element={<ProtectedRoute><TeacherDasboard /></ProtectedRoute>}
/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
