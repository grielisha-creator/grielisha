import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, ShoppingCart, Eye, Star, Calendar, Clock, DollarSign, 
  ArrowRight, Sparkles, Layers, MessageSquare, Tag, Package, Check
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../contexts/ToastContext'
import api from '../api/axios'
import { getImageUrl } from '../utils/image'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') === 'services' ? 'services' : 'products'

  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  
  const [productCategories, setProductCategories] = useState([])
  const [selectedProductCategory, setSelectedProductCategory] = useState('')
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { success, error: showError } = useToast()

  const serviceCategories = [
    "All Services",
    "General Supplies",
    "ICT & Security Solutions",
    "Electrical & Energy",
    "Branding & Communications",
    "Consultancy & Training",
    "Cleaning & Landscaping",
    "Mitigation & Works",
    "Foodstuff & Poultry"
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch products, services, and product categories in parallel
        const [productsRes, servicesRes, categoriesRes] = await Promise.all([
          api.get('products/'),
          api.get('services/'),
          api.get('products/categories/')
        ])
        
        const productsData = productsRes.data.results || productsRes.data || []
        const servicesData = servicesRes.data.results || servicesRes.data || []
        const categoriesData = categoriesRes.data.results || categoriesRes.data || []
        
        setProducts(productsData)
        setServices(servicesData)
        setProductCategories(['All Categories', ...categoriesData.map(c => c.name)])
        
      } catch (err) {
        console.error(err)
        setError("Failed to load marketplace catalog.")
        showError("Could not retrieve catalog data.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleTabChange = (tab) => {
    setSearchParams({ tab })
    setSearchTerm('')
    setSortBy('name')
  }

  // Map service type to categories based on Gelwo 14 core areas
  const getCategoryForService = (serviceType) => {
    const type = (serviceType || '').toLowerCase()
    if (['car_detailing', 'chauffeur_services'].includes(type)) return 'General Supplies'
    if (['website_development', 'system_development', 'graphic_design'].includes(type)) return 'ICT & Security Solutions'
    if (['office_cleaning', 'house_cleaning', 'compound_cleaning'].includes(type)) return 'Cleaning & Landscaping'
    // Fallback based on Gelwo core specifications
    if (type.includes('solar') || type.includes('electric')) return 'Electrical & Energy'
    if (type.includes('branding') || type.includes('print')) return 'Branding & Communications'
    if (type.includes('consult') || type.includes('train')) return 'Consultancy & Training'
    if (type.includes('food') || type.includes('cereal') || type.includes('poultry')) return 'Foodstuff & Poultry'
    if (type.includes('construction') || type.includes('drain') || type.includes('mitigat')) return 'Mitigation & Works'
    return 'General Supplies'
  }

  // Filtered lists
  const filteredProducts = (products || []).filter(product => {
    const matchesCategory = selectedProductCategory === '' || selectedProductCategory === 'All Categories' || product.category === selectedProductCategory
    const matchesSearch = product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0)
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0)
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  const filteredServices = (services || []).filter(service => {
    const serviceCat = getCategoryForService(service.service_type)
    const matchesCategory = selectedServiceCategory === '' || selectedServiceCategory === 'All Services' || serviceCat === selectedServiceCategory
    const matchesSearch = service.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
    if (sortBy === 'price-low') return (a.base_price || 0) - (b.base_price || 0)
    if (sortBy === 'price-high') return (b.base_price || 0) - (a.base_price || 0)
    return 0
  })

  const handleAddToCart = (product) => {
    // Dispatch custom event to sync layout or use contexts
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    success(`${product.name} added to cart!`)
  }

  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all group flex flex-col justify-between"
    >
      <div>
        <div className="relative h-48 bg-gradient-to-br from-accent/10 to-glow/10 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <Package className="text-accent/40" size={48} />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <div className="absolute top-3 right-3 bg-accent text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
              Low Stock
            </div>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
              Out of stock
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center text-accent text-xs font-semibold shrink-0">
              <Star size={12} className="fill-current mr-0.5" />
              {product.rating || '5.0'}
            </div>
          </div>
          
          <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
      
      <div className="p-5 pt-0">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-black text-glow">
            KES {parseFloat(product.price).toLocaleString()}
          </span>
          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">
            {product.stock_quantity} available
          </span>
        </div>
        
        <div className="flex gap-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 glass hover:bg-white/20 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Eye size={14} />
            Details
          </Link>
          <button
            onClick={() => handleAddToCart(product)}
            disabled={product.stock_quantity === 0}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              product.stock_quantity === 0 
                ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' 
                : 'bg-accent hover:bg-orange-600 text-white neon-glow-accent'
            }`}
          >
            <ShoppingCart size={14} />
            Add Cart
          </button>
        </div>
      </div>
    </motion.div>
  )

  const ServiceCard = ({ service, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass rounded-2xl overflow-hidden hover:bg-white/10 transition-all group flex flex-col justify-between"
    >
      <div>
        <div className="relative h-48 bg-gradient-to-br from-accent/10 to-glow/10 flex items-center justify-center overflow-hidden">
          {service.image ? (
            <img src={getImageUrl(service.image)} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <Calendar className="text-glow/40" size={48} />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
          <div className="absolute top-3 left-3 bg-[#00E5FF]/20 text-[#00E5FF] text-[9px] uppercase font-black px-2 py-0.5 rounded border border-[#00E5FF]/30">
            {getCategoryForService(service.service_type)}
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors mb-2 line-clamp-1">
            {service.name}
          </h3>
          <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {(service.features || []).slice(0, 2).map((feat, idx) => (
              <span key={idx} className="text-[10px] bg-white/5 border border-white/5 text-gray-300 px-2 py-0.5 rounded">
                {feat}
              </span>
            ))}
            {(service.features || []).length > 2 && (
              <span className="text-[10px] text-gray-500 font-bold self-center">+{service.features.length - 2} more</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between mb-4 text-xs">
          <div className="flex items-center text-gray-300">
            <Clock size={14} className="mr-1 text-accent" />
            <span>Est. Duration: {service.duration_hours} Hrs</span>
          </div>
          <div className="flex items-center text-[#00E5FF] font-black">
            <DollarSign size={14} className="mr-0.5" />
            <span>KES {parseFloat(service.base_price).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Link
            to={`/booking/${service.id}`}
            className="w-full bg-accent hover:bg-orange-600 text-white py-2 rounded-lg transition-all flex items-center justify-center font-bold text-xs gap-1.5 neon-glow-accent"
          >
            <Calendar size={14} />
            Direct Booking
          </Link>
          <a
            href={`https://wa.me/254797829911?text=Hello, I am interested in getting a quotation and details for the ${service.name} service.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition-all flex items-center justify-center text-xs font-bold gap-1.5"
          >
            <MessageSquare size={14} />
            WhatsApp Quotation
          </a>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh pt-20">
        <LoadingSpinner size="large" text="Syncing marketplace catalogs..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh pt-20">
        <ErrorMessage message={error} />
      </div>
    )
  }

  const itemsList = activeTab === 'products' ? filteredProducts : filteredServices

  return (
    <div className="min-h-screen bg-mesh pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3 text-xs text-glow-accent">
              <Sparkles size={12} />
              <span>GELWO TECHNOLOGIES Operational Catalog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
              Gelwo <span className="text-[#00E5FF] text-glow">Marketplace</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1.5">
              Secure authentic stationery, equipment, or book professional services directly.
            </p>
          </div>

          {/* Toggle Switcher */}
          <div className="flex bg-black/40 p-1.5 rounded-full border border-white/10 self-stretch md:self-auto">
            <button
              onClick={() => handleTabChange('products')}
              className={`flex-1 md:flex-initial px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-accent text-white shadow-lg neon-glow-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Package size={16} />
              Products
            </button>
            <button
              onClick={() => handleTabChange('services')}
              className={`flex-1 md:flex-initial px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'services'
                  ? 'bg-accent text-white shadow-lg neon-glow-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar size={16} />
              Services
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={activeTab === 'products' ? "Search products..." : "Search services..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
              />
            </div>

            {/* Category Filter */}
            {activeTab === 'products' ? (
              <select
                value={selectedProductCategory}
                onChange={(e) => setSelectedProductCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
              >
                {(productCategories || []).map(cat => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat} className="bg-primary text-white">
                    {cat}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedServiceCategory}
                onChange={(e) => setSelectedServiceCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
              >
                {(serviceCategories || []).map(cat => (
                  <option key={cat} value={cat === 'All Services' ? '' : cat} className="bg-primary text-white">
                    {cat}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
            >
              <option value="name" className="bg-primary text-white">Sort by Name</option>
              <option value="price-low" className="bg-primary text-white">Price: Low to High</option>
              <option value="price-high" className="bg-primary text-white">Price: High to Low</option>
              {activeTab === 'products' && <option value="rating" className="bg-primary text-white">Highest Rated</option>}
            </select>

            {/* Results Count indicator */}
            <div className="flex items-center justify-center text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 rounded-xl py-2 px-4">
              <Layers size={14} className="mr-2 text-accent" />
              <span>{itemsList.length} items cataloged</span>
            </div>
          </div>
        </div>

        {/* Catalog Items Grid */}
        <AnimatePresence mode="wait">
          {itemsList.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {activeTab === 'products' 
                ? filteredProducts.map((prod, index) => <ProductCard key={prod.id} product={prod} index={index} />)
                : filteredServices.map((serv, index) => <ServiceCard key={serv.id} service={serv} index={index} />)
              }
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="glass rounded-3xl p-12 max-w-md mx-auto border border-white/10">
                <Search className="text-gray-500 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">No matching items found</h3>
                <p className="text-gray-400 text-sm">
                  Try refining your search terms or selecting another category filter.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

export default Shop
