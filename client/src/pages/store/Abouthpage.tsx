import React from 'react';

const Aboutpage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
      <p className="text-gray-700 leading-relaxed">
        Welcome to Anand Dry Fruits Store, your trusted destination for premium quality dry fruits
        delivered fresh to your doorstep. We are committed to providing the finest selection of
        nuts, raisins, and healthy snacks sourced from the best farms across India.
      </p>

      <p className="text-gray-700 leading-relaxed mt-4">
        Our mission is to ensure quality, purity, and customer satisfaction. We believe healthy
        eating should be simple and accessible for everyone.
      </p>
    </div>
  );
};

export default Aboutpage;