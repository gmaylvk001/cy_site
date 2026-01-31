"use client";
import { useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

export default function ColorPicker({ onChange }) {
  const [color, setColor] = useState("#1f2937");

  const handleChange = (newColor) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  return (
    <div className="w-64 p-3 bg-[#1e1e1e] rounded-lg shadow-xl text-white">
      {/* Color Panel */}
      <HexColorPicker color={color} onChange={handleChange} />

      {/* Hex Input */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm">#</span>
        <HexColorInput
          color={color}
          onChange={handleChange}
          className="w-full bg-[#2d2d2d] px-2 py-1 rounded outline-none text-sm"
        />
      </div>
    </div>
  );
}
