import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import { listProducts } from "../store/productActions";
import Hero from "../components/Hero";
import Loader from "../components/Loader";
import Message from "../components/Message";

const CategoryPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { tree } = useSelector((state) => state.categoryTree);
  const productList = useSelector((state) => state.productList);

  const { loading, error, products } = productList;

  /* ================= FIND CATEGORY FROM TREE ================= */
  const findCategoryBySlug = (nodes, slugToFind) => {
    for (const node of nodes) {
      if (node.slug === slugToFind) return node;

      if (node.children && node.children.length > 0) {
        const found = findCategoryBySlug(node.children, slugToFind);
        if (found) return found;
      }
    }
    return null;
  };

  const categoryData = useMemo(() => {
    if (!tree || !slug) return null;
    return findCategoryBySlug(tree, slug);
  }, [tree, slug]);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    if (slug) {
      dispatch(listProducts(slug));
    }
  }, [dispatch, slug]);

  /* ================= SEO TITLE ================= */
  useEffect(() => {
    if (categoryData?.seoTitle) {
      document.title = categoryData.seoTitle;
    } else if (categoryData?.name) {
      document.title = `${categoryData.name} | SEHEAN`;
    }
  }, [categoryData]);

  if (!categoryData) {
    return (
      <Container className="py-5">
        <Message variant="danger">
          Category not found.
        </Message>
      </Container>
    );
  }

  return (
    <div className="category-page-wrapper">
      <Hero
        title={categoryData.name}
        subtitle={
          categoryData.description ||
          "Explore our latest collection"
        }
        image={
          categoryData.bannerImage ||
          "/banners/default.jpg"
        }
        ctaText="Shop Now"
        ctaLink={`/products?category=${slug}`}
      />

      <Container>
        <div className="section-header mt-5 mb-4">
          <h1 className="page-title">
            {categoryData.name}
          </h1>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="product-list">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))
            ) : (
              <div className="text-center py-5">
                <Message variant="info">
                  No products found in this category.
                </Message>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default CategoryPage;