"use client";
import { useState, useEffect } from "react";

import FaqComponent from "@/components/faq/faq";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      
      <FaqComponent /> 
    </div>
  );
}
