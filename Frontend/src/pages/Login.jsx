import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import loginImg from "../assets/images/login.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await API.post("/auth/login", formData);
      login({ user: res.data.user, token: res.data.token });
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="register-page">
      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 d-none d-lg-block">
            <img src={loginImg} className="img-fluid" alt="Login" />
          </div>

          <div className="col-lg-6">
            <div className="register-card">
              <h2 className="fw-bold">Welcome Back 👋</h2>

              <p className="text-muted mb-4">Login to continue.</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>

                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label mb-0">Password</label>
                    <Link to="/forgot-password" style={{ fontSize: "0.85rem", textDecoration: "none" }}>
                      Forgot Password?
                    </Link>
                  </div>

                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="text-center mt-4">
                Don't have an account?
                <Link to="/register" className="ms-2">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
