import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseDetail from "./pages/CourseDetail";
import UserDetail from "./pages/UserDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentPage from "./pages/Payment";
import TeacherPanel from "./pages/TeacherPanel";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import OrderHistory from "./pages/OrderHistory";
import 'alertifyjs/build/css/alertify.css';
import './App.css';
import { AuthProvider } from "./context/AuthContext";
import Notifications from './pages/Notifications';
import PaymentSuccess from "./pages/PaymentSuccess";
import Unauthorized from "./pages/Unauthorized";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/course/:id" element={<CourseDetail />} />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute requiredRoles={["User", "Teacher"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRoles={["User", "Teacher"]}>
                <UserDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRoles={["User", "Teacher"]}>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute requiredRoles={["User", "Teacher"]}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher"
            element={
              <ProtectedRoute requiredRoles={["Teacher"]}>
                <TeacherPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/courses/create"
            element={
              <ProtectedRoute requiredRoles={["Teacher"]}>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/courses/edit/:id"
            element={
              <ProtectedRoute requiredRoles={["Teacher"]}>
                <EditCourse />
              </ProtectedRoute>
            }
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
           <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}