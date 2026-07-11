import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { resolveImage } from "../constants/config";

function LatestBlogCard({ blog }) {
  return (
    <div className="col-lg-6 mb-4">
      <div className="latest-card">
        <img
          src={resolveImage(blog.image)}
          alt={blog.title}
          className="latest-img"
        />

        <div className="latest-content">
          <span className="badge bg-success mb-2">{blog.category}</span>

          <h4>{blog.title}</h4>

          <p>{blog.description}</p>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <small>👤 {blog.author?.fullName}</small>

            <Link to={`/blog/${blog.id}`} className="btn btn-sm btn-primary">
              Read More <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LatestBlogCard;
