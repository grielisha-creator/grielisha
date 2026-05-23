import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import api from '../api/axios'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setCartItems([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const response = await api.get('orders/cart/')
      // Cart endpoint returns a cart object with nested 'items' array
      const items = response.data?.items || response.data?.results || []
      setCartItems(Array.isArray(items) ? items : [])
    } catch (err) {
      console.error('Failed to load cart', err)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = async (itemId, change) => {
    const item = cartItems.find(i => i.id === itemId)
    if (!item) return
    const newQty = item.quantity + change
    if (newQty <= 0) {
      handleRemoveItem(itemId)
      return
    }
    try {
      await api.patch(`orders/cart/item/${itemId}/`, { quantity: newQty })
      setCartItems(prev => prev.map(i =>
        i.id === itemId ? { ...i, quantity: newQty, subtotal: newQty * parseFloat(i.price) } : i
      ))
    } catch (err) {
      console.error('Quantity update failed', err)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`orders/cart/item/${itemId}/`)
      setCartItems(prev => prev.filter(i => i.id !== itemId))
    } catch (err) {
      // Optimistically remove even on error
      setCartItems(prev => prev.filter(i => i.id !== itemId))
    }
  }

  const cartArray = Array.isArray(cartItems) ? cartItems : []
  const totalAmount = cartArray.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0)
  const itemCount = cartArray.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
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
            Shopping <span className="text-accent">Cart</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Review and manage your selected items
          </p>
        </motion.div>

        {cartArray.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    Cart Items ({itemCount})
                  </h2>
                  <button className="text-accent hover:text-orange-600 transition-colors text-sm">
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-4">
                  {cartArray.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="glass-dark rounded-lg p-4 hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-glow/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="text-accent/50" size={32} />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">
                            {item.name || item.product?.name || 'Product'}
                          </h3>
                          <p className="text-accent font-bold">
                            KES {parseFloat(item.price || item.product?.price || 0).toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="p-1 text-gray-400 hover:text-accent transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="text-white font-semibold min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-1 text-gray-400 hover:text-accent transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Subtotal and Remove */}
                        <div className="text-right">
                          <p className="text-white font-bold mb-2">
                            KES {parseFloat(item.subtotal || 0).toLocaleString()}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="glass rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>KES {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>KES 500</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>KES {(totalAmount * 0.16).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span className="text-accent">
                        KES {(totalAmount + 500 + totalAmount * 0.16).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/checkout"
                    className="w-full bg-accent hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 neon-glow-accent flex items-center justify-center"
                  >
                    Proceed to Checkout
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                  
                  <Link
                    to="/shop"
                    className="w-full glass hover:bg-white/10 text-white py-3 rounded-lg font-semibold transition-all border border-white/20 flex items-center justify-center"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Promo Code */}
                <div className="mt-6">
                  <p className="text-gray-300 text-sm mb-2">Have a promo code?</p>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors text-sm"
                    />
                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="glass rounded-xl p-8 max-w-md mx-auto">
              <ShoppingCart className="text-gray-400 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
              <p className="text-gray-300 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/shop"
                className="bg-accent hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-all inline-flex items-center"
              >
                Start Shopping
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Cart
