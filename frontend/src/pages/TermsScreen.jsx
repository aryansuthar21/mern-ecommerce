import React from "react";
import { motion } from "framer-motion";
import "../styles/terms.css";

const TermsScreen = () => {
  return (
    <div className="terms-wrapper">
      {/* HERO */}
      <div className="terms-hero">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Terms & Conditions
        </motion.h1>
        <p>Sehean – Please Read Carefully</p>
      </div>

      <div className="terms-container">

        <Section
          title="1. Introduction"
          content="By accessing and using Sehean, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please do not use our website."
        />

        <Section
          title="2. Products"
          content="Sehean sells clothing items only. Product images are for representation purposes. Slight variations in color or fit may occur."
        />

        <Section
          title="3. Pricing & Payments"
          content="All prices are listed in INR. Payments are securely processed through Razorpay. We reserve the right to change prices without prior notice."
        />

        <Section
          title="4. Cash on Delivery (COD)"
          content="COD is available. Customers must ensure availability at delivery. Repeated failed COD orders may result in restriction from future purchases."
        />

        <Section
          title="5. No Return Policy"
          content="All sales are final. Sehean does not accept returns or exchanges unless the product received is damaged or incorrect."
        />

        <Section
          title="6. Order Cancellation"
          content="Orders can only be cancelled before dispatch. Once shipped, orders cannot be cancelled."
        />

        <Section
          title="7. Limitation of Liability"
          content="Sehean shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products."
        />

        <Section
          title="8. Governing Law"
          content="These Terms & Conditions are governed by the laws of India."
        />

        <p className="terms-date">
          Effective Date: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, content }) => (
  <div className="terms-section">
    <h4>{title}</h4>
    <p>{content}</p>
  </div>
);

export default TermsScreen;