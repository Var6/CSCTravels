'use client';
import Link from 'next/link';
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

// 1. Define the types for the props here to fix the "any" error
interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const TopRibbon = () => {
  return (
    <div className="relative w-full z-50">
      {/* Background Gradient & Border */}
      <div className="w-full bg-gradient-to-r from-orange-700 via-orange-600 to-orange-500 text-white shadow-md border-b border-orange-400/30">
        
        {/* Container */}
        <div className="container mx-auto px-4 h-auto sm:h-10 flex flex-col sm:flex-row justify-between items-center py-2 sm:py-0">
          
          {/* LEFT SIDE: Contact Info */}
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-[11px] sm:text-xs font-medium tracking-wide">
            
            {/* Phone */}
            <a 
              href="tel:+919876543210" 
              className="flex items-center gap-2 hover:text-orange-100 transition-colors duration-200 group"
            >
              <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all">
                <Phone className="w-3 h-3" />
              </div>
              <span>+91 98765 43210</span>
            </a>

            {/* Vertical Separator (Hidden on mobile) */}
            <span className="hidden sm:block h-3 w-[1px] bg-orange-400/50"></span>

            {/* Email */}
            <a 
              href="mailto:info@citizencooperative.com" 
              className="flex items-center gap-2 hover:text-orange-100 transition-colors duration-200 group"
            >
              <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-all">
                <Mail className="w-3 h-3" />
              </div>
              <span>info@citizencooperative.com</span>
            </a>
          </div>

          {/* RIGHT SIDE: Social Media */}
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <div className="flex items-center gap-3">
              <SocialLink href="https://facebook.com" icon={<Facebook className="w-3.5 h-3.5" />} label="Facebook" />
              <SocialLink href="https://twitter.com" icon={<Twitter className="w-3.5 h-3.5" />} label="Twitter" />
              <SocialLink href="https://instagram.com" icon={<Instagram className="w-3.5 h-3.5" />} label="Instagram" />
              <SocialLink href="https://linkedin.com" icon={<Linkedin className="w-3.5 h-3.5" />} label="LinkedIn" />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

// 2. Apply the interface to the component props here
const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <Link 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="
      flex items-center justify-center 
      w-6 h-6 rounded-full 
      bg-black/10 hover:bg-white hover:text-orange-600 
      transition-all duration-300 ease-in-out
      hover:-translate-y-0.5
    "
  >
    {icon}
  </Link>
);

export default TopRibbon;