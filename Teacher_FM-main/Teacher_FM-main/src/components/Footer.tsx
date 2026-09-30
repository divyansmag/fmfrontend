import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#ecebf3] py-6 px-6 sm:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="text-[#7032e3] font-bold text-base tracking-tight">
            FutureMinds AI
          </span>
          <p className="text-[#8e8c99] text-xs mt-1">
            © 2024 FutureMinds Academy. All rights reserved.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-xs text-[#6b687a]">
          <Link to="#" className="hover:text-[#7032e3] transition-colors">
            Support Center
          </Link>
          <Link to="#" className="hover:text-[#7032e3] transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="hover:text-[#7032e3] transition-colors">
            Terms of Service
          </Link>
          <Link to="#" className="hover:text-[#7032e3] transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};
