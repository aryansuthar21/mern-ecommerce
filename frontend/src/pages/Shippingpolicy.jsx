import React from "react";
import { motion } from "framer-motion";
import "../styles/shipping.css";

const Shippingpolicy = () => {
  return (
    <div className="shipping-wrapper">
      {/* HERO */}
      <div className="shipping-hero">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Shipping Policy
        </motion.h1>
        <p>Sehean – Fast & Reliable Delivery</p>
      </div>

      <div className="shipping-container">

        <Section
          title="1. Shipping Partner"
          content="Sehean ships all orders through Shiprocket and its network of trusted courier partners across India."
        />

        <Section
          title="2. Order Processing Time"
          content="Orders are processed within 1–3 business days after payment confirmation. Orders placed on weekends or public holidays may be processed on the next working day."
        />

        <Section
          title="3. Delivery Time"
          content="Estimated delivery timelines:
          • Metro Cities: 3–5 business days
          • Other Locations: 5–8 business days
          Delivery times may vary depending on location and courier availability."
        />

        <Section
          title="4. Shipping Charges"
          content="Shipping charges (if applicable) will be displayed at checkout before payment confirmation."
        />

        <Section
          title="5. Tracking Orders"
          content="Once your order is shipped, tracking details will be shared via SMS or email. You can track your shipment through the courier partner provided by Shiprocket."
        />

        <Section
          title="6. Delays & Issues"
          content="Delivery delays due to weather conditions, courier issues, or unforeseen circumstances are beyond Sehean’s control. However, we will assist you in resolving shipment-related concerns."
        />

        <Section
          title="7. Failed Delivery (COD)"
          content="For Cash on Delivery (COD) orders, customers must ensure availability at delivery time. Repeated failed deliveries may result in restriction from future COD orders."
        />

        <p className="shipping-date">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, content }) => (
  <div className="shipping-section">
    <h4>{title}</h4>
    <p>{content}</p>
  </div>
);

export default Shippingpolicy;