import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CreditCard, MapPin, Phone, Mail, CheckCircle, Shield, Smartphone, Landmark, Banknote, AlertCircle, RefreshCw } from 'lucide-react'
import api from '../api/axios'

const Checkout = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [placedOrderData, setPlacedOrderData] = useState(null)
  
  const [shippingInfo, setShippingInfo] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: ''
  })
  
  const [paymentMethod, setPaymentMethod] = useState('mpesa') // mpesa, bank, cash
  const [transactionCode, setTransactionCode] = useState('')

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await api.get('orders/cart/')
      setCartItems(response.data.items)
    } catch (err) {
      console.error("Failed to fetch cart")
    } finally {
      setLoading(false)
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  const shipping = 200 // Default flat rate
  const total = subtotal + shipping

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!shippingInfo.full_name) newErrors.full_name = 'Full name is required'
    if (!shippingInfo.email) newErrors.email = 'Email is required'
    if (!shippingInfo.phone) newErrors.phone = 'Phone number is required'
    if (!shippingInfo.address) newErrors.address = 'Address is required'
    if (!shippingInfo.city) newErrors.city = 'City is required'
    if (!shippingInfo.postal_code) newErrors.postal_code = 'Postal code is required'
    
    if (paymentMethod !== 'cash' && !transactionCode) {
      newErrors.transactionCode = 'Transaction code/reference is required'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsProcessing(true)
    setErrors({})

    try {
      // 1. Create the Order
      const orderResponse = await api.post('orders/create/', {
        shipping_address: shippingInfo.address,
        full_name: shippingInfo.full_name,
        phone: shippingInfo.phone,
        email: shippingInfo.email,
        city: shippingInfo.city,
        postal_code: shippingInfo.postal_code
      })

      const orderId = orderResponse.data.id

      // 2. Submit Payment Info
      await api.post('orders/payments/', {
        order: orderId,
        payment_method: paymentMethod,
        transaction_code: transactionCode || `COD-${orderId}-${Date.now()}`,
        amount: total
      })

      setPlacedOrderData(orderResponse.data)
      setOrderPlaced(true)
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Payment submission failed. Check your transaction code.'
      setErrors({ general: errorMsg })
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <Link to="/shop" className="bg-accent hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 max-w-md mx-auto text-center neon-glow"
        >
          <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-glow mb-4">Order Received!</h2>
          <p className="text-gray-300 mb-6">
            Your order has been submitted. Status: <span className="text-accent font-semibold">Pending Verification</span>.
          </p>
          <div className="space-y-2 mb-6 text-left glass-dark rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Order ID:</span>
              <span className="text-white">#{placedOrderData?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Amount Paid:</span>
              <span className="text-accent">KES {total.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-accent hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="w-full glass hover:bg-white/10 text-white py-3 rounded-lg font-semibold transition-all border border-white/20"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/cart" className="text-accent hover:text-orange-600 transition-colors flex items-center mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-glow mb-2">Checkout</h1>
          <p className="text-gray-400">Secure your Grielisha products & services</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {errors.general && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 flex items-center">
                <AlertCircle className="mr-3" /> {errors.general}
              </motion.div>
            )}

            {/* Step 1: Shipping */}
            <section className="glass rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center mr-3 text-sm">1</span>
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input type="text" name="full_name" value={shippingInfo.full_name} onChange={handleShippingChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-accent outline-none transition-all placeholder:text-white/10" placeholder="e.g. Kelvin Grielisha" />
                  {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleShippingChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-accent outline-none" placeholder="+254..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input type="email" name="email" value={shippingInfo.email} onChange={handleShippingChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-accent outline-none" placeholder="name@email.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Physical Address/Location</label>
                  <textarea name="address" value={shippingInfo.address} onChange={handleShippingChange} rows="2" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-accent outline-none resize-none" placeholder="Street, Building, Floor..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                  <input type="text" name="city" value={shippingInfo.city} onChange={handleShippingChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-accent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Postal Code</label>
                  <input type="text" name="postal_code" value={shippingInfo.postal_code} onChange={handleShippingChange} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-accent outline-none" />
                </div>
              </div>
            </section>

            {/* Step 2: Payment */}
            <section className="glass rounded-2xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center mr-3 text-sm">2</span>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { id: 'mpesa', icon: Smartphone, label: 'M-Pesa' },
                  { id: 'bank', icon: Landmark, label: 'Bank Transfer' },
                  { id: 'cash', icon: Banknote, label: 'Cash on Delivery' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => { setPaymentMethod(method.id); setTransactionCode(''); }}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                      paymentMethod === method.id 
                        ? 'bg-accent/10 border-accent text-white shadow-glow-accent' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <method.icon className="mb-2" size={24} />
                    <span className="font-semibold">{method.label}</span>
                  </button>
                ))}
              </div>

              <div className="glass-dark rounded-xl p-6 border border-white/5">
                <AnimatePresence mode="wait">
                  {paymentMethod === 'mpesa' && (
                    <motion.div key="mpesa" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="flex items-center text-accent mb-4">
                        <Smartphone className="mr-2" size={20} />
                        <h3 className="font-bold uppercase tracking-wider">M-Pesa Instructions</h3>
                      </div>
                      <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm">
                        <li>Go to M-Pesa Menu and select <strong>Send Money</strong>.</li>
                        <li>Enter Phone Number: <span className="text-white font-bold">0112 556 940</span> — <span className="text-accent">Griffin Elisha Omwandasi</span>.</li>
                        <li>Enter Amount: <span className="text-white font-bold">KES {total.toLocaleString()}</span>.</li>
                        <li>Complete the transfer, then paste the <strong>Confirmation Code</strong> below.</li>
                      </ol>
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Transaction Code (e.g. SJK4X5Y6Z7)</label>
                        <input type="text" value={transactionCode} onChange={(e) => setTransactionCode(e.target.value.toUpperCase())} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-accent outline-none font-mono" placeholder="Paste code here" />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'bank' && (
                    <motion.div key="bank" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                      <div className="flex items-center text-accent mb-4">
                        <Landmark className="mr-2" size={20} />
                        <h3 className="font-bold uppercase tracking-wider">Bank Transfer Instructions</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm bg-white/5 p-4 rounded-lg mb-4">
                        <span className="text-gray-400">Bank:</span>
                        <span className="text-white font-semibold">I&amp;M Bank</span>
                        <span className="text-gray-400">Account Name:</span>
                        <span className="text-white font-semibold">Griffin Elisha Omwandasi</span>
                        <span className="text-gray-400">Account Number:</span>
                        <span className="text-white font-semibold tracking-widest text-glow">06005971486150</span>
                        <span className="text-gray-400">Amount:</span>
                        <span className="text-accent font-bold">KES {total.toLocaleString()}</span>
                      </div>
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Payment Reference / Transaction ID</label>
                        <input type="text" value={transactionCode} onChange={(e) => setTransactionCode(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-accent outline-none" placeholder="Enter bank reference number" />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'cash' && (
                    <motion.div key="cash" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-4">
                      <Banknote className="mx-auto text-accent mb-4" size={48} />
                      <h3 className="text-xl font-bold text-white mb-2">Cash on Delivery</h3>
                      <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                        Pay for your items and services upon delivery or completion. 
                        Please ensure you have <span className="text-white font-semibold">KES {total.toLocaleString()}</span> ready.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {errors.transactionCode && <p className="text-red-500 text-xs mt-2">{errors.transactionCode}</p>}
              </div>
              
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5 flex items-start space-x-3">
                <Shield className="text-accent flex-shrink-0" size={20} />
                <p className="text-xs text-gray-400">
                  Payments are manually verified by our team. Orders are only processed after transaction confirmation.
                </p>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Summary</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1 pr-4">
                      <p className="text-white font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-white">KES {item.subtotal.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>KES {shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white pt-3 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-accent tracking-tighter">KES {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`w-full mt-8 py-4 rounded-xl font-bold flex items-center justify-center transition-all transform hover:scale-[1.02] shadow-glow-accent ${
                  isProcessing ? 'bg-accent/50 cursor-not-allowed' : 'bg-accent hover:bg-orange-600 text-white neon-glow-accent'
                }`}
              >
                {isProcessing ? (
                  <RefreshCw className="animate-spin mr-2" size={20} />
                ) : (
                  <CheckCircle className="mr-2" size={20} />
                )}
                {isProcessing ? 'Confirming...' : 'Place Order'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Checkout
