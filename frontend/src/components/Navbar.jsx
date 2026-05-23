import { useState, useEffect, memo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, LogOut, Heart, Globe, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking') // checking, online, offline
  const [cartCount, setCartCount] = useState(0)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const fetchCartCount = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setCartCount(0)
      return
    }
    try {
      const response = await api.get('orders/cart/')
      const items = response.data?.items || response.data?.results || []
      const count = Array.isArray(items) ? items.reduce((sum, item) => sum + item.quantity, 0) : 0
      setCartCount(count)
    } catch (err) {
      console.error('Failed to fetch cart count', err)
      setCartCount(0)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    
    // Ecosystem Heartbeat: Check connection to the Backend
    const checkEcho = async () => {
      try {
        await api.get('') // Hits the root api_info
        setApiStatus('online')
      } catch (err) {
        setApiStatus('offline')
      }
    }
    
    checkEcho()
    fetchCartCount()
    
    const interval = setInterval(checkEcho, 60000) // Pulse every minute
    
    // Listen for cart changes
    window.addEventListener('cartUpdated', fetchCartCount)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
      window.removeEventListener('cartUpdated', fetchCartCount)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'glass-dark shadow-lg' : 'glass'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <img src="/logo.png" alt="Gelwo Tech Logo" className="h-10 w-10 object-contain transform group-hover:scale-110 transition-all duration-300" />
            <span className="text-xl font-black text-white tracking-tight uppercase">
              <span className="text-[#7e389e] text-glow">GELWO</span> <span className="text-[#5b8a3e] text-glow-accent">TECH</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-white hover:text-accent font-bold transition-colors text-sm ${
                location.pathname === '/' ? 'text-accent text-glow-accent font-extrabold' : ''
              }`}
            >
              Company Profile
            </Link>
            <Link 
              to="/shop" 
              className={`text-white hover:text-[#00E5FF] font-bold transition-colors text-sm ${
                location.pathname === '/shop' ? 'text-[#00E5FF] text-glow font-extrabold' : ''
              }`}
            >
              Marketplace
            </Link>
            
            <Link 
              to="/wishlist" 
              className="relative p-2 text-white hover:text-red-500 transition-colors group"
            >
              <Heart size={20} className={location.pathname === '/wishlist' ? 'fill-red-500 text-red-500 shadow-glow-red' : ''} />
            </Link>

            <Link 
              to="/cart" 
              className="relative p-2 text-white hover:text-accent transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center neon-glow-accent animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Ecosystem Pulse Monitor */}
            <div className="flex items-center space-x-1 pl-2 border-l border-white/10">
              <div className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'online' ? 'bg-green-500 shadow-glow' : apiStatus === 'offline' ? 'bg-red-500 shadow-glow-red' : 'bg-yellow-500 animate-pulse'}`}></div>
              <span className="text-[8px] text-gray-500 font-mono tracking-tighter uppercase">{apiStatus === 'online' ? 'Live' : apiStatus === 'offline' ? 'Offline' : 'Sync'}</span>
            </div>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4 border-l border-white/10 pl-4">
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-accent transition-colors"
                  title="User Dashboard"
                >
                  <User size={20} />
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin-dashboard" 
                    className="text-[#00E5FF] hover:text-accent transition-colors font-bold text-xs bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2 py-0.5 rounded"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-accent transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 border-l border-white/10 pl-4">
                <Link 
                  to="/login" 
                  className="text-white hover:text-accent transition-colors text-sm font-semibold"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-accent hover:bg-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all transform hover:scale-105 neon-glow-accent"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-accent transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden glass-dark rounded-xl mt-2 p-4 border border-white/10">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-accent font-bold transition-colors text-sm"
                onClick={() => setIsOpen(false)}
              >
                Company Profile
              </Link>
              <Link 
                to="/shop" 
                className="text-white hover:text-[#00E5FF] font-bold transition-colors text-sm"
                onClick={() => setIsOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                to="/cart" 
                className="text-white hover:text-accent transition-colors text-sm flex items-center justify-between"
                onClick={() => setIsOpen(false)}
              >
                <span>Cart</span>
                {cartCount > 0 && <span className="bg-accent px-2 py-0.5 rounded text-[10px] text-white font-bold">{cartCount}</span>}
              </Link>
              <Link 
                to="/wishlist" 
                className="text-white hover:text-red-500 transition-colors text-sm"
                onClick={() => setIsOpen(false)}
              >
                Wishlist
              </Link>
              
              {user ? (
                <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                  <Link 
                    to="/dashboard" 
                    className="text-white hover:text-accent text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    User Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin-dashboard" 
                      className="text-[#00E5FF] hover:text-accent text-sm font-bold"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard Hub
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="text-white hover:text-accent transition-colors text-left text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                  <Link 
                    to="/login" 
                    className="text-white hover:text-accent text-sm font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-accent hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-center text-sm font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default memo(Navbar)
