import { FaPaperPlane } from "react-icons/fa";

function Newsletter() {
  return (
    <section className="newsletter-section py-5">
      <div className="container">

        <div className="newsletter-box">

          <h2 className="fw-bold">
            Subscribe to our Newsletter
          </h2>

          <p className="text-muted">
            Get the latest blogs, tips and updates directly in your inbox.
          </p>

          <div className="row justify-content-center mt-4">

            <div className="col-lg-6">

              <div className="input-group">

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />

                <button className="btn btn-primary">
                  Subscribe <FaPaperPlane />
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Newsletter;