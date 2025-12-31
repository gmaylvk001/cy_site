'use client';
import Image from 'next/image';
import Link from 'next/link';
import { BsFillAwardFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { GiNetworkBars } from "react-icons/gi";
import { FaThumbsUp } from "react-icons/fa";
import { FiHeadphones,  FiSettings,FiTag, FiTarget, FiMapPin, FiAward, FiUsers,FiUser,  FiMonitor, FiSpeaker, FiShoppingCart, FiStar , FiCreditCard, FiLock, FiActivity ,FiSend,FiCrosshair,FiClock } from 'react-icons/fi';




const AboutUs = () => {


  return (
    <div className="text-[#1d1d1f]">

        {/* 🟠 About us Header Bar */}
        <div className="bg-green-50 py-6 px-8 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">About us</h2>
            <div className="flex items-center space-x-2">
                <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
                <span className="text-gray-500">›</span>
                <span className="text-green-600 font-semibold">About us</span>
            </div>
        </div>
        {/* Hero Section */}
        <section className="relative w-full h-[85vh] overflow-hidden">
        {/* Background Image */}
        <img
            src="/uploads/aboutus/cw-banner.webp"
            alt="About Us"
            className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Center Card */}
        <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="bg-white max-w-md w-full p-8 rounded-md shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">About Us</h2>

            <p className="text-gray-700 text-sm leading-relaxed">
                Team Cycle World is an elite enterprise established in November 2011 in
                Bengaluru. It is now South India’s largest bicycle retail franchise.
            </p>

            <p className="text-gray-700 text-sm leading-relaxed mt-3">
                We deal with all major bicycle brands and are national distributors for
                international brands in India.
            </p>

            {/* Logo */}
            <div className="mt-6 flex justify-center">
                <img
                src="/uploads/aboutus/Logo-150x1510-copy-100x100.webp"
                alt="Cycle World"
                className="h-14"
                />
            </div>

            {/* Stats Section */}
            <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-4">
                <div>
                <h3 className="text-xl font-bold text-gray-900">100+</h3>
                <p className="text-xs text-gray-600">Stores</p>
                </div>

                <div>
                <h3 className="text-xl font-bold text-gray-900">300+</h3>
                <p className="text-xs text-gray-600">Models</p>
                </div>

                <div>
                <h3 className="text-xl font-bold text-gray-900">
                    10,00,000+
                </h3>
                <p className="text-xs text-gray-600">Satisfied customers</p>
                </div>
            </div>
            </div>
        </div>
        </section>

        {/* Info Strip Section */}
        <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">

            {/* Item 1 */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
                <img
                src="/uploads/aboutus/insurance-cycle.webp"
                alt="Bicycle Insurance"
                className="h-10 w-10"
                />
                <div>
                <h4 className="font-semibold text-gray-900">Bicycle Insurance</h4>
                <p className="text-sm text-gray-500">Toffee Insurance</p>
                </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
                <img
                src="/uploads/aboutus/support.webp"
                alt="Support"
                className="h-10 w-10"
                />
                <div>
                <h4 className="font-semibold text-gray-900">11/7 Support</h4>
                <p className="text-sm text-gray-500">Dedicated Support</p>
                </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-4 justify-center md:justify-start text-[#b6eb87]">
                <FiLock className="h-10 w-10" />
                <div>
                <h4 className="font-semibold text-gray-900">100% Safety</h4>
                <p className="text-sm text-gray-500">Only secure payments</p>
                </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
                <img
                src="/uploads/aboutus/wallet.webp"
                alt="Bajaj Finserv"
                className="h-10 w-10"
                />
                <div>
                <h4 className="font-semibold text-gray-900">Bajaj Finserv</h4>
                <p className="text-sm text-gray-500">0% EMI</p>
                </div>
            </div>

            </div>
        </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* LEFT SIDE – IMAGE */}
                <div className="flex justify-center">
                    <img
                    src="/uploads/aboutus/best-cycle-service-center-near-me.webp"   // your image path
                    alt="Security"
                    className="w-full max-w-md rounded-xl shadow-lg"
                    />
                </div>

                {/* RIGHT SIDE – CONTENT */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Our Services
                    </h2>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                    Cycleworld provides the widest range of Domestic and International Bicycles available for sale across India. We have bicycles in various categories: Kids Bikes, MTB’s, Hybrid, Road Bikes, City Bikes, E-Bikes and Speciality Bicycles. Each of the categories is specialized with its own modular structures and convenient features as well. The uniqueness in structure is the main factor of our product to stand out.
                    </p>

                </div>

                </div>
            </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Success Pillars - Animated Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {[
                    {
                    icon: <FiClock className="text-3xl text-green-500" />,
                    title: "SUPPORT 11/7",
                    desc: "We are basically a holistic bicycling community as well as a learning platform. Reach to us between 10 am to 9 pm x 365 days. We’d be happy to help you with any queries that you have!"
                    },
                    {
                    icon: <FiActivity className="text-3xl text-green-500" />,
                    title: "KNOWLEDGE",
                    desc: "Keep yourself informed on the latest news from our world of cycling page, upcoming technologies and innovations used on bicycles and reviews of bicycles from our team of cyclists"
                    },
                    {
                    icon: <FiUsers  className="text-3xl text-green-500" />,
                    title: "EVENTS",
                    desc: "We at Cycleworld are masters of conducting events across the Country for every type of cyclist. The events cater to Kids, Beginners, Amateurs and Professionals."
                    }
                ].map((item, index) => (
                    <div 
                    key={index}
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-white hover:border-green-500 animate-card-enter"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    >
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-3 mx-auto">
                        {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                    </div>
                ))}
                </div>
            </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* LEFT SIDE – IMAGE */}
                <div className="flex justify-center">
                    <img
                    src="/uploads/aboutus/best-cycle-service-center-near-me.webp"   // your image path
                    alt="Security"
                    className="w-full max-w-md rounded-xl shadow-lg"
                    />
                </div>

                {/* RIGHT SIDE – CONTENT */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Our Services
                    </h2>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                    Cycleworld provides the widest range of Domestic and International Bicycles available for sale across India. We have bicycles in various categories: Kids Bikes, MTB’s, Hybrid, Road Bikes, City Bikes, E-Bikes and Speciality Bicycles. Each of the categories is specialized with its own modular structures and convenient features as well. The uniqueness in structure is the main factor of our product to stand out.
                    </p>

                </div>

                </div>
            </div>
        </section>

        <section className="py-20 bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

      {/* LEFT SIDE – DARK IMAGE CARD */}
      <div className="relative bg-[#3f3f3f] rounded-xl overflow-hidden shadow-xl">
        <h2 className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl font-semibold text-white z-10">
          Our Journey
        </h2>

        <img
          src="/uploads/aboutus/cycleworld_indias_largest_multibrand-_bicycle_store.webp"
          alt="Our Journey"
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* RIGHT SIDE – TIMELINE */}
      <div className="relative">

        {/* LOGO (OPTIONAL CENTER IMAGE) */}
        <div className="mb-8 flex justify-start">
          <img
            src="/uploads/aboutus/Logo-150x1510-copy-100x100.webp"
            alt="Team Cycle World"
            className="w-40"
          />
        </div>

        {/* TIMELINE LIST */}
        <ul className="relative border-l-2 border-gray-300 pl-8 space-y-6">

          {[
            "2011 - Started CYCLE WORLD bicycle retail store by Mr. & Mrs. Krishnasamy Devaraj, with 2 employees, Bengaluru.",
            "2017 - Served 1 Lakh Customers",
            "2019 - Registered as Team Cycle World Pvt. Ltd.",
            "2019 - Launched GSports Bikes to cater to Mid-Premium customers",
            "2022 - Honoured with “Most Trusted and Fastest Growing Bicycle Franchise Brand” Award by Times Group.",
            "2022 - GSports EV project initiated",
            "2023 - Started Bicycle Manufacturing Unit in Bengaluru with capacity of 6,000 cycles per month",
            "2023 - Grown to India’s Largest Multibrand Bicycles chain with 90+ retail stores and 400+ staff",
            "2023 - First Prototype Developed for GSports EV"
          ].map((item, index) => (
            <li key={index} className="relative">

              {/* DOT */}
              <span className="absolute -left-[42px] top-1 w-4 h-4 bg-lime-500 rounded-full"></span>

              {/* TEXT */}
              <p className="text-gray-700 leading-relaxed text-sm">
                {item}
              </p>

            </li>
          ))}
        </ul>

      </div>

    </div>
  </div>
</section>


<section className="py-20 bg-[#14c3d3] overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-center text-white mb-12">
      BRANDS
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* Bicycles */}
      <div className="bg-[#6ce0f0] p-6 rounded-lg text-center">
        <h3 className="font-bold text-xl mb-4 italic">BICYCLES</h3>
        <p className="mb-6 text-black">
          Achieved #1 position in bicycles retail industry
          with 15+ brands and 90+ stores in India. GSports having
          40% of the contribution on overall sales.
        </p>
        <img
          src="/uploads/aboutus/gsport_cycle.webp"
          alt="Bicycles"
          className="mx-auto mb-4 max-w-xs"
        />
        
      </div>

      {/* Electric Vehicles */}
      <div className="bg-[#6ce0f0] p-6 rounded-lg text-center">
        <h3 className="font-bold text-xl mb-4 italic">ELECTRIC VEHICLES</h3>
        <p className="mb-6 text-black">
          To cater India’s demand of quality Electric vehicle
          requirements with 85% indigenous component.
        </p>
        <img
          src="/uploads/aboutus/gsport_scooty.webp"
          alt="Electric Vehicle"
          className="mx-auto mb-4 max-w-xs"
        />
      </div>

    </div>
  </div>
</section>



<section className="py-1 bg-[#f6f6f6] overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">

    {/* IMAGE CONTAINER */}
    <div className="relative w-full h-[600px] flex justify-center">

      {/* IMAGE 1 – TOP CENTER */}
      <img
        src="/uploads/aboutus/abtnw1-1024x1012.webp"
        alt="Image 1"
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[320px] md:w-[450px]"
      />

      {/* IMAGE 2 – LEFT BOTTOM */}
      <img
        src="/uploads/aboutus/abtnw0-204x300.webp"
        alt="Image 2"
        className="absolute top-[200px] left-[10%] w-[220px] rounded-xl"
      />

      {/* IMAGE 3 – RIGHT BOTTOM */}
      <img
        src="/uploads/aboutus/abtnw2-204x300.webp"
        alt="Image 3"
        className="absolute top-[200px] right-[10%] w-[220px] rounded-xl"
      />

    </div>

  </div>
</section>




</div>
  );
};

export default AboutUs;
