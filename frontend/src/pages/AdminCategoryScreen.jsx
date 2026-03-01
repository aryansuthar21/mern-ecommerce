import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";

const AdminCategoryScreen = () => {
  const { userInfo } = useSelector((state) => state.userLogin);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    parent: "",
    description: "",
    sortOrder: 0,
    isActive: true,
    seoTitle: "",
    seoDescription: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  /* ==============================================
     FETCH TREE STRUCTURE
  ============================================== */
  const fetchCategories = async () => {
  try {
    setLoading(true);
    setError(null);

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await api.get("/categories", config);

    setCategories(
      data.map((cat) => ({
        ...cat,
        level: cat.level || 0,
      }))
    );

    setLoading(false);
  } catch (err) {
    setError("Failed to fetch categories");
    setLoading(false);
  }
};

  /* ==============================================
     FLATTEN TREE FOR TABLE DISPLAY
  ============================================== */
  const flattenTree = (nodes, level = 0, parent = null) => {
    let result = [];
    nodes.forEach((node) => {
      result.push({ ...node, level, parent });
      if (node.children && node.children.length > 0) {
        result = result.concat(
          flattenTree(node.children, level + 1, node._id)
        );
      }
    });
    return result;
  };

  /* ==============================================
     HANDLE FORM CHANGE
  ============================================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ==============================================
     SUBMIT
  ============================================== */
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      if (isEditing) {
        await api.put(
          `/categories/${editId}`,
          formData,
          config
        );
      } else {
        await api.post(
          "/categories",
          formData,
          config
        );
      }

      setSuccess(true);
      resetForm();
      fetchCategories();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
      setLoading(false);
    }
  };

  /* ==============================================
     EDIT
  ============================================== */
  const editHandler = (cat) => {
    setIsEditing(true);
    setEditId(cat._id);

    setFormData({
      name: cat.name || "",
      parent: cat.parent || "",
      description: cat.description || "",
      sortOrder: cat.sortOrder || 0,
      isActive: cat.isActive,
      seoTitle: cat.seoTitle || "",
      seoDescription: cat.seoDescription || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ==============================================
     DISABLE CATEGORY
  ============================================== */
  const deleteHandler = async (id) => {
    if (!window.confirm("Disable this category?")) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await api.delete(`/categories/${id}`, config);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  /* ==============================================
     RESET FORM
  ============================================== */
  const resetForm = () => {
    setFormData({
      name: "",
      parent: "",
      description: "",
      sortOrder: 0,
      isActive: true,
      seoTitle: "",
      seoDescription: "",
    });

    setIsEditing(false);
    setEditId(null);
  };

  return (
    <section className="admin-page">
      <h1 className="admin-title">
        {isEditing ? "Edit Category" : "Manage Categories"}
      </h1>

      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {success && (
        <Message variant="success">
          Category saved successfully!
        </Message>
      )}

      {/* ================= FORM ================= */}
      <form
        onSubmit={submitHandler}
        className="admin-form shadow-sm p-4 mb-5 bg-white rounded"
      >
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Parent Category</label>
          <select
            className="form-select"
            name="parent"
            value={formData.parent}
            onChange={handleChange}
          >
            <option value="">None (Root)</option>
            {categories
              .filter((c) => c._id !== editId)
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {"— ".repeat(cat.level)}
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Sort Order</label>
          <input
            type="number"
            className="form-control"
            name="sortOrder"
            value={formData.sortOrder}
            onChange={handleChange}
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label className="form-check-label">
            Active (Visible on Store)
          </label>
        </div>

        <hr />

        <h5>SEO Settings</h5>

        <div className="mb-3">
          <label>SEO Title</label>
          <input
            className="form-control"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>SEO Description</label>
          <textarea
            className="form-control"
            name="seoDescription"
            rows="2"
            value={formData.seoDescription}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-dark">
            {isEditing ? "Update" : "Create"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= TABLE ================= */}
      <h3>All Categories</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Sort</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>
                {"— ".repeat(cat.level)}
                {cat.name}
              </td>
              <td>/{cat.slug}</td>
              <td>{cat.sortOrder}</td>
              <td>
                {cat.isActive ? (
                  <span className="badge bg-success">Active</span>
                ) : (
                  <span className="badge bg-danger">Disabled</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => editHandler(cat)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => deleteHandler(cat._id)}
                >
                  Disable
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminCategoryScreen;