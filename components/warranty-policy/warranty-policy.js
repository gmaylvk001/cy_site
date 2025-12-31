"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FiShield, FiLock, FiMail, FiCookie } from 'react-icons/fi';
import { FaCookieBite } from 'react-icons/fa';
import { IoIosInformationCircle } from "react-icons/io";
import { MdOutlineSecurity } from "react-icons/md";
import { MdPolicy } from "react-icons/md";
import { MdOutlineCollectionsBookmark } from "react-icons/md";


const WarrantyPolicy = () => {
    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
    }, []);
    return (
        <div>
            {/* 🟠 About us Header Bar */}
            <div className="bg-green-50 py-6 px-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Warranty Policy</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
                    <span className="text-gray-500">›</span>
                    <span className="text-green-600 font-semibold">Warranty policy</span>
                </div>
            </div>
            <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
                 <div className="max-w-9xl mx-auto ">
                    {/* Header Section */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><FiShield className="text-blue-600 text-3xl" /></div>
                        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Warranty Policy</h1>
                        {currentDate && (
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Last updated: {currentDate}</p>
                        )}
                    </div>

                    {/* Policy Content */}
                    <div className=" rounded-xl shadow-md overflow-hidden animate-fade-in-up delay-100  bg-gradient-to-br from-blue-50 to-indigo-50">
                        {/* Introduction */}
                        <div className="p-8 border-b border-gray-100">
                            
                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                <li className="animate-fade-in-right delay-200">Two years frame warranty.</li>
                                <li className="animate-fade-in-right delay-300">6 months guarantee for the non-wearable parts (which includes suspension, headset assembly, etc.)</li>
                                <li className="animate-fade-in-right delay-400">Warranty only covers manufacturing issues.</li>
                                <li className="animate-fade-in-right delay-300">There is no warranty on parts subject to wear and tear internal and external tubes, brake pads, brake handlebars, pedals, the chain, front and back derailleurs, brake lines, light bulbs, wheel rims, transmission, and derailing chain devices.</li>
                            </ul>
                            <br/>
                            <h2 className="text-2xl font-bold text-green-500 mb-4 flex items-center gap-2">
                                Other conditions NOT covered by our warranty:
                            </h2>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                <li className="animate-fade-in-right delay-200"> Damage by third-party, intentional damage, or willful negligence</li>
                                 <li className="animate-fade-in-right delay-200"> Improper use and maintenance</li>
                                <li className="animate-fade-in-right delay-300">Bike modifications</li>
                                <li className="animate-fade-in-right delay-400">Use of non-original parts</li>
                               
                                <li className="animate-fade-in-right delay-200">Natural disaster and force</li>
                                 <li className="animate-fade-in-right delay-200"> Damage during transportation</li>
                                  <li className="animate-fade-in-right delay-200"> Corrosion-like rusting etc</li>
                            </ul>
                        </div>
                      </div>
                </div>
            </div>
        </div>
    );
};
export default WarrantyPolicy;