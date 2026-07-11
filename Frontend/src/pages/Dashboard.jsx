import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { resolveImage } from "../constants/config";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({ totalBlogs: 0, totalViews: 0 });
  const [loading, setLoading] = useState(true);

  // Bookmarks states
  const [activeTab, setActiveTab] = useState("my-blogs");
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const res = await API.get("/blogs/mine");
        setBlogs(res.data.blogs);
        setStats(res.data.stats);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load your blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchMyBlogs();
  }, []);

  useEffect(() => {
    if (activeTab === "bookmarks") {
      const fetchBookmarks = async () => {
        setBookmarksLoading(true);
        try {
          const res = await API.get("/bookmarks");
          setBookmarkedBlogs(res.data.blogs);
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to load bookmarks");
        } finally {
          setBookmarksLoading(false);
        }
      };
      fetchBookmarks();
    }
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog? This cannot be undone.")) return;
    try {
      await API.delete(`/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("Blog deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete blog");
    }
  };

  const handleRemoveBookmark = async (id) => {
    try {
      await API.post(`/bookmarks/blogs/${id}`); // Toggles bookmark status
      setBookmarkedBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bookmark removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove bookmark");
    }
  };

  if (!user) return null; // ProtectedRoute already guards this page

  return (
    <div className="container py-5">
      <h2>Welcome {user.fullName} 👋</h2>
      <hr />

      <div className="row mt-4 g-3">
        <div className="col-md-3">
          <div className="card shadow">
            <div className="card-body text-center">
              <h4>Blogs</h4>
              <h1>{stats.totalBlogs}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow">
            <div className="card-body text-center">
              <h4>Total Views</h4>
              <h1>{stats.totalViews}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow">
            <div className="card-body text-center d-flex flex-column justify-content-center h-100">
              <Link to="/create-blog" className="btn btn-primary">
                + Write Blog
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mt-5 mb-4">
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === "my-blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("my-blogs")}
          >
            My Blogs ({blogs.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-semibold ${activeTab === "bookmarks" ? "active" : ""}`}
            onClick={() => setActiveTab("bookmarks")}
          >
            Bookmarked Blogs ({activeTab === "bookmarks" ? bookmarkedBlogs.length : "..."})
          </button>
        </li>
      </ul>

      {activeTab === "my-blogs" ? (
        <>
          {loading && <p>Loading...</p>}
          {!loading && blogs.length === 0 && (
            <p className="text-muted">
              You haven't written any blogs yet. <Link to="/create-blog">Write one now</Link>.
            </p>
          )}

          {!loading && blogs.length > 0 && (
            <div className="table-responsive">
              <table className="table align-middle bg-white shadow-sm rounded">
                <thead>
                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Views</th>
                    <th>Published</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td style={{ width: 70 }}>
                        <img
                          src={resolveImage(blog.image)}
                          alt={blog.title}
                          style={{ width: 60, height: 45, objectFit: "cover" }}
                          className="rounded"
                        />
                      </td>
                      <td>{blog.title}</td>
                      <td>
                        <span className="badge bg-primary">{blog.category}</span>
                      </td>
                      <td>{blog.views}</td>
                      <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => navigate(`/blog/${blog.id}`)}
                        >
                          View
                        </button>
                        <Link
                          to={`/edit-blog/${blog.id}`}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(blog.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          {bookmarksLoading && <p>Loading bookmarks...</p>}
          {!bookmarksLoading && bookmarkedBlogs.length === 0 && (
            <p className="text-muted">
              You haven't bookmarked any blogs yet. Explore the <Link to="/blogs">Blogs list</Link> to find stories you like.
            </p>
          )}

          {!bookmarksLoading && bookmarkedBlogs.length > 0 && (
            <div className="table-responsive">
              <table className="table align-middle bg-white shadow-sm rounded">
                <thead>
                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Published</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookmarkedBlogs.map((blog) => (
                    <tr key={blog.id}>
                      <td style={{ width: 70 }}>
                        <img
                          src={resolveImage(blog.image)}
                          alt={blog.title}
                          style={{ width: 60, height: 45, objectFit: "cover" }}
                          className="rounded"
                        />
                      </td>
                      <td>{blog.title}</td>
                      <td>
                        <span className="badge bg-primary">{blog.category}</span>
                      </td>
                      <td>👤 {blog.author?.fullName}</td>
                      <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => navigate(`/blog/${blog.id}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveBookmark(blog.id)}
                        >
                          Unbookmark
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
