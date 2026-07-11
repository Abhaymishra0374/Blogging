import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import loginImg from "../assets/images/login.png";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    code: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.code || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post("/auth/reset-password", formData);
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="register-page">
      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 d-none d-lg-block">
            <img src={loginImg} className="img-fluid" alt="Reset Password" />
          </div>

          <div className="col-lg-6">
            <div className="register-card">
              <h2 className="fw-bold">Reset Password 🔒</h2>
              <p className="text-muted mb-4">
                Enter the verification code sent to your email along with your new password.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={!!searchParams.get("email")}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Verification Code (6-digit)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="code"
                    placeholder="Enter code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Repeat new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <p className="text-center mt-4">
                Need another code?
                <Link to="/forgot-password" className="ms-2">
                  Request New Code
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
