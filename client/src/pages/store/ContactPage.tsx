import React from 'react';

const Contactpage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>

      <p className="text-gray-700 mb-8 max-w-2xl">
        Have any questions about our products, orders, or delivery?  
        Our team at <span className="font-semibold">Anand Dry Fruits Store</span> is here to help you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Contact Details */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">📍 Address</h2>
            <p className="text-gray-600 mt-2">
              #Dryfruitmarket<br />
              Gujarat - 380 001<br />
              India
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800">📞 Phone</h2>
            <p className="text-gray-600 mt-2">+91 98765 43210</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800">📧 Email</h2>
            <p className="text-gray-600 mt-2">support@ananddryfruits.com</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800">🕒 Working Hours</h2>
            <p className="text-gray-600 mt-2">Mon - Sat : 9:00 AM - 7:00 PM</p>
          </div>
        </div>

        {/* Contact Form Demo */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send us a Message</h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-primary-light"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-3 border rounded-lg focus:ring focus:ring-primary-light"
            />

            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-primary-light"
            />

            <button
              type="button"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contactpage;
