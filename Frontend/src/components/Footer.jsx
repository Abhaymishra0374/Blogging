import { Link } from "react-router-dom";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer-section">

      <div className="container">

        <div className="row">

          <div className="col-lg-4 mb-4 mb-lg-0">

            <h3 className="text-white fw-bold">Blogify</h3>

            <p className="text-light mt-3 opacity-75">
              Share your knowledge, inspire readers, and grow your community with our modern blogging platform.
            </p>

          </div>

          <div className="col-lg-4 mb-4 mb-lg-0">

            <h5 className="text-white mb-3 fw-semibold">
              Quick Links
            </h5>

            <ul className="list-unstyled footer-links">

              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none opacity-75 hover-opacity-100">Home</Link>
              </li>

              <li className="mb-2">
                <Link to="/blogs" className="text-light text-decoration-none opacity-75 hover-opacity-100">Blogs</Link>
              </li>

              <li className="mb-2">
                <Link to="/dashboard" className="text-light text-decoration-none opacity-75 hover-opacity-100">Dashboard</Link>
              </li>

              <li className="mb-2">
                <Link to="/profile" className="text-light text-decoration-none opacity-75 hover-opacity-100">Profile</Link>
              </li>

            </ul>

          </div>

          <div className="col-lg-4">

            <h5 className="text-white mb-3 fw-semibold">
              Follow Us
            </h5>

            <div className="social-icons d-flex gap-3">

              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white bg-secondary bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center social-icon-link" style={{ width: "40px", height: "40px", transition: "all 0.3s" }}>
                <FaFacebook size={18} />
              </a>

              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white bg-secondary bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center social-icon-link" style={{ width: "40px", height: "40px", transition: "all 0.3s" }}>
                <FaInstagram size={18} />
              </a>

              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white bg-secondary bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center social-icon-link" style={{ width: "40px", height: "40px", transition: "all 0.3s" }}>
                <FaLinkedin size={18} />
              </a>

              <a href="https://github.com/Abhaymishra0374" target="_blank" rel="noopener noreferrer" className="text-white bg-secondary bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center social-icon-link" style={{ width: "40px", height: "40px", transition: "all 0.3s" }}>
                <FaGithub size={18} />
              </a>

            </div>

          </div>

         </div>

        <hr className="text-light my-4 opacity-25"/>

        <p className="text-center text-light mb-0 opacity-75 small">
          © 2026 Blogify. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;