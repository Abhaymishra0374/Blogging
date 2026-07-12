import { useState } from "react";
import { toast } from "react-toastify";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { resolveImage } from "../constants/config";

function Profile() {
  const { user, updateUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("bio", bio);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await API.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateUser({
        fullName: res.data.user.fullName,
        bio: res.data.user.bio,
        avatar: res.data.user.avatar,
      });
      toast.success(res.data.message);
      setAvatarFile(null);
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
          <div className="register-card p-4 rounded-4 shadow-sm border border-light">
            <h2 className="fw-bold mb-4 text-center">My Profile</h2>

            <form onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                <img
                  src={avatarPreview || resolveImage(user.avatar) || "https://api.dicebear.com/7.x/adventurer/svg?seed=avatar"}
                  alt="Avatar"
                  className="rounded-circle border border-primary p-1 shadow-sm"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
                <div className="mt-3">
                  <label htmlFor="avatarInput" className="btn btn-outline-primary btn-sm px-3 rounded-pill">
                    Change Photo
                  </label>
                  <input
                    type="file"
                    id="avatarInput"
                    className="d-none"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control rounded-3 bg-light"
                  value={user.email}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Bio</label>
                <textarea
                  className="form-control rounded-3"
                  rows="4"
                  placeholder="Tell readers a bit about yourself"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>

              <div className="d-grid">
                <button className="btn btn-primary py-2.5 rounded-3 fw-semibold" type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
