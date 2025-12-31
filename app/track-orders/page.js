"use client";
import { useState, useEffect } from "react";

import TrackOrdersComponent from "@/components/track-orders/track-orders";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <TrackOrdersComponent /> {/* Use the Home component here */}
    </div>
  );
}
