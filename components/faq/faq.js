"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FaTruck,FaShoppingCart, FaCreditCard, FaGavel,  FaUserCircle, FaComments  } from "react-icons/fa";
import { FiFileText, FiBook, FiShield, FiMail, FiLink, FiCreditCard  } from 'react-icons/fi';
import { MdOutlinePolicy, MdOutlineSecurity } from "react-icons/md";

const TermsAndConditions = ({faqs = null}) => {
    const [currentDate, setCurrentDate] = useState('');
    
    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
        }));
    }, []);

        const defaultFaqs = [
            {
                q: "ORDER INFORMATION",
                a: "All in-stock, non-preorders will be filled within 7-10 business days of being placed (not including weekends or holidays). Orders are packed and shipped in Conyers, GA. Shipments are made via trackable service. You will receive an email with tracking information as soon as your order is headed your way.Please allow 1 day for tracking information to update on your order. If you are unable to track your order, please let us know and we’ll be happy to assist.",
            },
            {
                q: "DO I NEED TO CREATE CYCLEWORLD ACCOUNT TO PLACE AN ORDER?",
                a: "You do not need to create an account to make a purchase. However, we recommend that you set up a CycleWorld account to enjoy the benefits of managing your account which includes saving and organising your payment and address details, reviewing your order history and gaining access to create your own personal wish list.",
            },
            {
                q: "WHAT PAYMENT TYPES DOES CYCLEWORLD ACCEPT?",
                a: "We accept Visa, MasterCard, and American Express in our checkout. We don’t support Cash On Delivery.We have an EMI option with Shopse-EMI",
            },
            {
                q: "IS IT SAFE TO USE MY CREDIT CARD?",
                a: "The security of your details is of top priority to us. To ensure that your shopping experience is safe, simple and secure,uses Secure Socket Layer (SSL) technology to protect the data you send to us over the internet. All credit card transactions on this site are processed using Razorpay, a secure online payment gateway which encrypts your card details in a secure host environment.",
            },
            {
                q: "IS MY PERSONAL INFORMATION KEPT PRIVATE?",
                a: "We will treat all the information you share with us as private and confidential. At no point will we share, rent or sell your personal information without your consent. For further details, please read the CycleWorld’s Privacy Policy.In order to register with CycleWorld, you are required to let us know your name and email address. To place an order we will also require your billing address, delivery address, telephone number, credit card number, expiration date and the CVV number. If necessary these details may be used to verify and validate your order. We may use your contact details to keep you informed of our latest collections and Cycleworld events.",
            },
            {
                q: "CAN I AMEND MY DELIVERY ADDRESS ONCE THE ORDER HAS BEEN PLACED?",
                a: "Unfortunately, once your order has been placed we are unable to change your shipping details but may be able to assist you to cancel and replace the order.",
            },
        ];

    const items = faqs && faqs.length ? faqs : defaultFaqs;

  // Open one item at a time
  const [openIndex, setOpenIndex] = useState(null);

  function toggleIndex(i) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

    return (
        <div>
            {/* Header Bar */}
            <div className="bg-green-50 py-6 px-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">FAQ</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/" className="text-gray-600 hover:text-red-600">🏠 Home</Link>
                    <span className="text-gray-500">›</span>
                    <span className="text-green-600 font-semibold">Faq</span>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="container mx-auto px-8 py-12 text-gray-800 leading-relaxed">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">FAQ</h1>
                <div className="max-w-3xl mx-auto space-y-6 mb-8">
                    {items.map((item, i) => {
                    const isOpen = openIndex === i;

                    return (
                        <div
                        key={i}
                        className="border rounded-lg overflow-hidden bg-white shadow-sm"
                        >
                        {/* Question */}
                        <button
                            onClick={() => toggleIndex(i)}
                            aria-expanded={isOpen}
                            className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                            <div>
                            <div className="text-gray-900 font-semibold text-lg">
                                {item.q}
                            </div>
                            </div>

                            {/* Chevron icon */}
                            <div
                            className={`transform transition-transform duration-200 ${
                                isOpen ? "rotate-180" : "rotate-0"
                            }`}
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                                />
                            </svg>
                            </div>
                        </button>

                        {/* Answer Panel */}
                        <div
                            className={`px-5 pb-4 transition-all duration-200 ${
                            isOpen ? "block" : "hidden"
                            }`}
                        >
                            <div className="mt-1 text-gray-700 leading-relaxed bg-gray-50 p-4 rounded">
                            {item.a}
                            </div>
                        </div>
                        </div>
                    );
                    })}
                    <p>Still Have A Questions?</p>

                    <p>We will be happy to answer any questions you may have.</p>
                        
                          <p><a href="contact" className="text-green-600 font-semibold">Contact</a></p>
                    <p className="text-sm text-gray-500 mt-8"><em>Last updated on: {currentDate}</em></p>
                </div>
                
            </div>
        </div>
    );
};

export default TermsAndConditions;