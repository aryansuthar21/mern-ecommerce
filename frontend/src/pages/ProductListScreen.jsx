import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import api from '../utils/api'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../store/productActions'
import { PRODUCT_CREATE_RESET } from '../store/productReducers'

const ProductListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  
  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  const productDelete = useSelector((state) => state.productDelete)
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // ✅ New State for Import
  const [importLoading, setImportLoading] = useState(false)
  const [importMessage, setImportMessage] = useState(null)

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts())
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
  ])

  // Delete Handler
  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id))
    }
  }

  // Create Handler
  const createProductHandler = () => {
    dispatch(createProduct())
  }

  // ✅ EXCEL UPLOAD HANDLER
  const uploadExcelHandler = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setImportLoading(true)
    setImportMessage(null)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`, // Must send Admin Token
        },
      }

      const { data } = await api.post('/api/products/import', formData, config)

      setImportMessage({ variant: 'success', text: data.message })
      setImportLoading(false)
      dispatch(listProducts()) // Refresh List automatically
    } catch (error) {
      console.error(error)
      setImportMessage({ variant: 'danger', text: error.response?.data.message || 'Import Failed' })
      setImportLoading(false)
    }
  }

  return (
    <section className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <h1 className="admin-title">Products</h1>

        <div style={{ display: 'flex', gap: '10px' }}>
            {/* ✅ IMPORT EXCEL BUTTON */}
            <input
              type="file"
              id="excel-upload"
              style={{ display: 'none' }}
              accept=".xlsx, .xls"
              onChange={uploadExcelHandler}
            />
            <label 
                htmlFor="excel-upload" 
                className="admin-create-btn" 
                style={{ backgroundColor: '#28a745', cursor: 'pointer', border: 'none' }}
            >
                <i className="fas fa-file-excel" style={{ marginRight: '5px' }}></i> Import Excel
            </label>

            <button
            className="admin-create-btn"
            onClick={createProductHandler}
            >
            + Create Product
            </button>
        </div>
      </div>

      {/* STATUS MESSAGES */}
      {importLoading && <Loader />}
      {importMessage && <Message variant={importMessage.variant}>{importMessage.text}</Message>}

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {/* TABLE */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>STOCK</th> {/* Added Stock Column */}
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="muted">{product._id}</td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category?.name || 'Uncategorized'}</td>
                  <td>{product.brand}</td>
                  <td>
                      {product.countInStock === 0 ? (
                          <span style={{ color: 'red', fontWeight: 'bold' }}>Out of Stock</span>
                      ) : (
                          product.countInStock
                      )}
                  </td>
                  <td className="admin-actions">
                    <LinkContainer
                      to={`/admin/product/${product._id}/edit`}
                    >
                      <button className="admin-action-btn">
                        Edit
                      </button>
                    </LinkContainer>

                    <button
                      className="admin-action-btn danger"
                      onClick={() => deleteHandler(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default ProductListScreen