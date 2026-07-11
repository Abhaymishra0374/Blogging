import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import BlogForm from "../components/BlogForm";
import { useAuth } from "../context/AuthContext";
import { resolveImage } from "../constants/config";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data.blog);
      } catch (err) {
        setError(err.response?.data?.message || "Blog not found");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await API.put(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      navigate(`/blog/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">{error}</p>
        <Link to="/blogs" className="btn btn-primary">
          Back to Blogs
        </Link>
      </div>
    );
  }

  if (blog.author.id !== user?.id) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">You are not authorized to edit this blog.</p>
        <Link to={`/blog/${id}`} className="btn btn-primary">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="register-card">
            <h2 className="fw-bold mb-4">Edit Blog</h2>
            <BlogForm
              initialValues={{
                title: blog.title,
                category: blog.category,
                description: blog.description,
                content: blog.content,
                image: resolveImage(blog.image),
              }}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitLabel="Update Blog"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBlog;
