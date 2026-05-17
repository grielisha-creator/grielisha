import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ShoppingCart, Eye, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { useToast } from '../contexts/ToastContext'
import api from '../api/axios'
import { getImageUrl } from '../utils/image'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { success, error: showError } = useToast()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('products/')
      // Handle DRF pagination results or direct array
      const data = response.data.results || response.data
      setProducts(data)
    } catch (err) {
      setError("Failed to load products from ecosystem.")
      showError("Connection to product database failed.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('products/categories/')
      const data = response.data.results || response.data || []
      setCategories(['All Categories', ...(data || []).map(c => c.name)])
    } catch (err) {
      console.error("Failed to load categories")
    }
  }

  const filteredProducts = (products || []).filter(product => {
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Categories' || product.category === selectedCategory
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

  const handleAddToCart = (product) => {
    // Mock add to cart functionality
    success(`${product.name} added to cart!`)
  }

  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass rounded-xl overflow-hidden hover:bg-white/10 transition-all group cursor-pointer"
    >
      <div className="relative h-48 bg-gradient-to-br from-accent/20 to-glow/20 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <ShoppingCart className="text-accent/50" size={48} />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
        {product.stock_quantity <= 10 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Low Stock
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center text-accent text-sm">
            <Star size={14} className="fill-current" />
            {product.rating}
          </div>
        </div>
        
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-accent">
            KES {product.price.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400">
            {product.stock_quantity} in stock
          </span>
        </div>
        
        <div className="flex gap-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 glass hover:bg-white/20 text-white py-2 rounded-lg transition-all flex items-center justify-center group"
          >
            <Eye size={16} className="mr-1" />
            View
          </Link>
          <button
            onClick={() => handleAddToCart(product)}
            className="flex-1 bg-accent hover:bg-orange-600 text-white py-2 rounded-lg transition-all neon-glow-accent"
          >
            <ShoppingCart size={16} className="inline mr-1" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <LoadingSpinner size="large" text="Loading products..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-glow mb-4">
            Shop <span className="text-accent">Products</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Discover our premium collection of quality products
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
            >
              {(categories || []).map(category => (
                <option key={category} value={category === 'All Categories' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center text-gray-300">
              <Filter size={20} className="mr-2" />
              {filteredProducts.length} products found
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {(filteredProducts || []).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(filteredProducts || []).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="glass rounded-xl p-8 max-w-md mx-auto">
              <Search className="text-gray-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-gray-300">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop
