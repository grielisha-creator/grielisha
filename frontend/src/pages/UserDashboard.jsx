import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, ShoppingBag, Calendar, Package, MapPin, Phone, Mail, Edit2, Eye, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  
  const { user, updateProfile } = useAuth()

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [ordersRes, bookingsRes] = await Promise.all([
        api.get('orders/'),
        api.get('bookings/').catch(() => ({ data: { results: [] } }))
      ])
      setOrders(ordersRes.data.results || ordersRes.data || [])
      setBookings(bookingsRes.data.results || bookingsRes.data || [])
    } catch (err) {
      console.error("Dashboard data fetch error", err)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    const result = await updateProfile(profileData)
    if (result.success) {
      setEditingProfile(false)
    }
  }

  const handleReorder = async (orderId) => {
    try {
      setReordering(true)
      await api.post(`orders/${orderId}/reorder/`)
      alert("Items from order #" + orderId + " have been added to your cart!")
    } catch (err) {
      alert("Failed to reorder. Please try again.")
    } finally {
      setReordering(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
      case 'completed':
      case 'confirmed':
      case 'verified':
      case 'paid':
        return 'text-green-400'
      case 'pending':
      case 'pending_payment':
      case 'confirmed':
        return 'text-yellow-400'
      case 'rejected':
      case 'failed':
      case 'cancelled':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
      case 'completed':
      case 'confirmed':
      case 'verified':
      case 'paid':
        return <CheckCircle size={16} />
      case 'pending':
      case 'pending_payment':
        return <Clock size={16} />
      default:
        return <XCircle size={16} />
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending_payment': return 'Awaiting Verification'
      case 'paid': return 'Paid & Confirmed'
      case 'cancelled': return 'Cancelled'
      case 'rejected': return 'Rejected'
      default: return status?.replace('_', ' ') || status
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const OverviewTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <ShoppingBag className="text-accent" size={24} />
          <span className="text-2xl font-bold text-white">{(orders || []).length}</span>
        </div>
        <h3 className="text-white font-semibold">Total Orders</h3>
        <p className="text-gray-300 text-sm">All time purchases</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Calendar className="text-accent" size={24} />
          <span className="text-2xl font-bold text-white">{(bookings || []).length}</span>
        </div>
        <h3 className="text-white font-semibold">Service Bookings</h3>
        <p className="text-gray-300 text-sm">Booked services</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <Package className="text-accent" size={24} />
          <span className="text-2xl font-bold text-white">
            {(orders || []).filter(o => o.status === 'pending').length}
          </span>
        </div>
        <h3 className="text-white font-semibold">Pending Orders</h3>
        <p className="text-gray-300 text-sm">Awaiting delivery</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <CheckCircle className="text-accent" size={24} />
          <span className="text-2xl font-bold text-white">
            {(orders || []).filter(o => o.status === 'delivered').length}
          </span>
        </div>
        <h3 className="text-white font-semibold">Completed Orders</h3>
        <p className="text-gray-300 text-sm">Successfully delivered</p>
      </motion.div>
    </div>
  )

  const OrdersTab = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-glow mb-6">Order History</h3>
      {(orders || []).length > 0 ? (
        <div className="space-y-4">
          {Array.isArray(orders) && orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">Order #{order.id}</h4>
                  <p className="text-gray-300 text-sm">{formatDate(order.created_at)}</p>
                </div>
                <div className={`flex items-center text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2 uppercase tracking-tight">{getStatusLabel(order.status)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-2 uppercase font-bold tracking-widest">Items ({order.item_count})</p>
                  <div className="space-y-1">
                    {Array.isArray(order.items) && order.items.map((item, index) => (
                      <div key={index} className="text-sm text-gray-300 flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="text-white/50">KES {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {order.payment && (
                  <div className="glass-dark p-3 rounded-lg border border-white/5">
                    <p className="text-gray-400 text-xs mb-2 uppercase font-bold tracking-widest">Payment Info</p>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Method:</span>
                        <span className="text-white capitalize">{order.payment.payment_method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ref:</span>
                        <span className="text-white font-mono">{order.payment.transaction_code}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="glass-dark p-3 rounded-lg border border-accent/20">
                  <p className="text-accent text-xs mb-2 uppercase font-bold tracking-widest">Logistics & Tracking</p>
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-gray-400 text-xs block">Status:</span>
                      <span className="text-white font-bold capitalize">{order.delivery_status || 'Pending Dispatch'}</span>
                    </div>
                    {order.transport_provider && (
                      <div className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                        <span className="text-gray-400 text-xs">Provider:</span>
                        <span className="text-white text-xs">{order.transport_provider}</span>
                      </div>
                    )}
                    {order.tracking_number && (
                      <div className="flex justify-between items-center bg-white/5 p-1.5 rounded">
                        <span className="text-gray-400 text-xs">Tracking ID:</span>
                        <span className="text-accent font-mono text-xs font-bold">{order.tracking_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-xl font-bold text-accent">
                  KES {order.total_amount.toLocaleString()}
                </span>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleReorder(order.id)}
                    disabled={reordering}
                    className="text-white bg-accent/20 hover:bg-accent/40 px-3 py-1.5 rounded-lg transition-all flex items-center text-sm border border-accent/30"
                  >
                    <RefreshCw size={14} className={`mr-1.5 ${reordering ? 'animate-spin' : ''}`} />
                    Reorder
                  </button>
                  <button onClick={() => setSelectedOrder(order)} className="text-glow hover:text-accent transition-colors flex items-center text-sm">
                    <Eye size={16} className="mr-1" />
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
          <p className="text-gray-300 mb-4">Start shopping to see your order history</p>
          <a href="/shop" className="bg-accent hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all">
            Browse Products
          </a>
        </div>
      )}
    </div>
  )

  const BookingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-glow mb-6">Service Bookings</h3>
      {(bookings || []).length > 0 ? (
        <div className="space-y-4">
          {Array.isArray(bookings) && bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{booking.service_name}</h4>
                  <p className="text-gray-300 text-sm">
                    {formatDate(booking.booking_date)} at {booking.booking_time}
                  </p>
                </div>
                <div className={`flex items-center ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="ml-2 capitalize">{booking.status}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center text-gray-300 text-sm mb-2">
                  <MapPin size={14} className="mr-1" />
                  {booking.location}
                </div>
                {booking.notes && (
                  <p className="text-gray-300 text-sm italic">Note: {booking.notes}</p>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-accent">
                  KES {booking.total_price.toLocaleString()}
                </span>
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="text-glow hover:text-accent transition-colors flex items-center"
                >
                  <Eye size={16} className="mr-1" />
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">No bookings yet</h3>
          <p className="text-gray-300 mb-4">Book our professional services</p>
          <a href="/services" className="bg-accent hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all">
            Browse Services
          </a>
        </div>
      )}
    </div>
  )

  const ProfileTab = () => (
    <div className="max-w-2xl">
      <h3 className="text-2xl font-bold text-glow mb-6">Profile Information</h3>
      
      <div className="glass rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-white">Personal Details</h4>
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className="text-accent hover:text-orange-600 transition-colors flex items-center"
          >
            <Edit2 size={16} className="mr-1" />
            {editingProfile ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingProfile ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
              <textarea
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </div>
            
            <button
              onClick={handleProfileUpdate}
              className="bg-accent hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center text-gray-300">
              <User size={20} className="mr-3 text-accent" />
              <span className="font-medium">Username:</span>
              <span className="ml-2">{profileData.username}</span>
            </div>
            
            <div className="flex items-center text-gray-300">
              <Mail size={20} className="mr-3 text-accent" />
              <span className="font-medium">Email:</span>
              <span className="ml-2">{profileData.email}</span>
            </div>
            
            <div className="flex items-center text-gray-300">
              <Phone size={20} className="mr-3 text-accent" />
              <span className="font-medium">Phone:</span>
              <span className="ml-2">{profileData.phone || 'Not provided'}</span>
            </div>
            
            <div className="flex items-start text-gray-300">
              <MapPin size={20} className="mr-3 text-accent mt-1" />
              <div>
                <span className="font-medium">Address:</span>
                <p className="ml-2">{profileData.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Package size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> }
  ]

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
            My <span className="text-accent">Dashboard</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your orders, bookings, and profile
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="glass rounded-xl p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {Array.isArray(tabs) && tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </motion.div>

        {/* Order Details Modal Overlay */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass border border-accent/20 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 custom-scrollbar"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-black/40 backdrop-blur-md">
                <div>
                  <h2 className="text-2xl font-bold text-white">Order #{selectedOrder.id} Details</h2>
                  <p className="text-gray-400 text-sm mt-1">{formatDate(selectedOrder.created_at)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white transition-colors">
                  <XCircle size={28} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Status Banners */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className={`flex-1 p-4 rounded-lg flex items-center border border-white/5 ${getStatusColor(selectedOrder.status).replace('text-', 'bg-').replace('-400', '-500/10')}`}>
                    <div className={getStatusColor(selectedOrder.status)}>{getStatusIcon(selectedOrder.status)}</div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Verification Status</p>
                      <p className={`font-semibold ${getStatusColor(selectedOrder.status)}`}>{getStatusLabel(selectedOrder.status)}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 rounded-lg flex items-center border border-white/5 bg-accent/5">
                    <div className="text-accent"><Package size={20} /></div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Transport Status</p>
                      <p className="text-white font-semibold capitalize">{selectedOrder.delivery_status || 'Pending Dispatch'}</p>
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div className="glass-dark p-4 rounded-lg border border-accent/20">
                  <h4 className="text-accent text-sm font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Active Logistics Map</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wider font-bold block mb-1 flex items-center"><MapPin size={12} className="mr-1"/> Delivery Origin</span>
                      <span className="text-white text-sm font-semibold">{selectedOrder.delivery_origin || 'Local Distribution Center'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wider font-bold block mb-1 flex items-center"><MapPin size={12} className="mr-1 text-accent"/> Destination Route</span>
                      <span className="text-white text-sm font-semibold">{selectedOrder.shipping_address}, {selectedOrder.city || 'N/A'}</span>
                      {selectedOrder.phone && <span className="block text-gray-500 text-xs mt-0.5">Contact: {selectedOrder.phone}</span>}
                    </div>
                  </div>

                  {(selectedOrder.transport_provider || selectedOrder.tracking_number) && (
                    <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                      <div>
                        <span className="text-gray-400 block mb-1 text-xs uppercase font-bold">Transport Provider</span>
                        <span className="text-white font-semibold">{selectedOrder.transport_provider || 'Not assigned'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-1 text-xs uppercase font-bold">Tracking Code</span>
                        {selectedOrder.tracking_number ? (
                          <span className="text-accent font-mono font-bold bg-accent/10 px-2 py-1 rounded">{selectedOrder.tracking_number}</span>
                        ) : (
                          <span className="text-gray-500 italic text-xs">Awaiting origin scan</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-white font-bold mb-3 border-b border-white/10 pb-2">Purchased Items</h4>
                  <div className="space-y-3">
                    {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center text-accent font-bold mr-3">{item.quantity}x</div>
                          <span className="text-white">{item.name}</span>
                        </div>
                        <span className="text-accent font-semibold">KES {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="glass-dark p-4 rounded-lg border border-white/5">
                  <h4 className="text-gray-300 font-bold mb-3 border-b border-white/10 pb-2">Financial Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>KES {parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Tax (16% VAT Included)</span>
                      <span>KES {(parseFloat(selectedOrder.total_amount) * 0.16).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10 mt-2">
                      <span>Total Paid</span>
                      <span className="text-accent">KES {parseFloat(selectedOrder.total_amount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass border border-accent/20 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative z-10"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-black/40 backdrop-blur-md">
                <div>
                  <h2 className="text-2xl font-bold text-white">Booking #{selectedBooking.id}</h2>
                  <p className="text-gray-400 text-sm mt-1">{selectedBooking.service_name}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white transition-colors">
                  <XCircle size={28} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Status */}
                <div className={`flex items-center space-x-3 p-4 rounded-lg border border-white/5 ${
                  selectedBooking.status === 'confirmed' ? 'bg-green-500/10' :
                  selectedBooking.status === 'pending' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                }`}>
                  <div className={getStatusColor(selectedBooking.status)}>{getStatusIcon(selectedBooking.status)}</div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Booking Status</p>
                    <p className={`font-semibold capitalize ${getStatusColor(selectedBooking.status)}`}>{selectedBooking.status}</p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="glass-dark rounded-lg p-4 border border-white/5">
                  <h4 className="text-accent text-sm font-bold uppercase tracking-wider mb-3">Schedule</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs uppercase font-bold block mb-1">Date</span>
                      <span className="text-white font-semibold">{formatDate(selectedBooking.booking_date)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase font-bold block mb-1">Time</span>
                      <span className="text-white font-semibold">{selectedBooking.booking_time}</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="glass-dark rounded-lg p-4 border border-white/5">
                  <h4 className="text-accent text-sm font-bold uppercase tracking-wider mb-3">Location</h4>
                  <div className="flex items-start text-sm">
                    <MapPin size={16} className="text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-white">{selectedBooking.location}</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="glass-dark rounded-lg p-4 border border-white/5">
                    <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">Special Instructions</h4>
                    <p className="text-gray-200 text-sm italic">{selectedBooking.notes}</p>
                  </div>
                )}

                {/* Price */}
                <div className="glass-dark rounded-lg p-4 border border-accent/20">
                  <h4 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">Price Summary</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Service Fee</span>
                    <span className="text-accent font-bold text-lg">KES {parseFloat(selectedBooking.total_price).toLocaleString()}</span>
                  </div>
                </div>

                {/* Booked On */}
                <p className="text-gray-500 text-xs text-center">Booked on {formatDate(selectedBooking.created_at)}</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
