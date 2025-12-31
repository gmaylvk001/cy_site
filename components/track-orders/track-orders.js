"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FiShield, FiLock, FiMail, FiCookie } from 'react-icons/fi';
import { FaCookieBite } from 'react-icons/fa';
import { IoIosInformationCircle } from "react-icons/io";
import { MdOutlineSecurity } from "react-icons/md";
import { MdPolicy } from "react-icons/md";
import { MdOutlineCollectionsBookmark } from "react-icons/md";


const LebdingPartners = () => {
    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
    }, []);
    const [form, setForm] = useState({
    orderId: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.orderId.trim()) {
      newErrors.orderId = "Order ID is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Billing email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // ✅ API call can go here
    console.log("Tracking order:", form);
  };

  return (
<div>
            {/* 🟠 About us Header Bar */}
            <div className="bg-green-50 py-6 px-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Track Orders</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
                    <span className="text-gray-500">›</span>
                    <span className="text-green-600 font-semibold">Track Orders</span>
                </div>
            </div>
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          
          <h2 className="text-2xl font-semibold text-center mb-4">
            Track Order
          </h2>

          <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
            To track your order please enter your Order ID in the box below and
            press the “Track” button. This was given to you on your receipt and
            in the confirmation email you should have received.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Order ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="orderId"
                value={form.orderId}
                onChange={handleChange}
                placeholder="Found in your order confirmation email."
                className={`w-full bg-gray-100 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1
                  ${errors.orderId
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-green-500"
                  }`}
              />
              {errors.orderId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.orderId}
                </p>
              )}
            </div>

            {/* Billing Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email you used during checkout."
                className={`w-full bg-gray-100 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1
                  ${errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-200 focus:ring-green-500"
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="mt-4 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-2 rounded"
            >
              Track
            </button>

          </form>
        </div>
      </div>
    </div>
    </div>
  );
};
export default LebdingPartners;