"use client";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#2a7b9b] via-[#57c785] to-[#eddd53] px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thank You for Your Interest!
        </h1>

        <p className="text-gray-600 mb-4">
          We’ve received your franchise application successfully.
        </p>

        <p className="text-gray-600 mb-6">
          Our team will review your submission and get in touch with you shortly to guide you through the next steps of becoming a Cycle World Franchise Partner.
        </p>
      </div>
    </div>
  );
}
