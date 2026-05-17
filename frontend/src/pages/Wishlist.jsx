import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { getImageUrl } from '../utils/image'

const Wishlist = () => {
  const [wishlist, setWishlist] = useState({ products: [], services: [], product_details: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await api.get('products/wishlist/')
      setWishlist(response.data)
    } catch (err) {
      console.error("Failed to fetch wishlist")
    } finally {
      setLoading(false)
    }
  }

  const toggleWishlist = async (id, type) => {
    try {
      await api.post('products/wishlist/toggle/', { [type === 'product' ? 'product_id' : 'service_id']: id })
      fetchWishlist()
    } catch (err) {
      alert("Failed to update wishlist")
    }
  }

  const addToCart = async (id, type) => {
    try {
      await api.post('orders/cart/add/', { [type]: id, quantity: 1 })
      alert("Added to cart!")
    } catch (err) {
      alert("Failed to add to cart")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-glow mb-2 flex items-center">
            <Heart className="mr-3 text-red-500 fill-red-500 animate-pulse" />
            My <span className="text-accent">Wishlist</span>
          </h1>
          <p className="text-gray-400">Your hand-picked favorites in one place</p>
        </motion.div>

        {wishlist.product_details.length === 0 && wishlist.services.length === 0 ? (
          <div className="glass rounded-2xl p-20 text-center">
            <div className="flex justify-center mb-6">
              <Heart className="text-gray-600" size={64} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-8">Start hearting items you love to see them here!</p>
            <Link to="/shop" className="btn-premium inline-flex items-center">
              Go Shopping <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(wishlist?.product_details || []).map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass rounded-xl overflow-hidden group"
              >
                <div className="relative h-48 bg-white/5 flex items-center justify-center">
                  {product.image ? (
                    <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingCart className="text-white/10" size={64} />
                  )}
                  <button
                    onClick={() => toggleWishlist(product.id, 'product')}
                    className="absolute top-4 right-4 p-2 glass rounded-full text-red-500 hover:scale-110 transition-transform"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-accent font-bold mb-4">KES {parseFloat(product.price).toLocaleString()}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(product.id, 'product')}
                      className="flex-1 btn-premium flex items-center justify-center text-sm"
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="p-2 glass text-gray-400 hover:text-white transition-colors"
                    >
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
