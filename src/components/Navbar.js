import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/jwtDecoder";
import { useState, useEffect } from "react";
import notificationService from "../services/notificationService";

export default function Navbar() {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const { logout, isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await notificationService.getAllNotifications(1, 20);
        console.log(response.notifications.items);
        setNotifications(response.notifications.items);
      } catch (error) {
      }
    };

    fetchNotifications();
  }, [isAuthenticated]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">E-Course</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/notifications">Notifications</Link>
            </li>
            {isAuthenticated ? (
              <>
                {userRole === "Teacher" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/teacher">Teacher Panel</Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">My Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger ms-3" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
