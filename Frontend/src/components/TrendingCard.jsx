import { Link } from "react-router-dom";
import { resolveImage } from "../constants/config";

function TrendingCard({ blog }) {
  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <Link to={`/blog/${blog.id}`} className="text-decoration-none text-dark">
        <div className="card trending-card border-0 h-100">
          <img
            src={resolveImage(blog.image)}
            className="card-img-top"
            alt={blog.title}
          />

          <div className="card-body">
            <span className="badge bg-danger mb-2">🔥 Trending</span>

            <h5 className="fw-bold mt-2">{blog.title}</h5>

            <p className="text-muted">{blog.description}</p>
          </div>

          <div className="card-footer bg-white border-0 d-flex justify-content-between">
            <small>👤 {blog.author?.fullName}</small>
            <small>👁 {blog.views}</small>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default TrendingCard;
