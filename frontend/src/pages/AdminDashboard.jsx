import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, ShoppingBag, Calendar, DollarSign, Package, TrendingUp, Eye, Edit, Trash2, Check, X, Plus, AlertCircle, Smartphone, Landmark, Banknote, CreditCard, RefreshCw, Zap } from 'lucide-react'
import api from '../api/axios'
import Modal, { ModalBody, ModalFooter } from '../components/Modal'
import Input from '../components/Input'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [orders, setOrders] = useState([])
  const [payments, setPayments] = useState([])
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [activities, setActivities] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLogisticsModalOpen, setIsLogisticsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('product') // 'product' | 'service'
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [formData, setFormData] = useState({})
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState([])
  const [selectedServiceIds, setSelectedServiceIds] = useState([])

  useEffect(() => {
    fetchDashboardData()
    fetchCategories()

    // Real-time synchronization: Poll every 45 seconds to keep metrics fresh
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 45000)

    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, ordersRes, productsRes, servicesRes, activityRes, paymentsRes, usersRes, bookingsRes] = await Promise.all([
        api.get('products/stats/summary/'),
        api.get('orders/'),
        api.get('products/'),
        api.get('services/'),
        api.get('auth/activity-log/'),
        api.get('orders/payments/admin/'),
        api.get('auth/users/'),
        api.get('bookings/')
      ])
      setStats(statsRes.data.results || statsRes.data || {})
      setOrders(ordersRes.data?.results || ordersRes.data || [])
      setProducts(productsRes.data?.results || productsRes.data || [])
      setServices(servicesRes.data?.results || servicesRes.data || [])
      setActivities(activityRes.data?.results || activityRes.data || [])
      setPayments(paymentsRes.data?.results || paymentsRes.data || [])
      setUsers(usersRes.data?.results || usersRes.data || [])
      setBookings(bookingsRes.data?.results || bookingsRes.data || [])
      setError(null)
    } catch (err) {
      console.error("Dashboard fetch error:", err)
      setError("Failed to synchronize ecosystem data.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPayment = async (id, action) => {
    try {
      await api.post(`orders/payments/${id}/verify/`, { action })
      fetchDashboardData()
    } catch (err) {
      alert("Action failed")
    }
  }

  const handleOpenModal = (type, item = null) => {
    setModalType(type)
    setIsEditing(!!item)
    setEditingItem(item)
    setFormData(item ? { ...item } : {})
    setIsModalOpen(true)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const endpoint = modalType === 'product' ? 'products/' : 'services/'
      if (isEditing && editingItem) {
        await api.patch(`${endpoint}${editingItem.id}/`, formData)
      } else {
        await api.post(endpoint, formData)
      }
      setIsModalOpen(false)
      setFormData({})
      fetchDashboardData()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || `Failed to save ${modalType}.`
      const details = typeof errorMsg === 'object' ? Object.entries(errorMsg).map(([k, v]) => `${k}: ${v}`).join(', ') : errorMsg
      alert(`Error: ${details}`)
    }
  }

  const handleUpdateLogistics = async (e) => {
    e.preventDefault()
    try {
      const endpoint = selectedEntry.type === 'Booking' ? `bookings/${selectedEntry.id}/` : `orders/${selectedEntry.id}/`
      const payload = selectedEntry.type === 'Booking' 
        ? { status: formData.status || 'pending' }
        : {
            delivery_status: formData.delivery_status || 'pending',
            transport_provider: formData.transport_provider || null,
            tracking_number: formData.tracking_number || null,
            estimated_delivery_date: formData.estimated_delivery_date || null
          }
          
      await api.patch(endpoint, payload)
      setIsLogisticsModalOpen(false)
      setIsBookingModalOpen(false)
      fetchDashboardData()
    } catch (err) {
      console.error("Update Logistics Error:", err.response?.data || err)
      const errorData = err.response?.data
      const errorMsg = typeof errorData === 'object' ? JSON.stringify(errorData) : 'Unknown error'
      alert(`Failed to update ${selectedEntry?.type?.toLowerCase() || 'logistics'} status.\nServer responded with: ${errorMsg}`)
    }
  }

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}? This cannot be undone.`)) return
    try {
      const endpoint = type === 'product' ? 'products/' : 'services/'
      await api.delete(`${endpoint}${id}/`)
      fetchDashboardData()
    } catch (err) {
      alert(`Failed to delete ${type}.`)
    }
  }

  const PaymentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-glow uppercase tracking-wider">Payment Verification</h3>
        <button onClick={fetchDashboardData} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Code / Ref</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Verify</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Array.isArray(payments) && payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-white">
                      {payment.payment_method === 'mpesa' && <Smartphone size={16} className="text-green-400" />}
                      {payment.payment_method === 'bank' && <Landmark size={16} className="text-blue-400" />}
                      {payment.payment_method === 'cash' && <Banknote size={16} className="text-yellow-400" />}
                      <span className="capitalize">{payment.payment_method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{payment.order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">{payment.transaction_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-accent font-bold">KES {parseFloat(payment.amount).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      payment.status === 'verified' ? 'bg-green-500/20 text-green-400' : 
                      payment.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {payment.status === 'pending' && (
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleVerifyPayment(payment.id, 'verify')}
                          className="p-1 px-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-xs flex items-center"
                        >
                          <Check size={14} className="mr-1" /> Approve
                        </button>
                        <button 
                          onClick={() => handleVerifyPayment(payment.id, 'reject')}
                          className="p-1 px-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-xs flex items-center"
                        >
                          <X size={14} className="mr-1" /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          {payments.length === 0 && (
            <div className="p-12 text-center text-gray-500">No payment records found.</div>
          )}
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Insights', icon: <TrendingUp size={20} /> },
    { id: 'products', label: 'Inventory', icon: <Package size={20} /> },
    { id: 'services', label: 'Eco-Services', icon: <Calendar size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
    { id: 'logistics', label: 'Logistics Log', icon: <TrendingUp size={20} /> },
    { id: 'users', label: 'Customers', icon: <Users size={20} /> }
  ]


  const fetchCategories = async () => {
    try {
      const response = await api.get('products/categories/')
      const data = response.data.results || response.data || []
      setCategories(data)
    } catch (err) {
      console.error("Failed to fetch categories")
    }
  }

  const handleBulkAction = async (type, action) => {
    const ids = type === 'product' ? selectedProductIds : selectedServiceIds
    if (!ids.length) return
    if (action === 'delete' && !window.confirm(`Delete ${ids.length} selected ${type}s?`)) return

    try {
      await api.post(`${type}s/bulk-action/`, { ids, action })
      if (type === 'product') setSelectedProductIds([])
      else setSelectedServiceIds([])
      fetchDashboardData()
    } catch (err) {
      alert(`Bulk action ${action} failed`)
    }
  }

  const handleSelectAll = (type, items) => {
    const itemIds = (Array.isArray(items) ? items : []).map(i => i.id)
    if (type === 'product') {
      if (selectedProductIds.length === itemIds.length) {
        setSelectedProductIds([])
      } else {
        setSelectedProductIds(itemIds)
      }
    } else {
      if (selectedServiceIds.length === itemIds.length) {
        setSelectedServiceIds([])
      } else {
        setSelectedServiceIds(itemIds)
      }
    }
  }

  const handleSelectItem = (type, id) => {
    if (type === 'product') {
      setSelectedProductIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    } else {
      setSelectedServiceIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    }
  }

  const BulkActionBar = ({ type, selectedCount }) => (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="glass-dark border border-accent/30 rounded-full px-6 py-3 flex items-center space-x-6 shadow-2xl backdrop-blur-md">
            <span className="text-white font-medium">{selectedCount} selected</span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction(type, 'set_active')}
                className="text-xs bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full hover:bg-green-500/30 transition-colors"
              >
                Set Active
              </button>
              <button
                onClick={() => handleBulkAction(type, 'set_inactive')}
                className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-full hover:bg-yellow-500/30 transition-colors"
              >
                Set Inactive
              </button>
              <button
                onClick={() => handleBulkAction(type, 'delete')}
                className="text-xs bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
            <button
              onClick={() => type === 'product' ? setSelectedProductIds([]) : setSelectedServiceIds([])}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const ProductForm = () => (
    <form onSubmit={handleSave} className="space-y-4">
      <Input
        label="Product Name"
        name="name"
        value={formData.name || ''}
        onChange={handleInputChange}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price (KES)"
          name="price"
          type="number"
          value={formData.price || ''}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Stock Quantity"
          name="stock_quantity"
          type="number"
          value={formData.stock_quantity || 0}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
        <select
          name="category"
          value={formData.category || ''}
          onChange={handleInputChange}
          className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent"
          required
        >
          <option value="">Select Category</option>
          {Array.isArray(categories) && categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Category Type</label>
        <select
          name="category_type"
          value={formData.category_type || ''}
          onChange={handleInputChange}
          className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent"
          required
        >
          <option value="">Select Category Type</option>
          <option value="cleaning_detergents">Cleaning Detergents</option>
          <option value="cleaning_tools">Cleaning Tools & Machines</option>
          <option value="stationery">Stationery</option>
          <option value="art_supplies">Art Supplies</option>
          <option value="snacks">Snacks</option>
          <option value="foodstuffs">Foodstuffs</option>
          <option value="computer_electronics">Computer Electronics</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows="3"
          className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent resize-none"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured || false}
            onChange={handleInputChange}
            className="w-4 h-4 bg-accent/20 border-white/10 rounded"
          />
          <span className="text-sm text-gray-300">Featured</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active || true}
            onChange={handleInputChange}
            className="w-4 h-4 bg-accent/20 border-white/10 rounded"
          />
          <span className="text-sm text-gray-300">Active</span>
        </label>
      </div>
      <Input
        label="Tags (comma separated)"
        name="tags"
        value={formData.tags || ''}
        onChange={handleInputChange}
        placeholder="Trending, Hot Deal, Premium"
      />
      <ModalFooter>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-premium"
        >
          {isEditing ? 'Update Product' : 'Create Product'}
        </button>
      </ModalFooter>
    </form>
  )

  const ServiceForm = () => (
    <form onSubmit={handleSave} className="space-y-4">
      <Input
        label="Service Name"
        name="name"
        value={formData.name || ''}
        onChange={handleInputChange}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Base Price (KES)"
          name="base_price"
          type="number"
          value={formData.base_price || ''}
          onChange={handleInputChange}
          required
        />
        <Input
          label="Duration (Hours)"
          name="duration_hours"
          type="number"
          value={formData.duration_hours || ''}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Service Type</label>
        <select
          name="service_type"
          value={formData.service_type || ''}
          onChange={handleInputChange}
          className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent"
          required
        >
          <option value="">Select Type</option>
          <option value="car_detailing">Car Detailing</option>
          <option value="office_cleaning">Office Deep Cleaning</option>
          <option value="house_cleaning">House Cleaning</option>
          <option value="compound_cleaning">Compound Cleaning</option>
          <option value="graphic_design">Graphic Design</option>
          <option value="website_development">Website Development</option>
          <option value="system_development">System Development</option>
          <option value="chauffeur_services">Chauffeur Services</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows="3"
          className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent resize-none"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured || false}
            onChange={handleInputChange}
            className="w-4 h-4 bg-accent/20 border-white/10 rounded"
          />
          <span className="text-sm text-gray-300">Featured</span>
        </label>
      </div>
      <Input
        label="Tags (comma separated)"
        name="tags"
        value={formData.tags || ''}
        onChange={handleInputChange}
        placeholder="Trending, Hot Deal, Premium"
      />
      <ModalFooter>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-premium"
        >
          {isEditing ? 'Update Service' : 'Create Service'}
        </button>
      </ModalFooter>
    </form>
  )

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* ... (keeping existing stat cards) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Package className="text-accent" size={24} />
            <span className="text-xs text-green-400 flex items-center">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.productCount}</h3>
          <p className="text-gray-300 text-sm">Products</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Calendar className="text-accent" size={24} />
            <span className="text-xs text-green-400 flex items-center">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.serviceCount}</h3>
          <p className="text-gray-300 text-sm">Services</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <ShoppingBag className="text-accent" size={24} />
            <span className="text-xs text-blue-400">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.totalOrders}</h3>
          <p className="text-gray-300 text-sm">Orders</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="text-accent" size={24} />
            <span className="text-xs text-blue-400">Total</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
          <p className="text-gray-300 text-sm">Users</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Eye className="mr-2 text-accent" size={20} />
              Recent Activity
            </h3>
            <button className="text-sm text-accent hover:text-white transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {Array.isArray(activities) && activities.length > 0 ? (
              activities.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 border-b border-white/5 pb-3">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <TrendingUp size={16} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{log.action}</p>
                    <p className="text-xs text-gray-400">{log.user_email} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                    <p className="text-xs text-gray-500 mt-1">{log.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No activity recorded yet.</p>
            )}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-xl p-6 border border-accent/20"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Zap className="mr-2 text-yellow-400 shadow-glow-yellow" size={20} />
            Ecosystem Insights (AI)
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
              <p className="text-sm text-accent font-bold mb-1 uppercase tracking-wider">Demand Surge</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Increased activity detected in <span className="text-white font-bold">Cleaning Detergents</span>. Consider increasing stock or running a promotion.
              </p>
            </div>
            <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
              <p className="text-sm text-yellow-500 font-bold mb-1 uppercase tracking-wider">Service Opportunity</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                3 high-value users recently purchased cleaning tools. Recommended action: Send targeted <span className="text-white font-bold">Office Deep Cleaning</span> offers.
              </p>
            </div>
            <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
              <p className="text-sm text-blue-400 font-bold mb-1 uppercase tracking-wider">Loyalty Growth</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Average user loyalty points have increased by <span className="text-white font-bold">12%</span> this week. Engagement strategy is working.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-2 text-red-400">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
    </div>
  )

  const ProductsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-glow uppercase tracking-wider">Product Inventory</h3>
        <button
          onClick={() => handleOpenModal('product')}
          className="btn-premium flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    onChange={() => handleSelectAll('product', products)}
                    checked={selectedProductIds.length === products.length && products.length > 0}
                    className="w-4 h-4 bg-accent/20 border-white/10 rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Array.isArray(products) && products.map((product) => (
                <tr key={product.id} className={`hover:bg-white/5 transition-colors ${selectedProductIds.includes(product.id) ? 'bg-accent/5' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      onChange={() => handleSelectItem('product', product.id)}
                      checked={selectedProductIds.includes(product.id)}
                      className="w-4 h-4 bg-accent/20 border-white/10 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-white">{product.name}</div>
                      {product.is_featured && (
                        <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-[10px] rounded-full">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-accent font-semibold">
                    KES {parseFloat(product.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.stock_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${product.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenModal('product', product)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete('product', product.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <BulkActionBar type="product" selectedCount={selectedProductIds.length} />
    </div>
  )

  const ServicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-glow uppercase tracking-wider">Eco-Services</h3>
        <button
          onClick={() => handleOpenModal('service')}
          className="btn-premium flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Service</span>
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    onChange={() => handleSelectAll('service', services)}
                    checked={selectedServiceIds.length === services.length && services.length > 0}
                    className="w-4 h-4 bg-accent/20 border-white/10 rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Array.isArray(services) && services.map((service) => (
                <tr key={service.id} className={`hover:bg-white/5 transition-colors ${selectedServiceIds.includes(service.id) ? 'bg-accent/5' : ''}`}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      onChange={() => handleSelectItem('service', service.id)}
                      checked={selectedServiceIds.includes(service.id)}
                      className="w-4 h-4 bg-accent/20 border-white/10 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{service.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                    {service.service_type.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-accent font-semibold">
                    KES {parseFloat(service.base_price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${service.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{service.duration_hours}h</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleOpenModal('service', service)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete('service', service.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <BulkActionBar type="service" selectedCount={selectedServiceIds.length} />
    </div>
  )

  const OrdersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-glow uppercase tracking-wider">Order Management</h3>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Array.isArray(orders) && orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{order.email || order.user_email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-accent font-semibold">
                    KES {parseFloat(order.total_amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="p-12 text-center text-gray-500">No orders found.</div>}
        </div>
      </div>
    </div>
  )

  const BookingsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-glow uppercase tracking-wider">Booking Pipeline</h3>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Service/Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider sticky right-0 bg-[#0f172a] shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.3)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Array.isArray(bookings) && bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{booking.service_name || 'Service Booking'}</div>
                    <div className="text-xs text-gray-400">{booking.booking_date} at {booking.booking_time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.user_email || 'User'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-accent font-semibold">
                    KES {parseFloat(booking.total_price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${booking.status === 'completed' || booking.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                        booking.status === 'pending' || booking.status === 'pending_payment' ? 'bg-yellow-500/20 text-yellow-400' :
                          booking.status === 'rejected' || booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                      }`}>
                      {booking.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right sticky right-0 bg-[#0f172a] shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.3)]">
                    <button
                      onClick={() => {
                        setSelectedEntry({ ...booking, type: 'Booking' });
                        setFormData({ status: booking.status });
                        setIsBookingModalOpen(true);
                      }}
                      className="p-1 px-3 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-all text-xs"
                    >
                      Update
                    </button>
                  </td>
                  </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <div className="p-12 text-center text-gray-500">No bookings found.</div>}
        </div>
      </div>
    </div>
  )

  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-glow uppercase tracking-wider">User Relationship</h3>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="glass-dark">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Loyalty Points</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Array.isArray(users) && users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-gray-300'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-yellow-400 text-sm font-bold shadow-glow-yellow">
                      <Zap size={14} className="mr-1" />
                      {user.loyalty_points}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="p-12 text-center text-gray-500">No users found.</div>}
        </div>
      </div>
    </div>
  )

  const LogisticsTab = () => {
    // Merge orders and bookings into a single chronological log
    const orderEntries = (Array.isArray(orders) ? orders : []).map(o => ({
      id: o.id,
      type: 'Order',
      customer: o.user_email || o.email || 'N/A',
      date: o.created_at,
      amount: o.total_amount,
      status: o.status,
      delivery_status: o.delivery_status,
      transport_provider: o.transport_provider,
      tracking_number: o.tracking_number,
      destination: o.shipping_address ? `${o.shipping_address}${o.city ? ', ' + o.city : ''}` : 'N/A',
    }))
    const bookingEntries = (Array.isArray(bookings) ? bookings : []).map(b => ({
      id: b.id,
      type: 'Booking',
      customer: b.user_email || 'N/A',
      date: b.created_at,
      amount: b.total_price,
      status: b.status,
      delivery_status: null,
      transport_provider: null,
      tracking_number: null,
      destination: b.location || 'N/A',
      service_name: b.service_name,
      booking_date: b.booking_date,
      booking_time: b.booking_time,
    }))
    const combined = [...orderEntries, ...bookingEntries].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-glow uppercase tracking-wider">Logistics & Operations Log</h3>
          <button onClick={fetchDashboardData} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400">
            <RefreshCw size={20} />
          </button>
        </div>
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="glass-dark">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Delivery</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tracking</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider sticky right-0 bg-[#0f172a] shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.3)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {Array.isArray(combined) && combined.map((entry, idx) => (
                  <tr key={`${entry.type}-${entry.id}-${idx}`} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${entry.type === 'Order' ? 'bg-accent/20 text-accent' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{entry.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{entry.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                      {entry.type === 'Booking' && entry.booking_date && (
                        <span className="block text-xs text-blue-400">
                          Svc: {entry.booking_date} {entry.booking_time}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 max-w-[180px] truncate">
                      {entry.type === 'Booking' && entry.service_name && (
                        <span className="block text-xs text-blue-300 font-semibold">{entry.service_name}</span>
                      )}
                      {entry.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-accent font-semibold">
                      KES {parseFloat(entry.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${entry.status === 'paid' || entry.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          entry.status === 'pending' || entry.status === 'pending_payment' ? 'bg-yellow-500/20 text-yellow-400' :
                            entry.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-blue-500/20 text-blue-400'
                        }`}>
                        {entry.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.delivery_status ? (
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${entry.delivery_status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                            entry.delivery_status === 'in_transit' ? 'bg-blue-500/20 text-blue-400' :
                              entry.delivery_status === 'dispatched' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-gray-500/20 text-gray-400'
                          }`}>
                          {entry.delivery_status.replace('_', ' ')}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                      {entry.tracking_number || <span className="text-gray-600 italic">No Ref</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right sticky right-0 bg-[#0f172a] shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.3)]">
                      <button
                        onClick={() => {
                          setSelectedEntry(entry);
                          if (entry.type === 'Order') {
                            setFormData({
                              delivery_status: entry.delivery_status,
                              transport_provider: entry.transport_provider,
                              tracking_number: entry.tracking_number,
                            });
                            setIsLogisticsModalOpen(true);
                          } else {
                            setFormData({ status: entry.status });
                            setIsBookingModalOpen(true);
                          }
                        }}
                        className="p-1 px-3 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-all text-xs"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {combined.length === 0 && (
              <div className="p-12 text-center text-gray-500">No logistics records found.</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center pt-20">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-4"></div>
          <p className="text-gray-400 animate-pulse">Synchronizing Ecosystem Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-glow mb-4">
            Ecosystem <span className="text-accent">Admin</span>
          </h1>
          <p className="text-gray-400 text-lg">
            GRIELISHA Central Control Unit
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="glass rounded-xl p-2 mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {Array.isArray(tabs) && tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-accent text-white shadow-lg neon-glow-accent'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'services' && <ServicesTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'logistics' && <LogisticsTab />}
          {activeTab === 'users' && <UsersTab />}
        </motion.div>

        {/* CRUD MODAL */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={isEditing ? `Edit ${modalType === 'product' ? 'Product' : 'Service'}` : `Add New ${modalType === 'product' ? 'Product' : 'Service'}`}
          size="medium"
        >
          <ModalBody>
            {modalType === 'product' ? <ProductForm /> : <ServiceForm />}
          </ModalBody>
        </Modal>

        {/* LOGISTICS UPDATE MODAL */}
        <Modal
          isOpen={isLogisticsModalOpen}
          onClose={() => setIsLogisticsModalOpen(false)}
          title={`Update Logistics: Order #${selectedEntry?.id}`}
          size="medium"
        >
          <ModalBody>
            <form onSubmit={handleUpdateLogistics} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Status</label>
                <select
                  name="delivery_status"
                  value={formData.delivery_status || ''}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent"
                >
                  <option value="pending">Pending Dispatch</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <Input
                label="Transport Provider"
                name="transport_provider"
                value={formData.transport_provider || ''}
                onChange={handleInputChange}
                placeholder="e.g. G4S, Wells Fargo, Own Fleet"
              />
              <Input
                label="Tracking Number / Ref"
                name="tracking_number"
                value={formData.tracking_number || ''}
                onChange={handleInputChange}
                placeholder="Enter tracking number"
              />
              <Input
                label="Est. Delivery Date"
                name="estimated_delivery_date"
                type="date"
                value={formData.estimated_delivery_date || ''}
                onChange={handleInputChange}
              />
              <ModalFooter>
                <button
                  type="button"
                  onClick={() => setIsLogisticsModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-premium">
                  Update Logistics
                </button>
              </ModalFooter>
            </form>
          </ModalBody>
        </Modal>

        {/* BOOKING STATUS MODAL */}
        <Modal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          title={`Update Booking Status: #${selectedEntry?.id}`}
          size="small"
        >
          <ModalBody>
            <form onSubmit={handleUpdateLogistics} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Booking Status</label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-accent"
                >
                  <option value="pending">Pending Confirmation</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="paid">Paid / Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Payment Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <ModalFooter>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-premium">
                  Update Status
                </button>
              </ModalFooter>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </div>
  )
}

export default AdminDashboard
