import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Star, Package, ArrowLeft, Plus, Minus, Heart } from 'lucide-react'
import api from '../api/axios'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [prodRes, wishRes] = await Promise.all([
          api.get(`products/${id}/`),
          api.get('products/wishlist/').catch(() => ({ data: { products: [] } }))
        ])
        const prodData = prodRes.data
        if (typeof prodData.features === 'string') {
          try { prodData.features = JSON.parse(prodData.features) } catch(e) { prodData.features = [] }
        }
        if (!Array.isArray(prodData.features)) prodData.features = []
        
        if (typeof prodData.specifications === 'string') {
          try { prodData.specifications = JSON.parse(prodData.specifications) } catch(e) { prodData.specifications = {} }
        }
        if (!prodData.specifications || typeof prodData.specifications !== 'object') prodData.specifications = {}
        
        setProduct(prodData)
        setIsWishlisted(wishRes.data.products.includes(parseInt(id)))
      } catch (err) {
        console.error("Failed to fetch product data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleAddToCart = async () => {
    try {
      setAddedToCart(true)
      await api.post('orders/cart/add/', { product: id, quantity })
      setTimeout(() => setAddedToCart(false), 3000)
    } catch (err) {
      alert("Failed to add to cart")
      setAddedToCart(false)
    }
  }

  const toggleWishlist = async () => {
    try {
      const res = await api.post('products/wishlist/toggle/', { product_id: id })
      setIsWishlisted(res.data.status === 'added')
    } catch (err) {
      console.error("Wishlist toggle error")
    }
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product.stock_quantity || 1)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <div className="text-center">
          <Package className="text-gray-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-300 mb-4">The product you're looking for doesn't exist.</p>
          <Link to="/shop" className="bg-accent hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/shop" className="text-accent hover:text-orange-600 transition-colors flex items-center">
            <ArrowLeft size={20} className="mr-2" />
            Back to Shop
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass rounded-xl overflow-hidden neon-glow">
              <div className="h-96 bg-gradient-to-br from-accent/20 to-glow/20 flex items-center justify-center relative overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                ) : (
                  <Package className="text-accent/50" size={96} />
                )}
                <div className="absolute inset-0 bg-black/20 pointer-events-none transition-colors"></div>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-glow mb-2">{product.name}</h1>
              <p className="text-gray-300 text-lg">{product.category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'text-accent fill-current' : 'text-gray-600'}
                  />
                ))}
              </div>
              <span className="text-accent font-semibold">{product.rating}</span>
              <span className="text-gray-300">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-bold text-accent">
                KES {product.price.toLocaleString()}
              </span>
              <span className="text-gray-300">
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">Quantity:</span>
                <div className="flex items-center glass rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 text-gray-300 hover:text-accent transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="px-4 py-2 text-white font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 text-gray-300 hover:text-accent transition-colors disabled:opacity-50"
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center ${
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : product.stock_quantity === 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-accent hover:bg-orange-600 text-white neon-glow-accent'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Added to Cart!
                    </>
                  ) : product.stock_quantity === 0 ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingCart size={20} className="mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-3 rounded-lg border transition-all transform hover:scale-110 ${
                    isWishlisted 
                      ? 'bg-red-500/10 border-red-500 text-red-500' 
                      : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Heart size={24} className={isWishlisted ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Specifications</h3>
              <div className="glass rounded-lg p-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-white/10 last:border-0">
                    <span className="text-gray-300 capitalize">{key.replace('_', ' ')}:</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-glow mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.related_products?.length > 0 ? (
              product.related_products.map((item) => (
                <Link 
                  key={item.id} 
                  to={`/product/${item.id}`}
                  className="glass rounded-xl p-6 hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="h-32 bg-gradient-to-br from-accent/20 to-glow/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <Package className="text-accent/50" size={48} />
                    )}
                  </div>
                  <h3 className="text-white font-semibold mb-2 truncate">{item.name}</h3>
                  <p className="text-accent font-bold">KES {parseFloat(item.price).toLocaleString()}</p>
                </Link>
              ))
            ) : (
              <p className="text-gray-400">Discovering more treasures for you...</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetails
