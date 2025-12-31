"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FiRotateCcw, FiPackage, FiCheckCircle, FiClock } from 'react-icons/fi';
import { MdOutlinePolicy, MdOutlineMoneyOff } from "react-icons/md";

const CancellationRefundPolicy = () => {
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
        <h2 className="text-xl font-bold text-gray-800">Cancellation & Refund Policy</h2>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
          <span className="text-gray-500">›</span>
          <span className="text-green-600 font-semibold">Cancellation & Refund</span>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-9xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiRotateCcw className="text-blue-600 text-3xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Cancellation & Refund Policy</h1>
            {currentDate && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Last updated: {currentDate}
              </p>
            )}
          </div>

          {/* Policy Content */}
          <div className="rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Cancellation Policy */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-customBlue mb-4 flex items-center gap-2">
                <MdOutlinePolicy className="text-green-800" /> TRANSIT RELATED DAMAGES
              </h2>
              <p className="text-gray-600 mb-4">
                All bicycles/products sold by CycleWorld are subject to thorough quality checks before the order is shipped to the customer. CycleWorld ships original products to maintain complete customer satisfaction for the bicycle/product ordered. Cancellation/refund shall be entertained only based on the circumstances mentioned below.
              </p>
              <p>TRANSIT RELATED DAMAGES</p>
              <p className="text-gray-600 mb-4">
                In case of any damage that happens to the product during transit, you shall intimate the same to CycleWorld within 24 (Twenty Four) hours of receiving the shipment. For the purpose of verification of the claim, the requirements along with visual (images and videos) proofs shall be mailed to service@cycleworld.in
              </p>

              <p>WARRANTY CLAIMS</p>
              <p className="text-gray-600 mb-4">
                For warranty-related claims that may arise with regards to any bicycle/product after the same being delivered to you and being communicated to CW with the following
              </p>
              <p className="text-gray-600 mb-4">
                information to service@cycleworld.in:
              </p>
              <p className="text-gray-600 mb-4">
                image/video of the part in question;
              </p>
              <p className="text-gray-600 mb-4">
               invoice copy of the bicycle/product; and
              </p>
              <p className="text-gray-600 mb-4">
                Image of the picture frame number on the bicycle.
              </p>
              <p className="text-gray-600 mb-4">
                Considering the warranty terms set out by each brand, CycleWorld shall liaise with such brands to address the issue on a best-effort basis. The replacement part/product in question shall be shipped to you free of cost. In case, such an issue cannot be rectified, CycleWorld will process the return of the product and replace the bicycle/product (or) refund your payment.
              </p>


              <p>FURTHER STIPULATIONS</p>
              <p className="text-gray-600 mb-4">
                In case, you would like to proceed with the cancellation of your order, a nominal cancellation charge of Rs. 1,200/- (Rupees One Thousand Two Hundred only) coupled with a transaction reversal fee of 2% (Two Percent) of the amount paid will be deducted before the processing of your refund. This shall be at the discretion of the CW Customer Support Team. In the event of the product being shipped either from the brand’s warehouse or from CycleWorld’s warehouse prior to raising a cancellation request, the request will not be considered.
              </p>
              <p>REFUND PROCESS</p>
              <p className="text-gray-600 mb-4">
                In case a refund is approved by CycleWorld, the mode of refund will depend on your original payment method. If paid by credit/debit card/internet banking, refunds will be sent to the respective bank within 5 (Five) to 7 (Seven) business days of receipt of the returned item or cancellation request. Please contact your bank with queries regarding the refund credit to your account. For further questions, you can reach out to service@cycleworld.in.
              </p>
              <p className="text-gray-600 mb-4">
               If the product ordered is unavailable due to any unforeseen circumstances, CycleWorld would offer a 100% refund to the customer through the Original Mode of Payment.
              </p>
              <p className="text-gray-600 mb-4">
               For information about how to contact us, please visit our <a href="/contact" className="hover:text-green-800 text-green-600">contact page.</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefundPolicy;