// frontend/src/components/Loader.jsx
import React from 'react';
import '../styles/loader.css';

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default Loader;
