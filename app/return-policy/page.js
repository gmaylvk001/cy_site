"use client";
import { useState, useEffect } from "react";

import ReturnPolicyComponent from "@/components/return-policy/return-policy";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      
      <ReturnPolicyComponent /> {/* Use the Home component here */}
    </div>
  );
}
