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
    return (
        <div>
            {/* 🟠 About us Header Bar */}
            <div className="bg-green-50 py-6 px-8 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Lending Partners</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
                    <span className="text-gray-500">›</span>
                    <span className="text-green-600 font-semibold">Lending Partners</span>
                </div>
            </div>
            <div className="bg-gray-50 py-12 px-4">
  <div className="max-w-5xl mx-auto">
    <div className="bg-white rounded-xl shadow-md px-8 py-5">
      
      {/* CENTERED CONTENT */}
      <div className="flex items-center justify-center gap-12">
        
        {/* LEFT – LOGO */}
        <div className="flex items-center">
            <a href="https://finzy.com/borrow" target="_blank">
                <img src="/uploads/aboutus/Finzt-logo-W-200.webp" alt="Finzy" className="h-10 w-auto" />
            </a>
        </div>

        {/* RIGHT – CONTACT INFO */}
        <div className="text-sm text-gray-700 leading-relaxed">
          <p>
            <span className="font-medium">Contact :</span>{" "}
            <span className="text-green-600 font-semibold">
              <a href="tel:9341300300">9341 300 300</a>
            </span>
          </p>
          <p>
            <span className="font-medium">Email Id :</span>{" "}
            <span className="text-green-600 font-semibold">
                <a href="mailto:support@finzy.com">support@finzy.com</a>
            </span>
          </p>
        </div>

      </div>

    </div>
  </div>
</div>



        </div>
    );
};
export default LebdingPartners;