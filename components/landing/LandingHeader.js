import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="bg-gradient-to-r from-[#2a7b9b] via-[#57c785] to-[#eddd53] text-white">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/franchise">
          <img
            src="/user/cw-logo.jpg"
            alt="Unilet" width="100" height="80"
            className="h-auto"
          />
          </Link>
        </div>
        {/* Menu Items */}
      <ul className="hidden md:flex space-x-8 font-semibold text-sm">
        <li>
          <Link
            href="#why"
            className="text-lg text-black hover:underline hover:text-black"
          >
            Why Partner
          </Link>
        </li>

         <li>
          <Link
            href="#testimonials"
            className="text-lg text-black hover:underline hover:text-black"
          >
            Testimonials
          </Link>
        </li>

        <li>
          <Link
            href="#support"
            className="text-lg text-black hover:underline hover:text-black"
          >
            Support
          </Link>
        </li>

        <li>
          <Link
            href="#process"
            className="text-lg text-black hover:underline hover:text-black"
          >
            Process
          </Link>
        </li>

        <li>
          <Link
            href="#faq"
            className="text-lg text-black hover:underline hover:text-black"
          >
            Faq
          </Link>
        </li>
      </ul>

      </nav>
    </header>
  );
}
