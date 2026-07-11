import TrendingCard from "./TrendingCard";

function TrendingBlogs({ blogs = [] }) {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">🔥 Trending Blogs</h2>
          <p className="text-muted">Most viewed blogs by our community.</p>
        </div>

        {blogs.length === 0 ? (
          <p className="text-center text-muted">No trending blogs yet.</p>
        ) : (
          <div className="row">
            {blogs.map((blog) => (
              <TrendingCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default TrendingBlogs;
