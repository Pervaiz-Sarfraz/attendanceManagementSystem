import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/AdminLogin";
import TeacherLogin from "./pages/teacherLogin";
import NotFound from "./pages/NotFound";
import Dasboard from "./pages/Dasboard";
import { ToastContainer } from "react-toastify";

export default function App() {
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
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/teacher" element={<TeacherLogin />} />
        <Route path="/dasboard" element={<Dasboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
