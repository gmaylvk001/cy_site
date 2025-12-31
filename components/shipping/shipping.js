"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FiTruck, FiCalendar, FiMail, FiPhone } from 'react-icons/fi';
import { MdOutlineLocalShipping } from "react-icons/md";

const ShippingPolicy = () => {
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  return (
    <div>
      {/* Header Bar */}
      <div className="bg-green-50 py-6 px-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Shipping & Delivery Policy</h2>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
          <span className="text-gray-500">›</span>
          <span className="text-green-600 font-semibold">Shipping Policy</span>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-9xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiTruck className="text-blue-600 text-3xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Shipping & Delivery Policy</h1>
            {currentDate && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Last updated: {currentDate}
              </p>
            )}
          </div>

          {/* Policy Content */}
          <div className="rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Shipping Methods */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-green-500 mb-4 flex items-center gap-2">
                <MdOutlineLocalShipping className="text-green-500" /> Shipping and handling costs
              </h2>
              <p className="text-gray-600 mb-4">Domestic Orders: Free shipping across selected Pin Codes.</p>
            </div>

            {/* Delivery Timeline */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
                <h3 className="text-xl font-semibold text-green-500 mb-3 flex items-center gap-2">
                    <FiCalendar className="text-2xl text-green-500" />Time to deliver
                </h3>
                <p className="text-gray-600">Delivery time usually varies depending on the destination; however, we do our best to ensure that the order is delivered on time.</p>
                <p className="text-gray-600">Delivery time for domestic orders: It takes 1 to 6 business days from the order confirmation day to deliver the goods within India as delivery is not delayed due to a government authority or any other entity acting on the name of the government or acting according to the directions of the government. In the unlikely event that the delivery time exceeds the stipulated time, the order is canceled and the customer is notified. In such cases, the refund is made directly to the customer’s bank account using the same mode in which the payment was made. Cycle world with reputable agencies to ensure fast and safe delivery. Since product delivery is address-specific, please make sure the address entered when ordering is correct.</p>
                <p>Important Note: In case of office address is provided for delivery, please make sure department details, employee numbers, and direct landline numbers are also provided to avoid last-minute hassle and failed delivery.</p>
                <p className="text-gray-600">To avoid misdelivery, please keep one of the following identity cards for verification:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li className="animate-fade-in-right delay-200">Pan card</li>
                    <li className="animate-fade-in-right delay-200">Driver’s license</li>
                    <li className="animate-fade-in-right delay-200">passport</li>
                    <li className="animate-fade-in-right delay-200">Voter identification card</li>
                    <li className="animate-fade-in-right delay-200">Unique identification card (Aadhaar)</li>
                </ul>
                <p className="text-gray-600">For information about how to contact us, please visit our <a href="/contact" className="hover:text-green-700 text-green-500">contact page.</a></p>
            </div>

            {/* Delivery Address */}
            <div className="p-1">
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="tel:8152908888" 
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  <FiPhone /> 8152908888
                </a>
                <a 
                  href="mailto:info@cycleworld.in" 
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  <FiMail /> info@cycleworld.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;