import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer-section">

      <div className="container">

        <div className="row">

          <div className="col-lg-4">

            <h3 className="text-white">Blogify</h3>

            <p className="text-light mt-3">
              Share your knowledge, inspire readers and grow your community.
            </p>

          </div>

          <div className="col-lg-4">

            <h5 className="text-white mb-3">
              Quick Links
            </h5>

            <ul className="list-unstyled">

              <li><a href="#">Home</a></li>

              <li><a href="#">Blogs</a></li>

              <li><a href="#">Categories</a></li>

              <li><a href="#">About</a></li>

            </ul>

          </div>

          <div className="col-lg-4">

            <h5 className="text-white mb-3">
              Follow Us
            </h5>

            <div className="social-icons">

              <FaFacebook />

              <FaInstagram />

              <FaLinkedin />

              <FaGithub />

            </div>

          </div>

        </div>

        <hr className="text-light"/>

        <p className="text-center text-light mb-0">
          © 2026 Blogify. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;