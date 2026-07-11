import { Link } from "react-router-dom";
import { resolveImage } from "../constants/config";

function BlogCard({ blog }) {
  return (
    <div className="col-md-4 mb-4">
      <Link to={`/blog/${blog.id}`} className="text-decoration-none text-dark">
        <div className="card blog-card h-100 shadow-sm border-0">
          <img
            src={resolveImage(blog.image)}
            className="card-img-top"
            alt={blog.title}
          />

          <div className="card-body">
            <span className="badge bg-primary mb-2">{blog.category}</span>

            <h5 className="fw-bold">{blog.title}</h5>

            <p className="text-muted">{blog.description}</p>
          </div>

          <div className="card-footer bg-white border-0 d-flex justify-content-between">
            <small>👤 {blog.author?.fullName}</small>
            <small>
              📅{" "}
              {blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString()
                : ""}
            </small>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BlogCard;
