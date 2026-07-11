import { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.put("/auth/profile", { fullName, bio });
      updateUser({
        fullName: res.data.user.full_name,
        bio: res.data.user.bio,
      });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="register-card">
            <h2 className="fw-bold mb-4">My Profile</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={user.email}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Tell readers a bit about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>

              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
