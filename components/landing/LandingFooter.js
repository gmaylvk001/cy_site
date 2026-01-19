import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaLinkedin 
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="bg-gradient-to-r from-[#2a7b9b] via-[#57c785] to-[#eddd53] text-white py-8 px-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between">
        {/* Logo */}
        <div className="mb-8 md:mb-0 md:self-start flex justify-center md:justify-start w-full md:w-auto">
          <Link href="/" aria-label="Unilet Home">
            <img
              src="/user/cw-logo.jpg"
              alt="Unilet" width="100" height="80"
              className="h-auto"
            />
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <h3 className="font-bold text-lg mb-2 text-black">Contact Info</h3>
          <p>
            <strong className="text-black">Contact No :</strong>{" "}
            <Link href="tel:+918152918888" className="underline  text-black">
              +918152918888
            </Link>
          </p>
          <p>
            <strong className="text-black">Mail Us At :</strong>{" "}
            <Link
              href="mailto:franchise@cycleworld.in"
              className="underline  text-black"
            >
               franchise@cycleworld.in
            </Link>
          </p>
        </div>

        {/* Follow Us */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-lg mb-2 text-black">Follow Us</h3>
          <div className="flex space-x-4 justify-center md:justify-start text-xl">
            <Link
              href="https://www.facebook.com/cycleworld.in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-600 text-black"
            >
              <FaFacebookF />
            </Link>

            <Link
              href="https://x.com/CycleWorld6"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-blue-400 text-black"
            >
              <FaXTwitter />
            </Link>

            <Link
              href="https://www.instagram.com/cycleworld_in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-500 text-black"
            >
              <FaInstagram />
            </Link>

            <Link
              href="https://wa.me/918152918888"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Whatsapp"
              className="hover:text-green-500 text-black"
            >
              <FaWhatsapp />
            </Link>

            <Link
              href="https://www.youtube.com/channel/UCHajvqxaqyZ8ie_dUCxqMIw?view_as=subscriber"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:text-red-600 text-black"
            >
              <FaYoutube />
            </Link>
             <Link
              href="https://www.linkedin.com/company/cycleworldcw/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Linkedin"
              className="hover:text-blue-600 text-black"
            >
              <FaLinkedin  />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
