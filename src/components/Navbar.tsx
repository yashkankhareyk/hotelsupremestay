import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Hotel, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0B132B] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Hotel className="w-7 h-7 md:w-8 md:h-8 text-[#F59E0B]" strokeWidth={2} />
            <span className="text-lg md:text-xl font-bold">Hotel Supreme Stay</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 lg:gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-white hover:text-[#F59E0B] transition-colors relative pb-1 text-sm lg:text-base ${
                  isActive ? 'text-[#F59E0B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F59E0B]' : ''
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-white hover:text-[#F59E0B] transition-colors relative pb-1 text-sm lg:text-base ${
                  isActive ? 'text-[#F59E0B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F59E0B]' : ''
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `text-white hover:text-[#F59E0B] transition-colors relative pb-1 text-sm lg:text-base ${
                  isActive ? 'text-[#F59E0B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F59E0B]' : ''
                }`
              }
            >
              Gallery
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-white hover:text-[#F59E0B] transition-colors relative pb-1 text-sm lg:text-base ${
                  isActive ? 'text-[#F59E0B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#F59E0B]' : ''
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-[#F59E0B] transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-700 mt-2 pt-4">
            <div className="flex flex-col space-y-3">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-white hover:text-[#F59E0B] transition-colors py-2 px-4 rounded-md ${
                    isActive ? 'text-[#F59E0B] bg-[#F59E0B]/10' : ''
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-white hover:text-[#F59E0B] transition-colors py-2 px-4 rounded-md ${
                    isActive ? 'text-[#F59E0B] bg-[#F59E0B]/10' : ''
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/gallery"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-white hover:text-[#F59E0B] transition-colors py-2 px-4 rounded-md ${
                    isActive ? 'text-[#F59E0B] bg-[#F59E0B]/10' : ''
                  }`
                }
              >
                Gallery
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-white hover:text-[#F59E0B] transition-colors py-2 px-4 rounded-md ${
                    isActive ? 'text-[#F59E0B] bg-[#F59E0B]/10' : ''
                  }`
                }
              >
                Contact
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
