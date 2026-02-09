import jwt from "jsonwebtoken";
import custom_combo from "@/models/custom_combo";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  const { guestId } = await req.json();
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token || !guestId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const userId = decoded.userId;

  // 1️⃣ Fetch guest combo
  const guestCombo = await custom_combo.findOne({ guestId });

  if (!guestCombo) {
    return NextResponse.json({
      success: 1,
      message: "No guest combo to merge",
    });
  }

  // 2️⃣ Fetch user combo
  let userCombo = await custom_combo.findOne({ userId });

  // 🔥 If user combo doesn't exist → convert guest combo
  if (!userCombo) {
    guestCombo.userId = userId;
    guestCombo.guestId = null;
    await guestCombo.save();

    return NextResponse.json({
      success: 1,
      message: "Guest combo assigned to user",
    });
  }

  // 3️⃣ Merge arrays by productId (KEEP selectedVariant)
  const mergeUnique = (userArr = [], guestArr = []) => {
    const map = new Map();

    userArr.forEach((item) => {
      map.set(item.productId.toString(), item);
    });

    guestArr.forEach((item) => {
      const key = item.productId.toString();
      if (!map.has(key)) {
        map.set(key, item);
      }
    });

    return Array.from(map.values());
  };

  userCombo.cycles = mergeUnique(userCombo.cycles, guestCombo.cycles);
  userCombo.accessories = mergeUnique(
    userCombo.accessories,
    guestCombo.accessories
  );
  userCombo.bags = mergeUnique(userCombo.bags, guestCombo.bags);

  await userCombo.save();

  // 4️⃣ Remove guest combo
  await custom_combo.deleteOne({ guestId });

  return NextResponse.json({
    success: 1,
    message: "Guest combo merged into user combo",
  });
}
