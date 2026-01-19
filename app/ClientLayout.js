"use client";

import { usePathname } from "next/navigation";
import CustomHeader from "@/components/Headernew";
import CustomFooter from "@/components/Footer";
import GlobalModals from "@/components/GlobalModals";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { HeaderProvider } from "@/context/HeaderContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

    // pages where header/footer should be hidden
  const hideLayoutPages = ["/franchise","/thank-you"];
  const hideHeaderFooter = hideLayoutPages.some((p) => pathname?.startsWith(p));

  return (
    <HeaderProvider>
      <ModalProvider>
        <WishlistProvider>
          <CartProvider>
            <AuthProvider>
               {!pathname?.startsWith("/admin") && !hideHeaderFooter && <CustomHeader />}
              <main className="relative bg-gradient-to-r from-[#2a7b9b] via-[#57c785] to-[#eddd53]">{children}</main>
              {!pathname?.startsWith("/admin") && !hideHeaderFooter && <CustomFooter />}
              <GlobalModals />
            </AuthProvider>
          </CartProvider>
        </WishlistProvider>
      </ModalProvider>
    </HeaderProvider>
  );
}
