"use client";
import { useState, useEffect } from "react";
import FranchiseEnquiriesComponent from "../components/franchise/franchise";

export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <FranchiseEnquiriesComponent />
      {time && <div className="sr-only">{time}</div>}
    </div>
  );
}
