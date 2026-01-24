import React, { useState, useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index.css'
import './App.css'
import './styles/search.css' 

import { logout } from './store/userActions'
import SearchOverlay from './components/SearchOverlay' 


// Pages
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import LoginScreen from './pages/LoginScreen'
import RegisterScreen from './pages/RegisterScreen'
import ProfileScreen from './pages/ProfileScreen'
import CartScreen from './pages/CartScreen'
import ShippingScreen from './pages/ShippingScreen'
import PaymentScreen from './pages/PaymentScreen'
import PlaceOrderScreen from './pages/PlaceOrderScreen'
import OrderScreen from './pages/OrderScreen'
import MyOrdersScreen from './pages/MyOrdersScreen'
import ForgotPasswordScreen from './pages/ForgotPasswordScreen'
import ResetPasswordScreen from './pages/ResetPasswordScreen'
import CategoryScreen from './pages/CategoryScreen'
import CategoryPage from './pages/CategoryPage'
import WishlistScreen from './pages/WishlistScreen' // ✅ IMPORT WISHLIST

// Admin Pages
import UserListScreen from './pages/UserListScreen'
import ProductListScreen from './pages/ProductListScreen'
import ProductEditScreen from './pages/ProductEditScreen'
import OrderListScreen from './pages/OrderListScreen'
import AdminDashboard from './pages/AdminDashboard'
import AdminCategoryScreen from './pages/AdminCategoryScreen'

/* ================================
   CONSTANT HEADER SECTIONS
================================ */
const SECTIONS = ['new', 'men', 'women', 'accessories']

/* ================================
   HEADER COMPONENT
================================ */
const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // State Management
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(null)
  const [categories, setCategories] = useState([])

  const { userInfo } = useSelector((state) => state.userLogin)
  const { cartItems } = useSelector((state) => state.cart)

  // 🌙 Dark Mode
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDark
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // 🔹 Fetch categories
  useEffect(() => {
    axios.get('/api/categories').then((res) => setCategories(res.data))
  }, [])

  const logoutHandler = () => {
    dispatch(logout())
    setMenuOpen(false)
    navigate('/login')
  }

  const hideCart =
    location.pathname === '/login' || location.pathname === '/register'

  // 🔥 HELPER: Translate Section String to Database ID
  const getSectionChildren = (sectionSlug) => {
    const parentCat = categories.find((c) => c.slug === sectionSlug)
    if (!parentCat) return []
    return categories.filter((c) => c.parent === parentCat._id)
  }

  return (
    <>
      {/* ✅ SEARCH OVERLAY COMPONENT */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header className="zara-header">
        {/* Mobile Menu Backdrop */}
        <div 
          className={`zara-overlay-backdrop ${menuOpen ? 'open' : ''}`} 
          onClick={() => setMenuOpen(false)} 
        />

        <div className="zara-header-inner">
          <Link to="/" className="zara-logo">PROSHOP</Link>

          {/* DESKTOP NAV */}
          <nav className="zara-nav">
            {SECTIONS.map((section) => (
              <div key={section} className="nav-item">
                <span className="zara-nav-link">{section.toUpperCase()}</span>
                {/* Mega Menu Dropdown */}
                <div className="dropdown">
                  <div className="dropdown-inner">
                    <div>
                      <strong>Categories</strong>
                      {getSectionChildren(section).length > 0 ? (
                        getSectionChildren(section).map((cat) => (
                          <Link
                            key={cat._id}
                            to={`/products?category=${cat.slug}`} 
                          >
                            {cat.name}
                          </Link>
                        ))
                      ) : (
                        <span className="empty-msg">No items found</span>
                      )}
                    </div>
                    <div>
                      <strong>Trending</strong>
                      <Link to="/">New Arrivals</Link>
                      <Link to="/">Best Sellers</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {userInfo?.isAdmin && (
              <div className="nav-item">
                <span className="zara-nav-link">ADMIN</span>
                <div className="dropdown">
                  <div className="dropdown-inner">
                     <div>
                        <strong>Management</strong>
                        <Link to="/admin/dashboard">Dashboard</Link>
                        <Link to="/admin/productlist">Products</Link>
                        <Link to="/admin/category">Categories</Link>
                     </div>
                     <div>
                        <strong>Sales</strong>
                        <Link to="/admin/orderlist">Orders</Link>
                        <Link to="/admin/userlist">Users</Link>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* ACTIONS */}
          <div className="zara-actions">
            
            {/* 🔍 SEARCH TRIGGER */}
            <button 
              className="zara-search-trigger" 
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            {/* ❤️ WISHLIST LINK (New) */}
            <Link to="/wishlist" className="zara-icon-link" style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </Link>

           {!hideCart && (
              <Link 
                to="/cart" 
                className="zara-cart-icon" 
                style={{ position: 'relative', color: 'inherit', display: 'flex', alignItems: 'center' }}
              >
                {/* 🛍️ PREMIUM BAG ICON */}
                <svg 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>

                {/* 🔴 BADGE (Clean & Minimal) */}
                {cartItems.length > 0 && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-8px',
                      background: '#E50010', // H&M Red
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      height: '16px',
                      minWidth: '16px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      padding: '2px'
                    }}
                  >
                    {cartItems.reduce((a, i) => a + i.qty, 0)}
                  </span>
                )}
              </Link>
            )}

            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀︎' : '☾'}
            </button>

            <button className="zara-hamburger" onClick={() => setMenuOpen(true)}>☰</button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <div className={`zara-overlay ${menuOpen ? 'open' : ''}`}>
          <button className="zara-overlay-close" onClick={() => setMenuOpen(false)}>&times;</button>

          <div className="zara-overlay-nav">
            {SECTIONS.map((section) => (
              <React.Fragment key={section}>
                <button onClick={() => setOpenMobile(openMobile === section ? null : section)}>
                  {section.toUpperCase()} {openMobile === section ? '-' : '+'}
                </button>

                {openMobile === section &&
                  getSectionChildren(section).map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/products?category=${cat.slug}`}
                      onClick={() => setMenuOpen(false)}
                      style={{ fontSize: '1rem', paddingLeft: '20px', color: '#666' }}
                    >
                      {cat.name}
                    </Link>
                  ))}
              </React.Fragment>
            ))}

            {userInfo?.isAdmin && (
              <>
                <button onClick={() => setOpenMobile(openMobile === 'admin' ? null : 'admin')}>
                   ADMIN {openMobile === 'admin' ? '-' : '+'}
                </button>
                {openMobile === 'admin' && (
                   <>
                      <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                      <Link to="/admin/productlist" onClick={() => setMenuOpen(false)}>Products</Link>
                      <Link to="/admin/orderlist" onClick={() => setMenuOpen(false)}>Orders</Link>
                   </>
                )}
              </>
            )}

            <div style={{ marginTop: '20px', borderTop: '1px solid #eee' }}></div>

            {userInfo ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>
                <Link to="/myorders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                <Link to="/wishlist" onClick={() => setMenuOpen(false)}>My Wishlist</Link>
                <button onClick={logoutHandler} style={{ textAlign:'left', color: '#E50010' }}>Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

/* ================================
   PAGE WRAPPER
================================ */
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
)

/* ================================
   ROUTES
================================ */
const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginScreen /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterScreen /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><ProfileScreen /></PageWrapper>} />
        <Route path="/cart/:id?" element={<PageWrapper><CartScreen /></PageWrapper>} />
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/myorders" element={<MyOrdersScreen />} />
        <Route path="/wishlist" element={<PageWrapper><WishlistScreen /></PageWrapper>} /> {/* ✅ WISHLIST ROUTE */}
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
        <Route path="/categorypage/:token" element={<CategoryPage />}/>
        
        
        {/* ADMIN */}
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/category" element={<AdminCategoryScreen />} />

        {/* CATEGORY & SEARCH RESULTS */}
        <Route path="/products" element={<CategoryScreen />} />
      </Routes>
    </AnimatePresence>
  )
}

/* ================================
   FOOTER
================================ */
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <p>&copy; 2024 PROSHOP MERN STACK</p>
    </div>
  </footer>
)

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <AnimatedRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App