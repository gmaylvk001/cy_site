"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
export default function StoreDetails() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;

    async function fetchStore() {
      try {
        const res = await fetch(`/api/store/${slug}`); // ✅ correct param
        const data = await res.json();
        // support responses like `{ data: store }` or direct `store` object
        setStore(data?.data ?? data);
      } catch (err) {
        console.error("Error fetching store:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStore();
  }, [slug]); // ✅ runs only when storeId changes

  // const products = [
  //   { img: "/uploads/d7e004731765bda6c4db09c0d.png", name: "Air cooler" },
  //   { img: "/uploads/bcaa367d73be664a58d4f4500.jpg", name: "iPhone" },
  //   { img: "/uploads/bcaa367d73be664a58d4f4501.png", name: "Camera" },
  //   { img: "/uploads/bcaa367d73be664a58d4f4501.png", name: "Headphones" },
  //   { img: "/uploads/bcaa367d73be664a58d4f4500.jpg", name: "Smart Watch" },
  // ];

  // responsive breakpoints
  useEffect(() => {
    function resize() {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(3);
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function formatTo12Hour(time24) {
    if (!time24) return "9 PM"; // fallback if value is missing

    // Split hours and minutes
    const [hourStr, minuteStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert 0 -> 12

    return `${hour}${minute > 0 ? `:${minuteStr}` : ""} ${ampm}`;
  }

  if (loading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <h4 className="text-[#a3ca43] text-xl font-semibold">Loading...</h4>
      </div>
    );
  if (!store)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <h4 className="text-[#a3ca43] text-xl font-semibold">
          Store is not Found
        </h4>
      </div>
    );
  // const mediaPosts= [
  //   {
  //     thumbnail: "/uploads/76b2c19dc61ffe9b76f0bb100.jpg",
  //     url: "https://www.facebook.com/reel/3140700352765388",
  //     description: "Experience the new OPPO Find X9 Series...",
  //     postedOn: "2025-12-11T18:42",
  //   },
  // ];

  const maxIndex = Math.max(0, store.featured_products.length - perView);

  const next = () => setIndex((i) => Math.min(i + 1, maxIndex));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const visible = store.featured_products.slice(index, index + perView);

  return (
    <div className="p-4 space-y-6">
      {/* Top section */}
      <div className="grid lg:grid-cols-2 gap-4 md:grid-cols-1">
        {/* Store Card */}
        <div className="w-full rounded-2xl border shadow-sm bg-white">
          <div className="font-semibold text-2xl px-5 py-4 capitalize">
            {store.organisation_name}
          </div>

          <hr />

          {/* Address */}
          <div className="flex px-5 py-4 gap-4">
            <span className="text-blue-900 text-3xl">🏢</span>
            <div className="text-sm leading-6">
              <p>{store.address}</p>
              <p>{store?.zipcode}</p>
            </div>
          </div>

          {/* Phone */}
          {store?.phone && (
          <div className="flex px-5 pb-5 gap-4">
            <span className="text-blue-900 text-3xl">📞</span>
            <a
              href={`tel:+91${store.phone}`}
              className="text-sm text-blue-700 hover:underline"
            >
              +91 {store.phone}
            </a>
          </div>
          )}

          {/* phone after hours */}
          {store.phone_after_hours && (
          <div className="flex px-5 pb-5 gap-4">
            <span className="text-blue-900 text-3xl">☎️</span>
            <a
              href={`tel:+91${store.phone_after_hours}`}
              className="text-sm text-blue-700 hover:underline"
            >
              +91 {store.phone}
            </a>
          </div>
          )}
          {/* email */}
          {
            store.email && (
          <div className="flex px-5 pb-5 gap-4">
            <span className="text-blue-900 text-3xl">📧</span>
            <a href={`mailto:${store.email}`} className="text-sm leading-6 ">
              {store.email}
            </a>
          </div>
            )
          }
          {/* website */}
          {store.website && (
          <div className="flex px-5 pb-5 gap-4">
            <span className="text-blue-900 text-3xl">🌐</span>
            <div className="text-sm leading-6 ">
              <a
                href={store.website}
                className="hover:underline"
                target="_blank"
              >
                {store.website}
              </a>
            </div>
          </div>
          )}
          {/* description */}
          {store.description && (
          <div className="flex px-5 pb-5 gap-4">
            <span className="text-blue-900 text-3xl">📝</span>
            <div className="text-sm leading-6 ">{store.description}</div>
          </div>
          )}
        </div>

        {/* Right panel (map / image / content later) */}
        <div className="w-full rounded-2xl border shadow-sm bg-white flex items-center justify-center text-gray-500">
          <img
            src={store.images[0]}
            alt={store.organisation_name}
            className="max-h-[400px]"
          />
        </div>
      </div>

      {/* featured products */}
      {store.featured_products.length > 0 && (
        <section className="relative p-7 bg-gradient-to-r bg-[#a3ca43] rounded-xl">
          <h2 className="text-center text-white mb-7 text-2xl font-semibold">
            Featured Products
          </h2>

          {/* arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-full"
          >
            ‹
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-full"
          >
            ›
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {visible.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-40 h-40 bg-white rounded-full overflow-hidden shadow flex justify-center">
                  <img
                    src={item.image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white text-sm mt-3">{item.title}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {store.offers.length > 0 && (
        <div className="m-3">
          <h3 className="text-center font-bold text-2xl mb-6">Offers</h3>
          {store.offers.map((item, ind) => (
            <div
              className="bg-white rounded-xl shadow-sm overflow-hidden grid lg:grid-cols-[4fr_2fr]"
              key={ind}
            >
              <img
                className="w-full h-52 object-cover"
                src={item.image}
                alt="Winter Sale"
              />

              <div className="p-4 flex flex-col justify-around">
                <div className="text-center space-y-2">
                  <p className="text-2xl font-semibold">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    Valid till {item.valid}
                  </p>
                </div>

                <div className="text-center">
                  <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-full text-sm hover:bg-blue-50 transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Business Hours */}
        {store?.mon_sat && (
          <div className="bg-gray-200 border border-gray-300 rounded-xl p-4 text-sm">
            <h3 className="font-semibold text-lg">Business Hours</h3>

            <ul className="text-xs mt-2 space-y-1">
              <li className="flex justify-between">
                <span>Monday to Saturday</span>
                <span>
                  {formatTo12Hour(store?.mon_sat?.open) || "9 AM"} to{" "}
                  {formatTo12Hour(store?.mon_sat?.close) || "9 PM"}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>
                  {store.sunday.closed
                    ? "Store is closed"
                    : `${formatTo12Hour(store?.sunday?.open) || "9 AM"} to ${
                        formatTo12Hour(store?.sunday?.close) || "9 PM"
                      }`}
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Get Direction */}
        {store?.location && (
          <div className="bg-gray-200 border border-gray-300 rounded-xl p-4 text-sm">
            <h3 className="font-semibold text-lg">Get Direction</h3>

            <p className="text-xs mt-1">
              <a href={store.location} target="_blank" rel="noreferrer">
                📍 {store.location}
              </a>
            </p>

            <button className="mt-3 px-4 py-2 border border-blue-600 text-blue-600 rounded-full text-xs hover:bg-blue-50 transition">
              <a href={store.location} target="_blank" rel="noreferrer">
                Open in Maps
              </a>
            </button>
          </div>
        )}

        {/* Nearby Stores */}
        {/* <div className="bg-gray-200 border border-gray-300 rounded-xl p-4 text-sm">
          <h3 className="font-semibold text-lg">Nearby Stores</h3>

          <ul className="mt-2 space-y-1 text-xs">
            <li>Cycle World Pvt.Ltd Madurai — Madurai</li>
            <li>Cycle World Pvt.Ltd Madurai 2 — Madurai</li>
            <li>Cycle World Pvt.Ltd Madurai 3 — Madurai</li>
          </ul>
        </div> */}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {/* Parking Options */}
        {store?.parking && (
          <div className="bg-gray-200 border border-gray-300 rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-2">Parking Options</h3>
            <p className="text-xs text-slate-600 font-medium">
              {store.parking}
            </p>
          </div>
        )}

        {/* Payment Methods */}
        {store?.payment_method && (
          <div className="bg-gray-200 border border-gray-300 rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-2">Payment Methods</h3>

            <ul className="text-xs text-slate-600 font-medium list-disc ml-4">
              {store.payment_method?.split(",").map((item, index) => (
                <li key={index}>{item.trim()}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {store?.tags.length > 0 && (
          <div className="rounded-xl border border-gray-300 bg-gray-200 p-4 space-y-3">
            <h3 className="font-semibold">Tags</h3>

            <div className="flex flex-wrap gap-2 text-xs max-h-32 overflow-y-auto">
              {store.tags.map((item, ind) => (
                <div className="px-3 py-1 rounded-full bg-slate-100" key={ind}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Highlights */}
      {store?.highlights > 0 && (
        <section className="bg-gradient-to-r bg-[#a8c55d] text-white rounded-xl py-6 px-4 md:px-8">
          <h2 className="text-center text-lg md:text-3xl font-semibold mb-4">
            Highlights
          </h2>

          <div className="flex overflow-x-auto gap-4 md:gap-6 px-2 no-scrollbar">
            {store.highlights.map((item, ind) => (
              <div key={ind} className="flex-shrink-0 w-28 md:w-32 text-center">
                <img
                  className="w-full h-24 object-cover rounded"
                  src={item.image}
                  alt={item.label}
                />
                <p className="mt-1 text-xs md:text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Time line */}
      {store?.social_timeline > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-center">
            Social Timeline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {store.social_timeline?.map((post, ind) => (
              <article
                key={ind}
                className="bg-white rounded-xl overflow-hidden flex flex-col"
              >
                <div className="relative">
                  <img
                    className="w-full h-96 object-cover"
                    src={post.image}
                    alt="Timeline"
                  />

                  <a
                    href={post.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center text-white text-4xl"
                  >
                    ▶
                  </a>
                </div>

                <div className="p-3 text-[14px] font-medium bg-white border-b border-r border-l rounded-b-xl border-gray-300">
                  <p className="mb-4">{post.post_text}</p>

                  <div className="flex text-xs text-slate-600">
                    <p className="font-medium">Posted On :</p>
                    <span className="ml-1">
                      {new Date(post.date).toLocaleString()}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* About store */}
      <section className="space-x-4">
        <div className="w-full rounded-xl bg-[#a3ca43] text-center">
          <h2 className="font-bold text-xl px-2">About</h2>
          <h4>{store.organisation_name}</h4>
        </div>
      </section>
    </div>
  );
}
