import { useState } from "react";
import { CATEGORIES } from "../constants/categories";

/**
 * Shared form for both creating and editing a blog post.
 * `initialValues` pre-fills fields (used by EditBlog).
 * `onSubmit` receives a FormData object ready to POST/PUT.
 */
function BlogForm({ initialValues = {}, onSubmit, submitting, submitLabel }) {
  const [title, setTitle] = useState(initialValues.title || "");
  const [category, setCategory] = useState(
    initialValues.category || CATEGORIES[0]
  );
  const [description, setDescription] = useState(
    initialValues.description || ""
  );
  const [content, setContent] = useState(initialValues.content || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(initialValues.image || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("content", content);
    if (image) formData.append("image", image);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          placeholder="Give your blog a catchy title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Cover Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
      </div>

      {preview && (
        <div className="mb-3">
          <img
            src={preview}
            alt="Cover preview"
            className="img-fluid rounded"
            style={{ maxHeight: 220, objectFit: "cover" }}
          />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Short Description</label>
        <input
          type="text"
          className="form-control"
          placeholder="A one-line summary shown on blog cards"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Content</label>
        <textarea
          className="form-control"
          rows="12"
          placeholder="Write your blog here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>

      <button className="btn btn-primary px-4" type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel || "Publish"}
      </button>
    </form>
  );
}

export default BlogForm;
