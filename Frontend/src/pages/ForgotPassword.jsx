import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import loginImg from "../assets/images/login.png"; // reusing login visual assets

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    try {
      const res = await API.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request code");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="register-page">
      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 d-none d-lg-block">
            <img src={loginImg} className="img-fluid" alt="Forgot Password" />
          </div>

          <div className="col-lg-6">
            <div className="register-card">
              <h2 className="fw-bold">Forgot Password? 🔑</h2>
              <p className="text-muted mb-4">
                Enter your email address and we'll send you a 6-digit verification code to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="btn btn-primary w-100 btn-lg"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Sending Code..." : "Send Reset Code"}
                </button>
              </form>

              <p className="text-center mt-4">
                Remember your password?
                <Link to="/login" className="ms-2">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
