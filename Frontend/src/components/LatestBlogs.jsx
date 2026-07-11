import LatestBlogCard from "./LatestBlogCard";

function LatestBlogs({ blogs = [] }) {
  return (
    <section className="latest-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Latest Blogs</h2>
          <p className="text-muted">Read the newest articles from our writers.</p>
        </div>

        {blogs.length === 0 ? (
          <p className="text-center text-muted">No blogs published yet.</p>
        ) : (
          <div className="row">
            {blogs.map((blog) => (
              <LatestBlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestBlogs;
