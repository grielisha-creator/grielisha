import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Disc } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="glass-dark border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="GRIELISHA Logo" className="w-10 h-10 object-contain neon-glow rounded-lg" />
              <span className="text-xl font-bold text-glow">GRIELISHA</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your premier destination for quality products, professional services, and innovative digital solutions.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/grielisha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-all hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="https://tiktok.com/@grielisha" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-all hover:scale-110">
                <Disc size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  Shop Products
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-accent transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Core Ecosystem</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300 text-sm">Digital Shop</span></li>
              <li><span className="text-gray-300 text-sm">Professional Services</span></li>
              <li><span className="text-gray-300 text-sm">Tech Solutions</span></li>
              <li><span className="text-gray-300 text-sm">Operations Management</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-accent" />
                <span className="text-gray-300 text-sm">grielishadigital@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-accent" />
                <span className="text-gray-300 text-sm">+254112556940</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-accent" />
                <span className="text-gray-300 text-sm">Kisumu, Kenya</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Payment Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">M-Pesa</p>
                <p className="text-white font-semibold">0112 556 940</p>
                <p className="text-gray-400 text-xs">Griffin Elisha Omwandasi</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Bank Transfer</p>
                <p className="text-white font-semibold">I&amp;M Bank</p>
                <p className="text-gray-300">A/C: 06005971486150</p>
                <p className="text-gray-400 text-xs">Griffin Elisha Omwandasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} GRIELISHA. All rights reserved. | 
            <Link to="/privacy" className="hover:text-accent transition-colors ml-1">
              Privacy Policy
            </Link> | 
            <Link to="/terms" className="hover:text-accent transition-colors ml-1">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
