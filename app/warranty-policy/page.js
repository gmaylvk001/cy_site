"use client";
import { useState, useEffect } from "react";

import WarrantyPolicyComponent from "@/components/warranty-policy/warranty-policy";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      
      <WarrantyPolicyComponent /> {/* Use the Home component here */}
    </div>
  );
}
