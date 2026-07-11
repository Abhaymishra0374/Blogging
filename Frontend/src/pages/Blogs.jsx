import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/axios";
import BlogCard from "../components/BlogCard";
import { CATEGORIES } from "../constants/categories";

function Blogs() {
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== "All") params.category = category;
        if (search) params.search = search;
        const res = await API.get("/blogs", { params });
        setBlogs(res.data.blogs);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchBlogs, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [search, category]);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">All Blogs</h2>
        <p className="text-muted">Browse every story shared on Blogify.</p>
      </div>

      <div className="row justify-content-center mb-5 g-3">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-center">Loading blogs...</p>}
      {!loading && error && <p className="text-center text-danger">{error}</p>}
      {!loading && !error && blogs.length === 0 && (
        <p className="text-center text-muted">No blogs found.</p>
      )}

      <div className="row">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

export default Blogs;
