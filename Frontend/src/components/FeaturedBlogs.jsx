import BlogCard from "./BlogCard";

function FeaturedBlogs({ blogs = [] }) {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Featured Blogs</h2>
          <p className="text-muted">Explore our latest featured articles.</p>
        </div>

        {blogs.length === 0 ? (
          <p className="text-center text-muted">
            No blogs yet — be the first to publish one!
          </p>
        ) : (
          <div className="row">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedBlogs;
