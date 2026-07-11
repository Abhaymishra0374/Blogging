import { Link } from "react-router-dom";
import hero from "../assets/images/Hero.png";

function Hero() {
  return (
    <section className="hero-section py-5">
      <div className="container">

        <div className="row align-items-center">

          {/* Left Side */}
          <div className="col-lg-6">

            <span className="badge bg-primary mb-3 px-3 py-2">
              🚀 Welcome to Blogify
            </span>

            <h1 className="display-3 fw-bold">
              Share Your
              <span className="text-primary"> Stories</span>
              <br />
              Inspire Millions.
            </h1>

            <p className="lead text-secondary my-4">
              Discover insightful articles, share your knowledge,
              and connect with passionate writers across the globe.
            </p>

            <div className="d-flex gap-3 mb-5">
              <Link to="/blogs" className="btn btn-primary btn-lg">
                Start Reading
              </Link>

              <Link to="/create-blog" className="btn btn-outline-dark btn-lg">
                Write a Blog
              </Link>
            </div>

            {/* Stats */}
            <div className="row text-center">

              <div className="col-4">
                <h3 className="fw-bold text-primary">10K+</h3>
                <p>Readers</p>
              </div>

              <div className="col-4">
                <h3 className="fw-bold text-primary">500+</h3>
                <p>Blogs</p>
              </div>

              <div className="col-4">
                <h3 className="fw-bold text-primary">150+</h3>
                <p>Authors</p>
              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="col-lg-6 text-center">
            <img
              src={hero}
              alt="Hero"
              className="img-fluid hero-img"
            />
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;