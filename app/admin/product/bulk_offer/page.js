"use client";
import { useState, useEffect } from "react";
import BulkOfferComponent from "@/app/admin/components/product/bulk-offer";

export default function BulkOfferPage() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <BulkOfferComponent />
    </div>
  );
}
