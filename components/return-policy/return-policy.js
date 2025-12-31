"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FiShield, FiLock, FiMail, FiCookie } from 'react-icons/fi';
import { FaCookieBite } from 'react-icons/fa';
import { IoIosInformationCircle } from "react-icons/io";
import { MdOutlineSecurity } from "react-icons/md";
import { MdPolicy } from "react-icons/md";
import { MdOutlineCollectionsBookmark } from "react-icons/md";


const ReturnPolicy = () => {
    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
    }, []);
    return (
        <div>
            {/* 🟠 About us Header Bar */}
            <div className="bg-green-50 py-6 px-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Return Policy</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
                    <span className="text-gray-500">›</span>
                    <span className="text-green-600 font-semibold">Return policy</span>
                </div>
            </div>
            <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
                 <div className="max-w-9xl mx-auto ">
                    {/* Header Section */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><FiShield className="text-blue-600 text-3xl" /></div>
                        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Return Policy</h1>
                        {currentDate && (
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Last updated: {currentDate}</p>
                        )}
                    </div>

                    {/* Policy Content */}
                    <div className=" rounded-xl shadow-md overflow-hidden animate-fade-in-up delay-100  bg-gradient-to-br from-blue-50 to-indigo-50">
                        {/* Introduction */}
                        <div className="p-8 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-green-500 mb-4 flex items-center gap-2">
                                <FiLock className="text-green-500" />Our Guidelines for Exchanges and Damages
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                <li className="animate-fade-in-right delay-200">There is no return on cycle, only exchanges if there is any mismatch in sizes or other damages during delivery or handling or manufacturing issues.</li>
                                <li className="animate-fade-in-right delay-300">Products purchased from Cycleworld can only be exchanged at our stores.</li>
                                <li className="animate-fade-in-right delay-400">The product can be only exchanged if it’s in a resalable condition, within 7-10 days.</li>
                            </ul>

                            <p className="text-gray-600 mb-4">In case of any damages or manufacturing issues, the Warranty policy will be taken into consideration.</p>
                            <p className="text-gray-600">CycleWorld will be taking full responsibility for damaged goods if the delivery is by our own medium or transportation partner. </p>
                            <p className="text-gray-600 mb-4">For 3rd party deliveries damage because of improper man-handling won’t be considered.</p>
                        </div>
                      </div>
                </div>
            </div>
        </div>
    );
};
export default ReturnPolicy;