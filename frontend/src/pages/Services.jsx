import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, Clock, DollarSign, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { getImageUrl } from '../utils/image'

const Services = () => {
  const [services, setServices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await api.get('services/')
      const data = response.data.results || response.data
      setServices(data)
    } catch (err) {
      setError("Failed to load services")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const serviceCategories = [
    "All Services",
    "Car Detailing",
    "Cleaning Services",
    "Digital Services",
    "Transport Services"
  ]

  const getCategoryForService = (serviceType) => {
    if (serviceType === 'car_detailing') return 'Car Detailing'
    if (['office_cleaning', 'house_cleaning', 'compound_cleaning'].includes(serviceType)) return 'Cleaning Services'
    if (['website_development', 'system_development', 'graphic_design'].includes(serviceType)) return 'Digital Services'
    if (serviceType === 'chauffeur_services') return 'Transport Services'
    return 'Other'
  }

  const filteredServices = (services || []).filter(service => {
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All Services' || getCategoryForService(service.service_type) === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const ServiceCard = ({ service, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="glass rounded-xl overflow-hidden hover:bg-white/10 transition-all group"
    >
      <div className="relative h-48 bg-gradient-to-br from-accent/20 to-glow/20 flex items-center justify-center overflow-hidden">
        {service.image ? (
          <img src={getImageUrl(service.image)} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <Calendar className="text-accent/50" size={48} />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-white group-hover:text-accent transition-colors">
            {service.name}
          </h3>
          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded w-fit text-center">
            {getCategoryForService(service.service_type)}
          </span>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>
        
        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {(service.features || []).slice(0, 3).map((feature, idx) => (
              <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                {feature}
              </span>
            ))}
            {(service.features || []).length > 3 && (
              <span className="text-xs text-gray-400">+{(service.features || []).length - 3} more</span>
            )}
          </div>
        </div>
        
        {/* Service Details */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center text-gray-300">
            <Clock size={14} className="mr-1 text-accent" />
            {service.duration_hours}h
          </div>
          <div className="flex items-center text-accent font-semibold">
            <DollarSign size={14} className="mr-1" />
            KES {service.base_price.toLocaleString()}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Link
            to={`/booking/${service.id}`}
            className="w-full bg-accent hover:bg-orange-600 text-white py-2 rounded-lg transition-all flex items-center justify-center font-bold"
          >
            Direct Booking
          </Link>
          <a
            href={`https://wa.me/254112556940?text=Hello, I am interested in getting a quotation and more details regarding the ${service.name} service.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg transition-all flex items-center justify-center"
          >
            WhatsApp Quotation
          </a>
        </div>
      </div>
    </motion.div>
  )

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
            Our <span className="text-accent">Services</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Professional services tailored to meet your specific needs
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search services..."
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
              {(serviceCategories || []).map(category => (
                <option key={category} value={category === 'All Services' ? '' : category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center text-gray-300">
              <Filter size={20} className="mr-2" />
              {filteredServices.length} services found
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {(filteredServices || []).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(filteredServices || []).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="glass rounded-xl p-8 max-w-md mx-auto">
              <Search className="text-gray-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">No services found</h3>
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

export default Services
