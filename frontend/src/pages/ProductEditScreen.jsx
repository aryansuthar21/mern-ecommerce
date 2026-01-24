import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Table,
  InputGroup,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, updateProduct } from '../store/productActions'
import { PRODUCT_UPDATE_RESET } from '../store/productReducers'
import axios from 'axios'

const ProductEditScreen = () => {
  const { id: productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ================= STATE =================
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [uploading, setUploading] = useState(false)

  const [categories, setCategories] = useState([])
  const [selectedParent, setSelectedParent] = useState('')
  const [category, setCategory] = useState('')

  const [variants, setVariants] = useState([])

  // ================= REDUX =================
  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } =
    productUpdate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }

        const { data } = await axios.get('/api/categories', config)
        setCategories(data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }

    if (userInfo && userInfo.isAdmin) {
      fetchCategories()
    }
  }, [userInfo])

  // ================= LOAD PRODUCT =================
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      navigate('/admin/productlist')
    } else {
      if (!product || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setDescription(product.description)

        setVariants(product.variants || [])

        const total =
          product.variants?.reduce(
            (acc, item) => acc + Number(item.countInStock || 0),
            0
          ) || product.countInStock

        setCountInStock(total)

        // ✅ category can be populated object or id
        const catId =
          typeof product.category === 'object'
            ? product.category?._id
            : product.category

        setCategory(catId || '')

        // find parent
        if (categories.length && catId) {
          const full = categories.find((c) => c._id === catId)

          if (full?.parent) {
            setSelectedParent(
              typeof full.parent === 'object' ? full.parent._id : full.parent
            )
          }
        }
      }
    }
  }, [
    dispatch,
    product,
    productId,
    successUpdate,
    navigate,
    categories,
  ])

  // ================= VARIANTS =================
  const addVariantHandler = () => {
    setVariants([...variants, { size: '', color: '', countInStock: 0 }])
  }

  const removeVariantHandler = (index) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants]
    newVariants[index][field] = value
    setVariants(newVariants)

    if (field === 'countInStock') {
      const total = newVariants.reduce(
        (acc, item) => acc + Number(item.countInStock || 0),
        0
      )
      setCountInStock(total)
    }
  }

  // ================= IMAGE UPLOAD =================
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  // ================= SUBMIT =================
  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        variants,
      })
    )
  }

  // ================= UI =================
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold mb-0">Edit Product</h1>
          <p className="text-muted small mb-0">
            Manage pricing, inventory, and details
          </p>
        </div>
        <Link to="/admin/productlist" className="btn btn-outline-secondary">
          Go Back
        </Link>
      </div>

      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Row>
            {/* LEFT */}
            <Col lg={8}>
              <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                  <Form.Group controlId="name" className="mb-3">
                    <Form.Label className="fw-bold small text-uppercase">
                      Product Name
                    </Form.Label>
                    <Form.Control
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="description">
                    <Form.Label className="fw-bold small text-uppercase">
                      Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* VARIANTS */}
              <Card className="mb-4 shadow-sm border-0">
                <Card.Header className="bg-transparent fw-bold">
                  Inventory & Variants
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Color</th>
                        <th>Stock</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v, i) => (
                        <tr key={i}>
                          <td>
                            <Form.Control
                              value={v.size}
                              onChange={(e) =>
                                handleVariantChange(i, 'size', e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <Form.Control
                              value={v.color}
                              onChange={(e) =>
                                handleVariantChange(i, 'color', e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              value={v.countInStock}
                              onChange={(e) =>
                                handleVariantChange(
                                  i,
                                  'countInStock',
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeVariantHandler(i)}
                            >
                              ×
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={addVariantHandler}
                  >
                    + Add Variant
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* RIGHT */}
            <Col lg={4}>
              <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">
                      Total Stock
                    </Form.Label>
                    <Form.Control value={countInStock} readOnly />
                  </Form.Group>

                  <Button type="submit" className="w-100">
                    Save Changes
                  </Button>
                </Card.Body>
              </Card>

              <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Price</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>₹</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Card.Body>
              </Card>

              <Card className="mb-4 shadow-sm border-0">
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label className="small">Brand</Form.Label>
                    <Form.Control
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small">Department</Form.Label>
                    <Form.Select
                      value={selectedParent}
                      onChange={(e) => {
                        setSelectedParent(e.target.value)
                        setCategory('')
                      }}
                    >
                      <option value="">Select</option>
                      {categories
                        .filter((c) => !c.parent)
                        .map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="small">Category</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={!selectedParent}
                    >
                      <option value="">Select</option>
                      {categories
                        .filter(
                          (c) =>
                            c.parent === selectedParent ||
                            c.parent?._id === selectedParent
                        )
                        .map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Card.Body>
              </Card>

              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Form.Group>
                    <Form.Label className="small">Image</Form.Label>
                    <Form.Control
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="mb-2"
                    />
                    <Form.Control type="file" onChange={uploadFileHandler} />
                    {uploading && <Loader />}
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  )
}

export default ProductEditScreen
