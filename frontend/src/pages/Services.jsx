import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Services = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    navigate('/shop?tab=services', { replace: true })
  }, [navigate])

  return null
}

export default Services
