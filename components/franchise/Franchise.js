// components/Franchise.js
"use client";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt,FaBicycle,FaClock,FaGlobe,FaCogs,FaUndoAlt,FaChalkboardTeacher,FaBullhorn} from "react-icons/fa";
import Image from "next/image";
import { getUrlParams } from "@/utils/geturlparameters";
const { utm_source, utm_medium, utm_campaign } = getUrlParams();


export default function Franchise() {
    const [activeIndex, setActiveIndex] = useState(0)
    const testimonials = [
      {
        image: "/images/banashankari-branch.jpg",
        title: "From Setup to Sales – The Support Was Seamless!",
        description:
          "Cycle World helped me set up my store in just 45 days. Their team guided me in selecting inventory, marketing, and even staff training.",
        author: "— Ramesh Kumar, Franchise Partner – Banashankari",
      },
      {
        image: "/images/bannerghatta-branch.jpg",
        title: "Best Decision I Made for My Business Journey",
        description:
          "I was looking for a profitable business with low risk, and Cycle World delivered exactly that. With their strong brand and buyback support, I recovered my investment within the first 8 months.",
        author: "— Priya Desai, Franchise Owner – Bannerghatta",
      },
      {
        image: "/images/kalyan-nagar.jpg",
        title: "Quality Products &amp; Strong Brand Trust",
        description:
          "Customers trust the brand, and that has made selling much easier. The store gets continuous walk-ins and repeat customers. I’m proud to be a part of Cycle World’s growing network.",
        author: "— Harish Patel, Franchise Owner – Kalyan Nagar",
      },
      {
        image: "/images/pondicherry.jpg",
        title: "Smooth Operation with ERP &amp; Logistic Support",
        description:
          "Managing billing, inventory and suppliers used to be a challenge. But with their ERP system and backend support, operations have become smooth and efficient. I can now focus more on customer service and growth.",
        author: "— Sneha Nair, Franchise Partner – Pondicherry",
      },
    ];
    const faqs = [
        {
            question: "What’s the expected ROI (Return on Investment)?",
            answer:
            "Most franchise partners achieve an ROI of 25–35% annually, depending on store location, investment, and sales performance."
        },
        {
            question: "What is the payback period for my investment?",
            answer:
            "The typical payback period ranges between 18–24 months based on business performance."
        },
        {
            question: "How does the stock & inventory model work?",
            answer:
            "Inventory is centrally managed, ensuring consistent supply and optimized stock levels."
        },
        {
            question: "What kind of support does the brand provide?",
            answer:
            "We provide training, marketing, operations support, and ongoing business guidance."
        },
        {
            question: "Do I need prior experience to start a franchise?",
            answer:
            "No prior experience is required. We train and support you at every step."
        }
    ]
    const [formData, setFormData] = useState({
      name: "",
      phone: "",
      email: "",
      city: "",
      company: "",
      invest: "",
      start: "",
      job: "",
    });
    
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const validate = () => {
      const newErrors = {};
  
      // Name required
      if (!formData.name.trim()) newErrors.name = "Name is required";
  
      // Phone: 10 digits only
      if (!/^\d{10}$/.test(formData.phone))
        newErrors.phone = "Enter a valid 10-digit phone number";
  
      // Email: valid format
      if (!formData.email) newErrors.email = "Email is required";
      else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
      )
        newErrors.email = "Enter a valid email address";
  
      // City required
      if (!formData.city.trim()) newErrors.city = "City is required";
  
      // Investment range select
      if (!formData.invest) newErrors.invest = "Select an investment range";
  
      // Start time select
      if (!formData.start) newErrors.start = "Select start time";
  
      // Occupation select
      if (!formData.job) newErrors.job = "Select occupation type";
  
      return newErrors;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      setErrors({}); // Clear errors
      const { utm_source, utm_medium, utm_campaign } = getUrlParams();
  
      const payload = {
        api_token: "mvaosaMlrLEU9i0tWRh4Jr8RYvq9eueq",
        first_name: formData.name,
        mobile: formData.phone,
        email: formData.email,
        city: formData.city,
        company: formData.company,
        investment_budget: formData.invest,
        opening_timeline: formData.start,
        occupation_type: formData.job,
        lead_source: utm_source,
        lead_campaign: utm_campaign,
      };

      // console.log("Data to send:", payload);
  
      try {
        const res = await fetch("https://adtarbo.eywamedia.com/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        if (!res.ok) throw new Error("Failed to submit");
  
        setSuccess(true);
        setFormData({
          name: "",
          phone: "",
          email: "",
          city: "",
          company: "",
          invest: "",
          start: "",
          job: "",
        });
      } catch (err) {
        console.error(err);
        alert("Error submitting form. Please try again.");
      }
    };
  return (
    <div className="min-h-screen bg-white text-white">
    {/* Hero Section */}
    <section className="relative bg-cover bg-center" id="franchise-form"
    style={{ backgroundImage: "url('/images/Franchise.jpg')" }}
    >
    <div className="bg-black/70">
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Become a <span className="text-lime-400">Cycle World</span><br />
            Franchise Partner & Build a<br />
            Profitable Future
            </h1>

            <p className="mt-6 text-sm text-gray-300 text-xl">
            90+ successful stores should be bold and highlighted
            </p>

            <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-2 text-lg">
                <span className="text-lime-400">✔</span> 25+ global brands
            </li>
            <li className="flex items-center gap-2 text-lg">
                <span className="text-lime-400">✔</span> Margin 30–35 Percent
            </li>
            <li className="flex items-center gap-2 text-lg">
                <span className="text-lime-400">✔</span> India’s Largest multi brand bicycle store
            </li>
            </ul>
        </div>

        {/* Right Form */}
        <div className="bg-white text-black rounded-xl p-6 md:p-8 shadow-xl max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">Apply Franchise</h2>

          {success && (
            <p className="text-green-600 mb-4 text-center">
              Your details were submitted successfully!
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 font-medium">Phone *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                maxLength={10}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block mb-1 font-medium">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.city ? "border-red-500" : ""
                }`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            {/* Company Name */}
            <div>
              <label className="block mb-1 font-medium">Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Investment Range */}
            <div>
              <label className="block mb-1 font-medium">Investment Range *</label>
              <select
                name="invest"
                value={formData.invest}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.invest ? "border-red-500" : ""
                }`}
              >
                <option value="">Select investment range</option>
                <option value="20–30 Lakhs">20–30 Lakhs</option>
                <option value="30–50 Lakhs">30–50 Lakhs</option>
                <option value="50+ Lakhs">50+ Lakhs</option>
              </select>
              {errors.invest && <p className="text-red-500 text-xs mt-1">{errors.invest}</p>}
            </div>

            {/* Start Time */}
            <div>
              <label className="block mb-1 font-medium">When do you plan to start? *</label>
              <select
                name="start"
                value={formData.start}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.start ? "border-red-500" : ""
                }`}
              >
                <option value="">Select start time</option>
                <option value="Immediately">Immediately</option>
                <option value="1–3 Months">1–3 Months</option>
                <option value="3–6 Months">3–6 Months</option>
              </select>
              {errors.start && <p className="text-red-500 text-xs mt-1">{errors.start}</p>}
            </div>

            {/* Occupation */}
            <div>
              <label className="block mb-1 font-medium">Current Occupation *</label>
              <select
                name="job"
                value={formData.job}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${
                  errors.job ? "border-red-500" : ""
                }`}
              >
                <option value="">Select occupation</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Job">Job</option>
                <option value="Investor">Investor</option>
              </select>
              {errors.job && <p className="text-red-500 text-xs mt-1">{errors.job}</p>}
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-lime-400 text-black py-2 rounded font-semibold hover:bg-lime-500 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        </div>
    </div>
    </section>
    {/* partner section */}
    <section id="why-partner" className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">

          {/* Heading */}
          <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
              Why Partner with{" "}
              <span className="text-lime-400">Cycle World</span> ?
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
              Join a trusted and profitable franchise network designed for long-term success.
          </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Image */}
          <div className="flex justify-center">
              <img
              src="images/partner-section-franchise.jpg"
              alt="India Network Map"
              className="max-w-full h-auto"
              />
          </div>

          {/* Right Features */}
          <div className="space-y-8">

              {/* Item 1 */}
              <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-lime-400 flex items-center justify-center text-lime-400 shrink-0">
                  <FaMapMarkerAlt className="text-lg" />
              </div>
              <div>
                  <h3 className="font-semibold text-black">
                  90+ Successful Stores
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                  A strong and growing network across India shows the trust and
                  profitability of our franchise model.
                  </p>
              </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-lime-400 flex items-center justify-center text-lime-400 shrink-0">
                  <FaBicycle className="text-lg" />
              </div>
              <div>
                  <h3 className="font-semibold text-black">
                  4,000+ Bikes Sold Every Month
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                  Consistent sales volume ensures strong demand, higher revenue,
                  and faster returns for franchise owners.
                  </p>
              </div>
              </div>

              {/* Item 3 */}
              <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-lime-400 flex items-center justify-center text-lime-400 shrink-0">
                  <FaClock className="text-lg" />
              </div>
              <div>
                  <h3 className="font-semibold text-black">
                  Proven ROI & Fast Payback
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                  With our business support and strong brand recognition,
                  most partners recover their investment within 18–24 months.
                  </p>
              </div>
              </div>

              {/* Item 4 */}
              <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-lime-400 flex items-center justify-center text-lime-400 shrink-0">
                  <FaGlobe className="text-lg" />
              </div>
              <div>
                  <h3 className="font-semibold text-black">
                  Products Range
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                  Cycle World offers a wide range of Mechanical Bicycles,
                  E-Mopeds, and E-Bicycles to match every rider's lifestyle.
                  </p>
              </div>
              </div>

          </div>
          </div>
      </div>
    </section>
    {/* testimonials section */}
    <section className="bg-[#2f2f2f] py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            What Our Partners Say & How Our Stores Look
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Hear from our franchise owners and explore visuals of thriving Cycle World stores across India.
          </p>
        </div>

        {/* Cards container */}
        <div className="flex flex-wrap md:flex-nowrap gap-6 justify-center overflow-x-auto md:overflow-visible px-4">
          {testimonials.map((item, index) => (
            <HoverCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
    {/* support section */}
     <section id="support" className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Partner Support & Benefits
          </h2>
          <p className="mt-4 text-gray-500 text-sm md:text-base max-w-3xl mx-auto">
            Empowering partners with ERP, buyback, training, and marketing support
            for faster growth.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Item 1 */}
          <div className="text-center">
            <div className="flex justify-center mb-5 text-lime-400 text-4xl">
              <FaCogs />
            </div>
            <h3 className="font-semibold text-black text-lg mb-2">
              ERP & Technology
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Centralized billing and inventory system to manage your store easily.
            </p>
          </div>

          {/* Item 2 */}
          <div className="text-center">
            <div className="flex justify-center mb-5 text-lime-400 text-4xl">
              <FaUndoAlt />
            </div>
            <h3 className="font-semibold text-black text-lg mb-2">
              Buyback Policy
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              We help reduce your risk with a buyback option on unsold inventory.
            </p>
          </div>

          {/* Item 3 */}
          <div className="text-center">
            <div className="flex justify-center mb-5 text-lime-400 text-4xl">
              <FaChalkboardTeacher />
            </div>
            <h3 className="font-semibold text-black text-lg mb-2">
              Professional Training
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Store setup guidance, sales training, and staff onboarding support.
            </p>
          </div>

          {/* Item 4 */}
          <div className="text-center">
            <div className="flex justify-center mb-5 text-lime-400 text-4xl">
              <FaBullhorn />
            </div>
            <h3 className="font-semibold text-black text-lg mb-2">
              Marketing Co-Funding
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Brand promotions, digital marketing & shared advertising support.
            </p>
          </div>

        </div>
      </div>
    </section>
    {/* process section */}
    <section id="process" className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Your Journey to Becoming a Partner
          </h2>
          <p className="mt-3 text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Begin your franchise journey in easy steps, guided with full support throughout
          </p>
        </div>

        {/* Steps */}
        <div className="relative">

          {/* Horizontal Line (Desktop) */}
          <div className="hidden md:block absolute top-[80px] left-[100px] right-[100px] h-[2px] bg-lime-400 "></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            {/* Step 1 */}
            <div className="text-center relative">
              <p className="text-sm font-medium mb-3">Step</p>
              <div className="mx-auto w-24 h-24 rounded-full border-4 border-lime-400 flex items-center justify-center text-lime-400 text-4xl font-bold bg-white">
                1
              </div>
              <h3 className="mt-6 font-semibold text-black">Enquiry</h3>
              <p className="mt-2 text-gray-500 text-sm">
                Submit your interest through our franchise form.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <p className="text-sm font-medium mb-3">Step</p>
              <div className="mx-auto w-24 h-24 rounded-full border-4 border-lime-400 flex items-center justify-center text-lime-400 text-4xl font-bold bg-white">
                2
              </div>
              <h3 className="mt-6 font-semibold text-black">Initial Call</h3>
              <p className="mt-2 text-gray-500 text-sm">
                Our team connects to discuss your goals and requirements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <p className="text-sm font-medium mb-3">Step</p>
              <div className="mx-auto w-24 h-24 rounded-full border-4 border-lime-400 flex items-center justify-center text-lime-400 text-4xl font-bold bg-white">
                3
              </div>
              <h3 className="mt-6 font-semibold text-black">Site Selection</h3>
              <p className="mt-2 text-gray-500 text-sm">
                We assist you in choosing the perfect store location.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center relative">
              <p className="text-sm font-medium mb-3">Step</p>
              <div className="mx-auto w-24 h-24 rounded-full border-4 border-lime-400 flex items-center justify-center text-lime-400 text-4xl font-bold bg-white">
                4
              </div>
              <h3 className="mt-6 font-semibold text-black">
                Agreement & Onboarding
              </h3>
              <p className="mt-2 text-gray-500 text-sm">
                Finalize paperwork and begin setup & training.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
    {/* faq section */}
    <section id="faq" className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            FAQ
          </h2>
          <p className="mt-3 text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Quick answers to your franchise related doubts and decisions.
          </p>
        </div>

        {/* FAQ List */}
        <div className="border border-gray-200 rounded-md overflow-hidden">

          {faqs.map((faq, index) => {
            const isActive = activeIndex === index

            return (
              <div key={index}>
                {/* Question */}
                <button
                  onClick={() => setActiveIndex(isActive ? null : index)}
                  className={`w-full flex items-center justify-between px-6 py-5 text-left transition
                    ${isActive
                      ? "bg-neutral-800 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                >
                  <span className="font-medium">
                    {faq.question}
                  </span>

                  <span className="text-2xl font-light">
                    {isActive ? "−" : "+"}
                  </span>
                </button>

                {/* Answer */}
                {isActive && (
                  <div className="px-6 py-5 text-sm md:text-base bg-neutral-white text-black">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}

        </div>
      </div>
    </section>
    {/* cta section */}
    <section className="py-10 px-4">
      <div className="relative max-w-7xl mx-auto rounded-lg overflow-hidden">

        {/* Background Image */}
        <Image
          src="/images/cycle-scaled.jpg" // replace with your image path
          alt="Franchise Background"
          fill
          className="object-cover"
          priority
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row lg:items-start items-center justify-between  gap-8 px-6 md:px-10 py-10">

          {/* Left Content */}
          <div className="flex items-start gap-4 max-w-3xl">
            
            {/* Icon */}
            <div className="flex-shrink-0">
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                className="text-lime-400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 11V5a2 2 0 0 1 2-2h6l6 4v6a2 2 0 0 1-2 2H9l-6-4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 7h5v10a2 2 0 0 1-2 2h-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Text */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Start Your Franchise Journey Today
              </h3>
              <p className="mt-2 text-gray-300 text-sm md:text-base">
                Limited franchise opportunities available in Andhra Pradesh & Telangana.
                Take the first step today!
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div>
           <a
            href="#franchise-form"
            className="bg-lime-400 hover:bg-lime-500 text-black font-semibold px-7 py-3 rounded-md transition whitespace-nowrap inline-block"
        >
            Become a Partner
        </a>
          </div>

        </div>
      </div>
    </section>
    </div>
  );
}

function HoverCard({ image, title, description, author }) {
  return (
    <div className="relative w-[260px] h-[420px] rounded-xl border-2 border-[#9acd32] overflow-hidden group cursor-pointer transition-all duration-500 ease-in-out hover:w-[500px]">
      
      {/* Image */}
      <Image src={image} alt={title} fill className="object-cover"/>

      {/* Text overlay: initially hidden, appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 hover:bg-[#000000ab]">
        <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-200 text-sm italic mb-3 leading-relaxed">{description}</p>
        <span className="text-gray-300 text-sm">{author}</span>
      </div>
    </div>
  );
}
