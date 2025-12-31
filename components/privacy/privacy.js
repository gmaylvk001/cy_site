"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FiShield, FiLock, FiMail, FiCookie } from 'react-icons/fi';
import { FaCookieBite } from 'react-icons/fa';
import { IoIosInformationCircle } from "react-icons/io";
import { MdOutlineSecurity } from "react-icons/md";
import { MdPolicy } from "react-icons/md";
import { MdOutlineCollectionsBookmark } from "react-icons/md";


const PrivacyPolicy = () => {
    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
    }, []);
    return (
        <div>
            {/* 🟠 About us Header Bar */}
            <div className="bg-green-50 py-6 px-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Privacy Policy</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
                    <span className="text-gray-500">›</span>
                    <span className="text-green-600 font-semibold">Privacy policy</span>
                </div>
            </div>
            <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
                 <div className="max-w-9xl mx-auto ">
                    {/* Header Section */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><FiShield className="text-blue-600 text-3xl" /></div>
                        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Privacy Policy</h1>
                        {currentDate && (
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Last updated: {currentDate}</p>
                        )}
                    </div>

                    {/* Policy Content */}
                    <div className=" rounded-xl shadow-md overflow-hidden animate-fade-in-up delay-100  bg-gradient-to-br from-blue-50 to-indigo-50">
                        {/* Introduction */}
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-green-500 mb-4 flex items-center gap-2">
                                <FiLock className="text-green-500" />Your Privacy Matters
                            </h2>
                            <p className="text-gray-600 mb-4">The privacy of your personal information is very important to us. We do not disclose your personal information to third parties for their marketing purposes without your explicit consent. Read this privacy policy to learn more about the ways in which we use and protect your personal information. The privacy practices of this statement apply to our services available under the domain and sub-domains of www.cycleworld.in and apply generally to our parent, affiliates, subsidiaries of our website and our subsidiaries/franchisees. By logging in to the portal, you agree to be bound by the terms and conditions of this privacy policy. This privacy policy describes the information, as part of the normal operation of our services; we collect from you and what may happen to that information.</p>
                            <p className="text-gray-600">By accepting the Privacy Policy and the User Agreement at registration, you expressly consent to </p>
                            <p className="text-gray-600 mb-4">(i) be bound by the terms and conditions of this Privacy Policy and User Agreement; and</p>
                            <p className="text-gray-600 mb-4"> (ii) our use and disclosure of your personal information in accordance with this Privacy Policy.</p>
                        </div>

                        {/* YOUR PRIVACY – OUR COMMITMENT */}
                        <div className="p-8 border-b border-gray-100 bg-blue-50/30">
                            <h3 className="text-xl font-semibold text-green-500 mb-3 flex items-center gap-2"><MdPolicy className="text-2xl text-green-500" />YOUR PRIVACY – OUR COMMITMENT</h3>
                            <p className="text-gray-600">At Cycleworld.com, we are extremely proud of our commitment to protect your privacy and the personal information you disclose on the Site. We value your trust in us. Please read the following policy to understand how your personal information will be treated as you make full use of our portal.</p>
                        </div>

                        {/* CYCLEWORLD’S PRIVACY GUARANTEE */}
                        <div className="p-8 border-b border-gray-100 bg-blue-50/30">
                            <h3 className="text-xl font-semibold text-green-500 mb-3 flex items-center gap-2">CYCLEWORLD’S PRIVACY GUARANTEE</h3>
                            <p className="text-gray-600">At Cycleworld.com, we are extremely proud of our commitment to We at Cycleworld.com promise that we will not disclose your personal information to third parties for their marketing purposes. Your trust and confidence are our highest priority.</p>
                        </div>

                        {/* Information Collection */}
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-green-500 mb-3 flex items-center gap-2"><IoIosInformationCircle className="text-2xl text-green-500" />Information We Collect</h3>
                            <p className="text-gray-600 mb-4">We may collect the following information:</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                <li className="animate-fade-in-right delay-200">Name and job title</li>
                                <li className="animate-fade-in-right delay-300">Contact information including email address</li>
                                <li className="animate-fade-in-right delay-400">Demographic information such as postcode, preferences and interests</li>
                                <li className="animate-fade-in-right delay-500">Other information relevant to customer surveys and/or offers</li>
                            </ul>
                            <p className="text-gray-600 mb-4">When you use our portal, we collect and store personal information provided by you. Our primary goal in doing this is to provide a safe, efficient and customized experience. This allows us to provide services and features that most likely meet your needs, and to customize our portal to make your experience safer and easier. Most importantly, we only collect personal information about you that we consider necessary for achieving this purpose. In general, you can browse the portal without telling us who you are or revealing any personal information about yourself. To be able to use every feature of our portal, you will need to register and provide us your contact information and other personal information as indicated in the form. We may automatically track certain information about you based on your behavior on the portal. We use this information to do internal research on our users’ demographics, interests, and behavior to better understand, protect and serve our users. This information is compiled and analyzed on regular basis. We use data collection devices such as “cookies” on certain pages of the Site to help analyze our web page flow, measure promotional effectiveness, and promote trust and safety. If you choose to buy bicycles, accessories using the portal, we collect information about your buying and selling behavior. For your valuable feedback, if you send us personal correspondence, such as emails or letters, or if other users or third parties send us correspondence about your activities or postings on the portal, we may collect such information.</p>
                        </div>

                        {/* Use of Information */}
                        <div className="p-8 border-b border-gray-100 bg-blue-50/30">
                            <h3 className="text-xl font-semibold text-green-500 mb-3 flex items-center gap-2"><MdOutlineCollectionsBookmark className="text-2xl text-green-500"/>How We Use Your Information</h3>
                            <p className="text-gray-600 mb-4">
                                We require this information to understand your needs and provide better service, 
                                and in particular for:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Internal record keeping",
                                    "Improving our products and services",
                                    "Periodic promotional emails",
                                    "Market research contact",
                                    "Website customization",
                                    "Special offers information"
                                ].map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 animate-fade-in-up"
                                        style={{ animationDelay: `${200 + (index * 100)}ms` }}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">From time to time we may reveal general visitor analytics information about our portal, such as number of visitors, portal usage patterns etc. We use your personal information to facilitate the services you request. We use your personal and other information that we obtain from your current and past activities on the portal to: measure consumer interest in the services provided by us, inform you about online and offline offers, products, services, and updates; customize your experience; detect and protect us against error, fraud and other criminal activity; enforce our User Agreement; sharing in the course of classified listings with prospective buyers/sellers as the case may be; and as otherwise described to you at the time of collection. We may examine your personal information to identify users using multiple User IDs or aliases. We may compare and review your personal information for errors, omissions and for accuracy. You agree that we may use your personal information to improve our marketing and promotional efforts, to analyze portal usage, improve the portal’s content and product offerings, and customize the portal’s content, layout, and services. These inputs help us to improve the portal and help customize it to meet your needs, so as to provide you with a smooth, efficient, safe and customized experience while using the portal. You agree that we may use your personal information to contact you and deliver information to you that, in some cases, are targeted to your interests, such as targeted banner advertisements, administrative notices, product offerings, and communications relevant to your use of the Site. By accepting the User Agreement and Privacy Policy, you expressly agree to receive this information.</p>
                        </div>
                    </div>
                    {/* Contact Info */}
                    <div className="mt-12 bg-white rounded-xl shadow-md p-8 text-center animate-fade-in-up delay-300">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Us About Privacy</h3>
                        <p className="text-gray-600 mb-6">
                            For any questions about our privacy policy, please contact:
                        </p>
                        <a href="mailto:info@cycleworld.in" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">info@cycleworld.in</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PrivacyPolicy;