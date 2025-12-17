import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">About Hotel Supreme Stay</h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Experience luxury and comfort in the heart of Wagholi, Pune. We offer world-class hospitality with modern amenities and exceptional service.
            </p>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                <span className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Hotel Supreme Stay, Wagholi<br />
                  Pune, Maharashtra 412207<br />
                  India
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#F59E0B] flex-shrink-0" />
                <a href="tel:+919876543210" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors break-all">
                  +91 9657100900
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#F59E0B] flex-shrink-0 mt-1" />
                <a href="mailto:bookings@hotelsupremestay.in" className="text-sm sm:text-base text-gray-300 hover:text-[#F59E0B] transition-colors break-all">
                  bookings@hotelsupremestay.in
                </a>
              </li>
            </ul>

            <div className="flex gap-3 sm:gap-4 mt-5 sm:mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F59E0B] flex items-center justify-center hover:bg-[#d97706] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F59E0B] flex items-center justify-center hover:bg-[#d97706] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-400">&copy; {new Date().getFullYear()} Hotel Supreme Stay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
