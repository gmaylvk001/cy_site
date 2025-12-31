// app/franchise/page.js
"use client";
import { useState, useEffect } from "react";
import Franchise from '../../components/franchise/Franchise';

export default function FranchisePage() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);
  
  return <Franchise />;
}

