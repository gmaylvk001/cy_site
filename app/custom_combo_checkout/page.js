"use client";
import { useState, useEffect } from "react";

import Custom_Combo_Checkout from "@/components/checkout/combo_checkout";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      
      <Custom_Combo_Checkout /> {/* Use the Home component here */}
    </div>
  );
}
