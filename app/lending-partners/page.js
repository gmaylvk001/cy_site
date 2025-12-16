"use client";
import { useState, useEffect } from "react";

import LendingPartnersComponent from "@/components/lending-partners/lending-partners";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <LendingPartnersComponent /> {/* Use the Home component here */}
    </div>
  );
}
