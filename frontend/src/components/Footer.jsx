import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass-dark border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Gelwo Tech Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-black text-white tracking-tight uppercase">
                <span className="text-[#7e389e] text-glow">GELWO</span> <span className="text-[#5b8a3e] text-glow-accent">TECHNOLOGIES</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              A registered Kenyan enterprise delivering integrated general supplies, smart ICT & biometric security networks, solar/renewable energy systems, and institutional training.
            </p>
            <p className="text-gray-400 text-xs font-semibold">
              AGPO CERT: SR/eGP/2025/30144 | IFMIS: 1013123
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  Company Profile
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-[#00E5FF] transition-colors text-sm">
                  Marketplace Catalog
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Mail size={16} className="text-[#00E5FF] shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm break-all">gelwotech@gmail.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <Phone size={16} className="text-accent shrink-0 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  <p>079-782-9911</p>
                  <p>0112556940</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="text-[#00E5FF] shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm leading-snug">
                  Lwande Apartment Door 52, along Kisumu-Kakamega Highway, Kakamega, Kenya
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Payment Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">M-Pesa Till/Mobile</p>
                <p className="text-white font-semibold">0797829911 / 0112556940</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Bank Transfer</p>
                <p className="text-white font-semibold">Kenya Commercial Bank (KCB)</p>
                <p className="text-[#00E5FF] font-mono text-xs">A/C: 1335480404</p>
                <p className="text-gray-400 text-[10px]">Gelwo Technologies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 pt-8 text-center">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} GELWO TECHNOLOGIES. All rights reserved. | 
            <Link to="/" className="hover:text-accent transition-colors ml-1.5">
              Privacy Policy
            </Link> | 
            <Link to="/" className="hover:text-[#00E5FF] transition-colors ml-1.5">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
