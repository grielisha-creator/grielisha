import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react'
import api from '../api/axios'

const Booking = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    booking_date: '',
    booking_time: '',
    location: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    fetchService()
  }, [serviceId])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await api.get(`services/${serviceId}/`)
      const serviceData = response.data
      if (typeof serviceData.features === 'string') {
        try { serviceData.features = JSON.parse(serviceData.features) } catch(e) { serviceData.features = [] }
      }
      if (!Array.isArray(serviceData.features)) serviceData.features = []
      
      setService(serviceData)
    } catch (err) {
      console.error("Failed to load service", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!bookingData.booking_date) {
      newErrors.booking_date = 'Booking date is required'
    } else {
      const selectedDate = new Date(bookingData.booking_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.booking_date = 'Booking date cannot be in the past'
      }
    }
    
    if (!bookingData.booking_time) {
      newErrors.booking_time = 'Booking time is required'
    }
    
    if (!bookingData.location) {
      newErrors.location = 'Location is required'
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

    setIsSubmitting(true)
    setErrors({})

    try {
      await api.post('bookings/', {
        service: serviceId,
        ...bookingData
      })
      setBookingSuccess(true)
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Failed to create booking. Please check your data and try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <div className="text-center">
          <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
          <p className="text-gray-300 mb-4">The service you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-accent hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all"
          >
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 max-w-md mx-auto text-center neon-glow"
        >
          <CheckCircle className="text-green-400 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-bold text-glow mb-4">Booking Confirmed!</h2>
          <p className="text-gray-300 mb-6">
            Your booking for {service.name} has been successfully created.
          </p>
          <div className="space-y-2 mb-6 text-left glass-dark rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Service:</span>
              <span className="text-white">{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Date:</span>
              <span className="text-white">{new Date(bookingData.booking_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Time:</span>
              <span className="text-white">{bookingData.booking_time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Location:</span>
              <span className="text-white">{bookingData.location}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-accent">Total:</span>
              <span className="text-accent">KES {service.base_price.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-accent hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            View My Bookings
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/services')}
            className="text-accent hover:text-orange-600 transition-colors flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Services
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-glow mb-6">Book Service</h1>
            
            <div className="glass rounded-xl p-6 neon-glow mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">{service.name}</h2>
              <p className="text-gray-300 mb-4">{service.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Clock size={20} className="mr-3 text-accent" />
                  <span>Duration: {service.duration_hours} hours</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <DollarSign size={20} className="mr-3 text-accent" />
                  <span className="text-xl font-semibold text-accent">
                    KES {service.base_price.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-white font-semibold mb-2">Features:</h3>
                <ul className="space-y-1">
                  {service.features.map((feature, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Booking Details</h2>
              
              {errors.general && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Booking Date
                  </label>
                  <input
                    type="date"
                    name="booking_date"
                    value={bookingData.booking_date}
                    onChange={handleChange}
                    min={getMinDate()}
                    className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white focus:outline-none focus:border-accent transition-colors ${
                      errors.booking_date ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.booking_date && (
                    <p className="mt-1 text-sm text-red-400">{errors.booking_date}</p>
                  )}
                </div>

                {/* Time Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Clock size={16} className="inline mr-1" />
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    name="booking_time"
                    value={bookingData.booking_time}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white focus:outline-none focus:border-accent transition-colors ${
                      errors.booking_time ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.booking_time && (
                    <p className="mt-1 text-sm text-red-400">{errors.booking_time}</p>
                  )}
                </div>

                {/* Location Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Location
                  </label>
                  <textarea
                    name="location"
                    value={bookingData.location}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter the service location"
                    className={`w-full px-4 py-3 bg-black/30 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors resize-none ${
                      errors.location ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-400">{errors.location}</p>
                  )}
                </div>

                {/* Notes Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special requirements or notes"
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 neon-glow-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Booking
