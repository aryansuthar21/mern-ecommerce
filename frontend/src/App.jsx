import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../src/utils/api";
import { motion, AnimatePresence } from "framer-motion";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import "./App.css";
import "./styles/search.css";

import { logout } from "./store/userActions";
import { listCategoryTree } from './store/categoryActions'
import SearchOverlay from "./components/SearchOverlay";

// Pages
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import ProfileScreen from "./pages/ProfileScreen";
import CartScreen from "./pages/CartScreen";
import ShippingScreen from "./pages/ShippingScreen";
import PaymentScreen from "./pages/PaymentScreen";
import PlaceOrderScreen from "./pages/PlaceOrderScreen";
import OrderScreen from "./pages/OrderScreen";
import MyOrdersScreen from "./pages/MyOrdersScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import ResetPasswordScreen from "./pages/ResetPasswordScreen";
import CategoryScreen from "./pages/CategoryScreen";
import CategoryPage from "./pages/CategoryPage";
import WishlistScreen from "./pages/WishlistScreen"; // ✅ IMPORT WISHLIST
import PrivacyScreen from "./pages/PrivacyScreen"; 
import TermsScreen from "./pages/TermsScreen";
import RefundScreen from "./pages/RefundScreen";
import Shippingpolicy from "./pages/Shippingpolicy";

// Admin Pages
import UserListScreen from "./pages/UserListScreen";
import ProductListScreen from "./pages/ProductListScreen";
import ProductEditScreen from "./pages/ProductEditScreen";
import OrderListScreen from "./pages/OrderListScreen";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCategoryScreen from "./pages/AdminCategoryScreen";
import AdminReviewPage from './pages/AdminReviewPage'

/* ================================
   CONSTANT HEADER SECTIONS
================================ */
const SECTIONS = ["new", "men", "women", "accessories"];

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.userLogin);
  const { cartItems } = useSelector((state) => state.cart);
  const { tree } = useSelector((state) => state.categoryTree);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState(null);

  /* ================= DARK MODE ================= */
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme")
      ? localStorage.getItem("theme") === "dark"
      : prefersDark
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const logoutHandler = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/login");
  };

  const hideCart =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header className="zara-header">
        <div
          className={`zara-overlay-backdrop ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(false)}
        />

        <div className="zara-header-inner">
          <Link to="/" className="zara-logo">
            PROSHOP
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="zara-nav">
            {tree &&
              tree.map((section) => (
                <div key={section._id} className="nav-item">
                  <span className="zara-nav-link">
                    {section.name.toUpperCase()}
                  </span>

                  <div className="dropdown">
                    <div className="dropdown-inner">
                      <div>
                        <strong>Categories</strong>

                        {section.children &&
                        section.children.length > 0 ? (
                          section.children.map((sub) => (
                            <Link
                              key={sub._id}
                              to={`/category/${sub.slug}`}
                            >
                              {sub.name}
                            </Link>
                          ))
                        ) : (
                          <span className="empty-msg">
                            No items found
                          </span>
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

          {/* ================= ACTIONS ================= */}
          <div className="zara-actions">
            {/* SEARCH */}
            <button
              className="zara-search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              🔍
            </button>

            {/* WISHLIST */}
            <Link to="/wishlist" className="zara-icon-link">
              ❤️
            </Link>

            {!hideCart && (
              <Link to="/cart" className="zara-cart-icon">
                🛍
                {cartItems.length > 0 && (
                  <span className="cart-badge">
                    {cartItems.reduce((a, i) => a + i.qty, 0)}
                  </span>
                )}
              </Link>
            )}

            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀︎" : "☾"}
            </button>

            <button
              className="zara-hamburger"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* ================= MOBILE DRAWER ================= */}
        <div className={`zara-overlay ${menuOpen ? "open" : ""}`}>
          <button
            className="zara-overlay-close"
            onClick={() => setMenuOpen(false)}
          >
            &times;
          </button>

          <div className="zara-overlay-nav">
            {tree &&
              tree.map((section) => (
                <React.Fragment key={section._id}>
                  <button
                    onClick={() =>
                      setOpenMobile(
                        openMobile === section._id
                          ? null
                          : section._id
                      )
                    }
                  >
                    {section.name.toUpperCase()}{" "}
                    {openMobile === section._id ? "-" : "+"}
                  </button>

                  {openMobile === section._id &&
                    section.children?.map((sub) => (
                      <Link
                        key={sub._id}
                       to={`/category/${sub.slug}`}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          fontSize: "1rem",
                          paddingLeft: "20px",
                          color: "#666",
                        }}
                      >
                        {sub.name}
                      </Link>
                    ))}
                </React.Fragment>
              ))}

            <div style={{ marginTop: "20px", borderTop: "1px solid #eee" }} />

            {userInfo ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  My Profile
                </Link>
                <Link to="/myorders" onClick={() => setMenuOpen(false)}>
                  My Orders
                </Link>
                <button
                  onClick={logoutHandler}
                  style={{ textAlign: "left", color: "#E50010" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
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
);

/* ================================
   ROUTES
================================ */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PageWrapper>
              <ProductPage />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <LoginScreen />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <RegisterScreen />
            </PageWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <PageWrapper>
              <ProfileScreen />
            </PageWrapper>
          }
        />
        <Route
          path="/cart/:id?"
          element={
            <PageWrapper>
              <CartScreen />
            </PageWrapper>
          }
        />
        <Route
         path="/privacy"
         element={
         <PageWrapper>
         <PrivacyScreen />
        </PageWrapper>
          }
        />
        <Route
  path="/terms"
  element={
    <PageWrapper>
      <TermsScreen />
    </PageWrapper>
  }
/>
<Route
  path="/refund-policy"
  element={
    <PageWrapper>
      <RefundScreen />
    </PageWrapper>
  }
/>
<Route
  path="/shipping-policy"
  element={
    <PageWrapper>
      <Shippingpolicy />
    </PageWrapper>
  }
/>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/myorders" element={<MyOrdersScreen />} />
        <Route
          path="/wishlist"
          element={
            <PageWrapper>
              <WishlistScreen />
            </PageWrapper>
          }
        />{" "}
        {/* ✅ WISHLIST ROUTE */}
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordScreen />}
        />
        <Route path="/category/:slug" element={<CategoryPage />} />
        {/* ADMIN */}
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/category" element={<AdminCategoryScreen />} />
        <Route path="/admin/reviews" element={<AdminReviewPage />} />
        {/* CATEGORY & SEARCH RESULTS */}
        <Route path="/products" element={<CategoryScreen />} />
      </Routes>
    </AnimatePresence>
  );
};

/* ================================
   FOOTER
================================ */
const Footer = () => (
  <footer className="footer" style={{ padding: "40px 0" }}>
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      {/* Brand */}
      <div>
        <h5 style={{ fontWeight: "600" }}>SEHEAN</h5>
        <p style={{ fontSize: "14px", opacity: "0.7" }}>
          Premium Fashion for Everyday Confidence.
        </p>
      </div>

      {/* Legal Links */}
      <div>
        <h6 style={{ fontWeight: "600", marginBottom: "10px" }}>Legal</h6>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <Link to="/privacy" style={{ textDecoration: "none", color: "inherit" }}>
            Privacy Policy
          </Link>
          <Link to="/terms" style={{ textDecoration: "none", color: "inherit" }}>
            Terms & Conditions
          </Link>
          <Link to="/refund-policy" style={{ textDecoration: "none", color: "inherit" }}>
            Refund Policy
          </Link>
          <Link to="/shipping-policy" style={{ textDecoration: "none", color: "inherit" }}>
            Shipping Policy
          </Link>
        </div>
      </div>
    </div>

    <div style={{ textAlign: "center", marginTop: "30px", opacity: "0.6" }}>
      &copy; {new Date().getFullYear()} SEHEAN. All rights reserved.
    </div>
  </footer>
);
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listCategoryTree());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <main className="main-content">
        <AnimatedRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
