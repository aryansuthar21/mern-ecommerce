import React from "react";
import { motion } from "framer-motion";
import "../styles/refund.css";

const RefundScreen = () => {
  return (
    <div className="refund-wrapper">
      {/* HERO */}
      <div className="refund-hero">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Refund & Cancellation Policy
        </motion.h1>
        <p>Sehean – Clear & Transparent Policy</p>
      </div>

      <div className="refund-container">

        <Section
          title="1. No Return Policy"
          content="All products sold on Sehean are non-returnable. Once a product is purchased, it cannot be returned or exchanged unless it meets the conditions mentioned below."
        />

        <Section
          title="2. Damaged or Incorrect Product"
          content="If you receive a damaged or incorrect item, you must report it within 24 hours of delivery. Clear images of the product must be shared for verification."
        />

        <Section
          title="3. Resolution Process"
          content="After verification, Sehean may offer a replacement or store credit at its discretion. Cash refunds are not guaranteed unless approved."
        />

        <Section
          title="4. Order Cancellation"
          content="Orders can only be cancelled before dispatch. Once shipped, the order cannot be cancelled."
        />

        <Section
          title="5. Refund Timeline (If Approved)"
          content="If a prepaid order qualifies for refund, the amount will be processed within 7–10 business days via Razorpay to the original payment method."
        />

        <Section
          title="6. Cash on Delivery (COD)"
          content="For COD orders, refunds (if approved) will be processed via bank transfer after verification. Repeated fake COD orders may lead to restrictions."
        />

        <p className="refund-date">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, content }) => (
  <div className="refund-section">
    <h4>{title}</h4>
    <p>{content}</p>
  </div>
);

export default RefundScreen;