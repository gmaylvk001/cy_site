"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FiFileText, FiBook, FiShield, FiMail, FiLink,FiUser } from 'react-icons/fi';
import { MdOutlinePolicy, MdOutlineSecurity } from "react-icons/md";

const TermsAndConditions = () => {
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
        <h2 className="text-xl font-bold text-gray-800">Terms & Conditions</h2>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
          <span className="text-gray-500">›</span>
          <span className="text-green-600 font-semibold">Terms & Conditions</span>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-9xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFileText className="text-blue-600 text-3xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">TERMS & CONDITIONS</h1>
            {currentDate && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Last updated: {currentDate}
              </p>
            )}
          </div>

          {/* Terms Content */}
          <div className="rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Introduction */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <FiBook className="text-green-600" /> Website Terms
              </h2>
              <p className="text-gray-600 mb-4">
                Cycleworld shall provide you (“User”) bicycles of various brands, related products/accessories & information. These products/services may be availed by the User in South India at any time.
              </p>
              <p className="text-gray-600 mb-4">
               This Master User Agreement (“Agreement”) is applicable to all bicycles/products sold through Cycleworld. In addition to this Agreement, the User shall be required to read and accept the relevant terms and conditions of any service (“TOS”) for each such Service, which may be updated or modified by Cycleworld from time to time. Such TOS shall be deemed to be a part of this Agreement and in the event of a conflict between such TOS and this Agreement, the terms of this Agreement shall prevail.
              </p>
              <p className="text-gray-600">
                All the terms, conditions and notices contained in this Agreement and the TOS, as may be posted on the Website from time to time shall be applicable for all bicycles and products sold through Cycleworld. For the removal of doubts, it is clarified that the purchase of any bicycle/product by the User constitutes an acknowledgement and acceptance by the User of this Agreement and the TOS. If the User does not agree with any part of such terms, conditions and notices, the User must not make any purchase through Cycleworld.
              </p>
              <p className="text-gray-600">Cyclewrold at its sole discretion reserves the right not to accept any order placed by the User through the website without assigning any reason thereof. Any contract to provide any service by Cycleworld is not complete until full money towards the bicycle/product is received from the User and accepted/acknowledged by Cycleworld.</p>
            </div>

            {/* MODIFICATION OF TERMS */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                MODIFICATION OF TERMS
              </h3>
              <p className="text-gray-600 mb-4">
                Cycleworld reserves the right to change the terms, conditions and notices under which the bicycles/products are offered through the website, including but not limited to price of the products offered through its website, which shall be intimated to Cycleworld by the respective manufacturer/brand from time to time. The user shall be responsible for regularly reviewing these terms and conditions.
              </p>
            </div>

            {/* LIMITED USER */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiUser className="text-2xl" />
                LIMITED USER
              </h3>
              <p className="text-gray-600 mb-4">
                The User agrees and undertakes not to sell, trade or resell or exploit for any commercial purposes, any of the bicycles/products offered for sale through Cycleworld. For the removal of doubt, it is clarified that the services offered herein are specifically meant for personal use only.
              </p>
              <p className="text-gray-600 mb-4">
                The User further agrees and undertakes not to reverse engineer, modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products or services obtained from the website. Limited reproduction and copying of the content of the Website is permitted provided that the Cycleworld name is stated as the source. For the removal of doubt, it is clarified that unlimited or wholesale reproduction, copying of the content for commercial or non-commercial purposes and unwarranted modification of data and information within the content of the Website is not permitted.
              </p>
            </div>

            {/* DISCLAIMER OF WARRANTIES/LIMITATION OF LIABILITY */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MdOutlinePolicy className="text-2xl" />
                DISCLAIMER OF WARRANTIES/LIMITATION OF LIABILITY
              </h3>
              <p className="text-gray-600 mb-4">
                Cycleworld has endeavoured to ensure that all the information provided by it is correct, but Cycleworld neither warrants nor makes any representations regarding the quality, accuracy or completeness of any data or information. Cycleworld makes no warranty, express or implied, concerning the website and/or its contents and disclaims all warranties of fitness for a particular purpose and warranties of merchantability in respect of products, including any liability, responsibility or any other claim, whatsoever, in respect of any loss, whether direct or consequential, to any user or any other person, arising out of or from the use of any such information.
              </p>
              <p className="text-gray-600 mb-4">
                Cycleworld shall further not have responsibility or liability in relation to the validity of the legal rights related to third party content. All third party intellectual property rights as displayed on the website are owned by respective parties and Cycleworld does not claim any rights over the same. The mere displaying of information, the intellectual property related thereto by third parties, does not in any way imply, suggest, or constitute Cycleworld sponsorship or approval of related third-parties, or any affiliation between Cycleworld and third-parties.
              </p>
              <p className="text-gray-600 mb-4">
                Although Cycleworld makes reasonable commercial efforts to ensure that the description and content in each page of the website is correct, it does not, however, take responsibility for changes that occurred due to human or data entry errors or for any loss or damages suffered by any user due to any information contained herein.
              </p>

              <p className="text-gray-600 mb-4">
                Cycleworld does not endorse any advertiser on its website in any manner. The users are requested to verify the accuracy of all information on their own before undertaking any reliance on such information.
              </p>
              <p className="text-gray-600 mb-4">
                In no event shall Cycleworld be liable for any direct, indirect, punitive, incidental, special, consequential damages or any other damages resulting from: (a) the use or the inability to use the bicycle/product; (b) the cost of procurement of substitute goods and services or resulting from any goods, information or services purchased or obtained or messages received or transactions entered into thereon; (c) unauthorized access to or alteration of the user’s transmissions or data; (d) any other matter relating to the services; including, without limitation, damages for loss of use, data or profits, arising out of or in any way connected in relation to the bicycles/products listed on Cycleworld’s website.
              </p>
              <p className="text-gray-600 mb-4">
                Neither shall Cycleworld be responsible for the delay or inability to use/avail the website, or for any information, software, products, services and related graphics obtained from Cycleworld, whether based on contract, tort, negligence, strict liability or otherwise. Further, Cycleworld shall not be held responsible for non-availability of the website during periodic maintenance operations or any unplanned suspension of access to the services that may occur due to technical reasons or for any reason beyondCycleworld’s control. The user understands and agrees that any material and/or data downloaded or otherwise obtained from website/Cycleworld is done entirely at their own discretion and risk and they will be solely responsible for any damage to their computer systems or any other loss that results from such material and/or data.
              </p>

              <p className="text-gray-600 mb-4">
                These limitations, disclaimer of warranties and exclusions apply without regard to whether the damages arise from (a) breach of contract, (b) breach of warranty, (c) negligence, or (d) any other cause of action, to the extent such exclusion and limitations are not prohibited by applicable law.
              </p>
              <p className="text-gray-600 mb-4">
                The maximum liability on part of Cycleworld arising under any circumstances, in respect of any bicycle/product purchased, shall be limited up to a maximum of the refund of total amount received from the user/customer for such product less any cancellation, refund or others charges, as may be applicable. In no case Cycleworld shall be liable for any consequential loss, damage or additional expense whatsoever.
              </p>
            </div>

            {/* PROHIBITION AGAINST UNLAWFUL USE */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                PROHIBITION AGAINST UNLAWFUL USE
              </h3>
              <p className="text-gray-600 mb-4">
                As a condition of the use of the website, the User warrants that they will not use the website for any purpose that is unlawful or illegal under any law for the time being in force within or outside India or prohibited by this Agreement and/or the TOS including both specific and implied. In addition, the website shall not be used in any manner, which could damage, disable, overburden or impair it or interfere with any other party’s use and/or enjoyment of the website. The User shall refrain from obtaining or attempting to obtain any materials or information through any means not intentionally made available or provided for or through the website.
              </p>
            </div>

            {/* TERMINATION/ACCESS RESTRICTION */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                TERMINATION/ACCESS RESTRICTION
              </h3>
              <p className="text-gray-600 mb-4">
                Cycleworld reserves the right, in its sole discretion, to terminate the access to the website and the related services or any portion thereof at any time, without notice.
              </p>
            </div>

            {/* FEES PAYMENT */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                FEES PAYMENT
              </h3>
              <p className="text-gray-600 mb-4">
                The User shall be liable to pay all applicable charges, fees, duties, taxes, levies and assessments for purchase of the bicycles/products from Cycleworld.
              </p>
            </div>


            {/* Contact Info */}
            <div className="p-8">
              <h3 className="text-xl font-semibold text-green-600 mb-3 flex items-center gap-2">
                <FiMail className="text-green-600" />
                Contact Information
              </h3>
              <p className="text-gray-600 mb-6">
                For information about how to contact us, please visit our <a href="/contact" className="hover:text-green-800 text-green-600">contact page.</a>
              </p>
              <a 
                href="mailto:info@cycleworld.in" 
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
              >
                info@cycleworld.in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;