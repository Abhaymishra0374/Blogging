import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaTrash } from "react-icons/fa";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { resolveImage } from "../constants/config";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Social stats & states
  const [likes, setLikes] = useState({ liked: false, count: 0 });
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data.blog);

        // Fetch likes count and status
        const likesRes = await API.get(`/likes/blogs/${id}`);
        setLikes(likesRes.data);

        // Fetch bookmark status (only if logged in)
        if (user) {
          const bookmarkRes = await API.get(`/bookmarks/blogs/${id}`);
          setBookmarked(bookmarkRes.data.bookmarked);
        }

        // Fetch comments
        const commentsRes = await API.get(`/comments/blogs/${id}`);
        setComments(commentsRes.data.comments);
      } catch (err) {
        setError(err.response?.data?.message || "Blog not found");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this blog? This cannot be undone.")) return;
    try {
      await API.delete(`/blogs/${id}`);
      toast.success("Blog deleted");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete blog");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.info("Please log in to like this blog post.");
      return;
    }
    try {
      const res = await API.post(`/likes/blogs/${id}`);
      setLikes({ liked: res.data.liked, count: res.data.count });
    } catch (err) {
      toast.error("Failed to update like status");
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.info("Please log in to bookmark this blog post.");
      return;
    }
    try {
      const res = await API.post(`/bookmarks/blogs/${id}`);
      setBookmarked(res.data.bookmarked);
      toast.success(res.data.bookmarked ? "Bookmarked!" : "Removed from bookmarks");
    } catch (err) {
      toast.error("Failed to update bookmark status");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await API.post(`/comments/blogs/${id}`, { content: newComment });
      setComments((prev) => [res.data.comment, ...prev]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
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

  const isOwner = user?.id === blog.author.id;

  return (
    <article className="container py-5" style={{ maxWidth: 850 }}>
      <span className="badge bg-primary mb-3">{blog.category}</span>
      <h1 className="fw-bold mb-3">{blog.title}</h1>

      <div className="d-flex justify-content-between align-items-center text-muted mb-4 flex-wrap gap-2">
        <span>
          👤 {blog.author.fullName} &nbsp;•&nbsp; 📅{" "}
          {new Date(blog.createdAt).toLocaleDateString()} &nbsp;•&nbsp; 👁{" "}
          {blog.views} views
        </span>

        {isOwner && (
          <div>
            <Link
              to={`/edit-blog/${blog.id}`}
              className="btn btn-sm btn-outline-primary me-2"
            >
              Edit
            </Link>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <img
        src={resolveImage(blog.image)}
        alt={blog.title}
        className="img-fluid rounded mb-4 w-100"
        style={{ maxHeight: 420, objectFit: "cover" }}
      />

      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: "1.1rem" }} className="mb-5">
        {blog.content}
      </div>

      {/* Engagement bar (Likes and Bookmarks) */}
      <div className="d-flex justify-content-between align-items-center py-3 border-top border-bottom mb-5">
        <div className="d-flex gap-4">
          <button
            onClick={handleLike}
            className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 text-danger"
            style={{ fontSize: "1.2rem", border: "none", background: "none" }}
          >
            {likes.liked ? <FaHeart /> : <FaRegHeart />}
            <span className="text-muted small fw-semibold">{likes.count} likes</span>
          </button>
        </div>

        <button
          onClick={handleBookmark}
          className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 text-primary"
          style={{ fontSize: "1.2rem", border: "none", background: "none" }}
        >
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
          <span className="text-muted small fw-semibold">
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </span>
        </button>
      </div>

      {/* Comments Section */}
      <section className="comments-section mt-5">
        <h3 className="fw-bold mb-4">Discussion ({comments.length})</h3>

        {/* Comment input form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-5">
            <div className="form-group mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Share your thoughts on this story..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={1000}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={commentLoading || !newComment.trim()}
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="alert alert-light border text-center py-4 mb-5">
            <p className="text-muted mb-3">You must be logged in to participate in the discussion.</p>
            <Link to="/login" className="btn btn-outline-primary btn-sm">
              Sign In to Comment
            </Link>
          </div>
        )}

        {/* Comments list */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="text-muted text-center py-4">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((comment) => {
              const isCommentOwner = user?.id === comment.user_id;
              const isBlogOwner = user?.id === blog.author.id;
              const canDelete = isCommentOwner || isBlogOwner;

              return (
                <div key={comment.id} className="card border-0 shadow-sm p-4 mb-3 bg-light">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-3">
                      {comment.user_avatar ? (
                        <img
                          src={resolveImage(comment.user_avatar)}
                          alt={comment.user_name}
                          className="rounded-circle"
                          style={{ width: 40, height: 40, objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: 40, height: 40, fontSize: "1.1rem" }}
                        >
                          {comment.user_name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h6 className="mb-0 fw-bold">{comment.user_name}</h6>
                        <small className="text-muted">
                          {new Date(comment.created_at).toLocaleDateString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleCommentDelete(comment.id)}
                        className="btn btn-link text-danger p-1"
                        title="Delete comment"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  <div className="text-dark mt-2" style={{ whiteSpace: "pre-wrap" }}>
                    {comment.content}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </article>
  );
}

export default BlogDetails;
