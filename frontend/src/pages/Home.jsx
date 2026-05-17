import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Calendar, ArrowRight, Star, Shield, Zap, Globe } from 'lucide-react'
import api from '../api/axios'
import { getImageUrl } from '../utils/image'

const Home = () => {
  const [recommendations, setRecommendations] = useState({
    popular_products: [],
    featured_products: [],
    featured_services: [],
    cross_sell_services: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('products/recommendations/')
        setRecommendations(response.data)
      } catch (err) {
        console.error("Failed to fetch recommendations", err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecommendations()
  }, [])

  const features = [
    {
      icon: <ShoppingCart className="text-accent" size={32} />,
      title: "Premium Products",
      description: "Quality cleaning supplies, electronics, and more"
    },
    {
      icon: <Calendar className="text-accent" size={32} />,
      title: "Professional Services",
      description: "Expert cleaning, detailing, and digital solutions"
    },
    {
      icon: <Shield className="text-accent" size={32} />,
      title: "Secure Platform",
      description: "Safe transactions and data protection"
    },
    {
      icon: <Zap className="text-accent" size={32} />,
      title: "Fast Delivery",
      description: "Quick and reliable service delivery"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/95"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-glow/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-glow mb-6">
              Welcome to
              <span className="block text-accent text-glow-accent mt-2">
                GRIELISHA
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your ultimate destination for premium products, professional services, and cutting-edge digital solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-accent hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 neon-glow-accent flex items-center justify-center group"
              >
                Shop Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                to="/services"
                className="glass hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 border border-white/20 flex items-center justify-center"
              >
                Book Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-glow mb-4">
              Why Choose <span className="text-accent">GRIELISHA</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Experience excellence in every interaction with our comprehensive platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-dark rounded-xl p-6 hover:bg-white/10 transition-all group"
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-glow mb-4">
              Featured <span className="text-accent">Gems</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Our hand-picked selection of premium products
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.featured_products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="glass rounded-xl overflow-hidden hover:bg-white/10 transition-all group-hover:scale-105 transform">
                    <div className="h-48 bg-gradient-to-br from-accent/20 to-glow/20 flex items-center justify-center relative">
                      {product.image ? (
                        <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Globe className="text-accent" size={48} />
                      )}
                      <div className="absolute top-4 right-4 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                        Featured
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white group-hover:text-accent transition-colors truncate">
                        {product.name}
                      </h3>
                      <p className="text-accent font-bold mt-2">KES {parseFloat(product.price).toLocaleString()}</p>
                      <button className="w-full mt-4 btn-premium py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        View Item
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-glow mb-4">
              Premium <span className="text-accent">Services</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Professional services tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.featured_services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-xl p-6 hover:bg-white/10 transition-all group border border-white/5 hover:border-accent/30"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-accent transition-colors">
                    {service.name}
                  </h3>
                  <Star className="text-accent" size={20} />
                </div>
                <p className="text-accent font-semibold mb-4">From KES {parseFloat(service.base_price).toLocaleString()}</p>
                <Link
                  to="/services"
                  className="text-glow hover:text-accent transition-colors inline-flex items-center"
                >
                  Book now
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-20 relative bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="text-left">
              <h2 className="text-4xl font-bold text-glow mb-2">
                Popular <span className="text-accent">Now</span>
              </h2>
              <p className="text-gray-400">Most loved by the GRIELISHA community</p>
            </div>
            <Link to="/shop" className="text-accent hover:text-white transition-colors flex items-center mt-4 md:mt-0">
              View all products <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.popular_products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="glass-dark rounded-xl p-4 border border-white/5 hover:border-accent/20 transition-all">
                    <div className="aspect-square bg-white/5 rounded-lg mb-4 overflow-hidden relative">
                      {product.image ? (
                        <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="text-white/10" size={64} />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {product.tags && product.tags.split(',').map(tag => (
                          <span key={tag} className="text-[8px] bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded text-white uppercase font-bold tracking-tighter">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h4 className="text-white font-medium group-hover:text-accent transition-colors truncate">{product.name}</h4>
                    <p className="text-gray-400 text-sm mt-1">KES {parseFloat(product.price).toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="glass-dark rounded-2xl p-12 neon-glow"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-glow mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of satisfied customers who trust GRIELISHA for their needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-accent hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 neon-glow-accent"
              >
                Create Account
              </Link>
              <Link
                to="/shop"
                className="glass hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 border border-white/20"
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
