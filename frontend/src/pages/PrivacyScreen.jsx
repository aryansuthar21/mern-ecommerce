import React from 'react'
import { motion } from 'framer-motion'
import '../styles/privacy.css'

const PrivacyScreen = () => {
  return (
    <div className="privacy-wrapper">

      <div className="privacy-hero">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Privacy Policy
        </motion.h1>
        <p>Sehean – Your Privacy Matters</p>
      </div>

      <div className="privacy-container">

        <Section
          title="1. Information We Collect"
          content={`When you purchase from Sehean, we may collect your name, email address, phone number, shipping address, and billing details. Online payments are securely processed via Razorpay. We do not store your card information.`}
        />

        <Section
          title="2. How We Use Your Information"
          content={`Your information is used to process orders, deliver products, provide support, and improve our services.`}
        />

        <Section
          title="3. Cash on Delivery (COD)"
          content={`For COD orders, we collect your delivery information to complete the order process. Customers must ensure availability at delivery.`}
        />

        <Section
          title="4. Data Protection"
          content={`We implement appropriate technical measures to protect your personal information from unauthorized access or misuse.`}
        />

        <Section
          title="5. Cookies"
          content={`Our website may use cookies to enhance your browsing experience and analyze traffic.`}
        />

        <Section
          title="6. Contact Us"
          content={`For privacy-related concerns, contact us at: support@sehean.com`}
        />

        <p className="privacy-date">
          Effective Date: {new Date().toLocaleDateString()}
        </p>

      </div>
    </div>
  )
}

const Section = ({ title, content }) => (
  <div className="privacy-section">
    <h4>{title}</h4>
    <p>{content}</p>
  </div>
)

export default PrivacyScreen