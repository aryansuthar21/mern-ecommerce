import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'

const AdminCategoryScreen = () => {
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  const { userInfo } = useSelector((state) => state.userLogin)

  // 1. Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/categories')
      setCategories(data)
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // 2. Reset form
  const resetForm = () => {
    setName('')
    setParentId('')
    setIsEditing(false)
    setEditId(null)
    // Don't reset success here or it disappears too fast
  }

  // 3. Add / Update category
  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }

      if (isEditing) {
        await axios.put(
          `/api/categories/${editId}`,
          { name, parent: parentId || null },
          config
        )
      } else {
        await axios.post(
          '/api/categories',
          { name, parent: parentId || null },
          config
        )
      }

      setSuccess(true)
      resetForm()
      fetchCategories()
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed')
      setLoading(false)
    }
  }

  // 4. Delete category
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure? Deleting a parent category will make its children "Root" categories.')) {
      try {
        setLoading(true)
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
        await axios.delete(`/api/categories/${id}`, config)
        fetchCategories()
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || 'Delete failed')
        setLoading(false)
      }
    }
  }

  // 5. Edit mode toggle
  const editHandler = (category) => {
    setIsEditing(true)
    setEditId(category._id)
    setName(category.name)
    // Extract ID whether it's populated or just a string
    setParentId(category.parent?._id || category.parent || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="admin-page">
      <h1 className="admin-title">{isEditing ? 'Edit Category' : 'Manage Categories'}</h1>

      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">Category successfully saved!</Message>}

      <form onSubmit={submitHandler} className="admin-form shadow-sm p-4 mb-5 bg-white rounded">
        <div className="form-group mb-3">
          <label className="form-label">Category Name</label>
          <input
            className="form-control"
            placeholder="e.g. Shirts, Jeans, Dresses..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-4">
          <label className="form-label">Parent Department (Select "None" to create a main link)</label>
          <select 
            className="form-select" 
            value={parentId} 
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="">None (Main Category)</option>
            {categories
              .filter((c) => !c.parent && c._id !== editId) // 🛡️ Prevent self-parenting
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className="admin-actions d-flex gap-2">
          <button type="submit" className="admin-btn btn btn-dark" disabled={loading}>
            {isEditing ? 'Update Category' : 'Create Category'}
          </button>

          {isEditing && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <hr />

      <h2 className="mt-4 mb-3">Existing Collections</h2>

      <div className="table-responsive">
        <table className="admin-table table table-hover">
          <thead className="table-light">
            <tr>
              <th>NAME</th>
              <th>PARENT DEPT</th>
              <th>SLUG</th>
              <th className="text-end">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td className="fw-bold">{cat.name}</td>
                <td>
                  {cat.parent ? (
                    <span className="badge bg-info text-dark">
                      {cat.parent.name || 'Sub-category'}
                    </span>
                  ) : (
                    <span className="badge bg-secondary">Main Dept</span>
                  )}
                </td>
                <td className="text-muted small">/{cat.slug}</td>
                <td className="text-end">
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
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminCategoryScreen