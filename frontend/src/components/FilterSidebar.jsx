import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/filter.css";

const FilterSidebar = ({ filters, setFilters, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { tree } = useSelector((state) => state.categoryTree);

  /* ================= PRICE LOCAL STATE ================= */
  const [localPrice, setLocalPrice] = useState({
    min: filters.minPrice,
    max: filters.maxPrice,
  });

  /* ================= URL PARAM ================= */
  const query = new URLSearchParams(location.search);
  const activeCategory = query.get("category");

  /* ================= HANDLERS ================= */

  const handlePriceApply = () => {
    setFilters({
      ...filters,
      minPrice: localPrice.min,
      maxPrice: localPrice.max,
    });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value });
  };

  const handleCategoryClick = (slug) => {
    navigate(`/products?category=${slug}`);
    onClose();
  };

  const clearAll = () => {
    const reset = { sort: "newest", minPrice: "", maxPrice: "" };
    setLocalPrice({ min: "", max: "" });
    setFilters(reset);
    navigate("/products");
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`filter-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <aside className={`filter-sidebar ${isOpen ? "open" : ""}`}>
        <div className="filter-header-mobile">
          <h3>Filter & Sort</h3>
          <button onClick={onClose}>&times;</button>
        </div>

        {/* ================= CATEGORIES ================= */}
        <div className="filter-group">
          <span className="filter-title">Categories</span>

          {!tree || tree.length === 0 ? (
            <p className="no-items">No categories available</p>
          ) : (
            tree.map((section) => (
              <div key={section._id} className="category-block">
                <p className="category-parent">{section.name}</p>

                {section.children &&
                  section.children.map((sub) => (
                    <button
                      key={sub._id}
                      className={`category-link ${
                        activeCategory === sub.slug ? "active" : ""
                      }`}
                      onClick={() => handleCategoryClick(sub.slug)}
                    >
                      {sub.name}
                    </button>
                  ))}
              </div>
            ))
          )}
        </div>

        {/* ================= SORT ================= */}
        <div className="filter-group">
          <span className="filter-title">Sort By</span>

          <label className="radio-container">
            Newest Arrivals
            <input
              type="radio"
              name="sort"
              value="newest"
              checked={filters.sort === "newest"}
              onChange={handleSortChange}
            />
            <span className="radio-checkmark"></span>
          </label>

          <label className="radio-container">
            Price: Low to High
            <input
              type="radio"
              name="sort"
              value="price-asc"
              checked={filters.sort === "price-asc"}
              onChange={handleSortChange}
            />
            <span className="radio-checkmark"></span>
          </label>

          <label className="radio-container">
            Price: High to Low
            <input
              type="radio"
              name="sort"
              value="price-desc"
              checked={filters.sort === "price-desc"}
              onChange={handleSortChange}
            />
            <span className="radio-checkmark"></span>
          </label>
        </div>

        {/* ================= PRICE ================= */}
        <div className="filter-group">
          <span className="filter-title">Price Range</span>

          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={localPrice.min}
              onChange={(e) =>
                setLocalPrice({ ...localPrice, min: e.target.value })
              }
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={localPrice.max}
              onChange={(e) =>
                setLocalPrice({ ...localPrice, max: e.target.value })
              }
            />
          </div>

          <button className="btn-apply" onClick={handlePriceApply}>
            APPLY
          </button>
        </div>

        {/* ================= CLEAR ================= */}
        <button className="btn-clear" onClick={clearAll}>
          Clear All Filters
        </button>
      </aside>
    </>
  );
};

export default FilterSidebar;