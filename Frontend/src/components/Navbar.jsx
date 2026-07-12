import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resolveImage } from "../constants/config";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary fs-3" to="/">
          Blogify
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/blogs">
                Blogs
              </Link>
            </li>

            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/create-blog">
                  Write Blog
                </Link>
              </li>
            )}
          </ul>

          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">
                Login
              </Link>

              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          ) : (
            <div className="d-flex align-items-center">
              <Link
                to="/profile"
                className="d-flex align-items-center me-3 fw-semibold text-decoration-none text-dark"
              >
                <img
                  src={resolveImage(user.avatar) || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + user.fullName}
                  alt="Avatar"
                  className="rounded-circle me-2 border border-secondary"
                  style={{ width: "32px", height: "32px", objectFit: "cover" }}
                />
                {user.fullName}
              </Link>

              <Link to="/dashboard" className="btn btn-success me-2">
                Dashboard
              </Link>

              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
