import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import BlogForm from "../components/BlogForm";

function CreateBlog() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await API.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      navigate(`/blog/${res.data.blog.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="register-card">
            <h2 className="fw-bold mb-4">Write a New Blog</h2>
            <BlogForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Publish Blog" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
