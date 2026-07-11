import { useNavigate } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    { id: 1, icon: "💻", name: "Technology" },
    { id: 2, icon: "🤖", name: "Artificial Intelligence" },
    { id: 3, icon: "🌍", name: "Travel" },
    { id: 4, icon: "🍔", name: "Food" },
    { id: 5, icon: "💼", name: "Business" },
    { id: 6, icon: "🎨", name: "Design" },
    { id: 7, icon: "⚽", name: "Sports" },
    { id: 8, icon: "🎵", name: "Music" },
  ];

  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Browse Categories</h2>
          <p className="text-muted">Explore blogs from your favorite topics.</p>
        </div>

        <div className="row g-4">
          {categories.map((category) => (
            <div className="col-lg-3 col-md-4 col-6" key={category.id}>
              <div
                className="category-card"
                role="button"
                onClick={() => navigate(`/blogs?category=${encodeURIComponent(category.name)}`)}
              >
                <h1>{category.icon}</h1>
                <h5 className="mt-3">{category.name}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
