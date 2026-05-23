import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Printer, ArrowLeft } from 'lucide-react'
import api from '../api/axios'

const DocumentPrint = () => {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}/`)
        setOrder(res.data)
      } catch (err) {
        console.error("Failed to load document data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading Document...</div>
  }

  if (!order) {
    return <div className="text-center mt-20 text-red-500">Document not found!</div>
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
    })
  }

  const getDocumentTitle = () => {
    switch (type) {
      case 'invoice': return 'TAX INVOICE'
      case 'receipt': return 'PAYMENT RECEIPT'
      case 'delivery-note': return 'DELIVERY NOTE'
      default: return 'DOCUMENT'
    }
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Non-printable controls */}
      <div className="print:hidden bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
        <button onClick={() => navigate(-1)} className="flex items-center hover:text-accent transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>
        <button onClick={handlePrint} className="flex items-center bg-accent text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          <Printer size={20} className="mr-2" /> Print Document
        </button>
      </div>

      {/* Printable A4 Container */}
      <div className="max-w-4xl mx-auto p-12 bg-white print:p-0 print:w-full print:max-w-full">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8 mb-8">
          <div>
            <img src="/logo.png" alt="Grielisha Logo" className="h-16 mb-4" />
            <div className="text-sm text-gray-600">
              <p className="font-bold text-gray-800">GRIELISHA ECO-SYSTEMS</p>
              <p>123 Digital Boulevard</p>
              <p>Nairobi, Kenya</p>
              <p>contact@grielisha.com | +254112556940</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-bold text-[#7e389e] uppercase tracking-wider mb-2">{getDocumentTitle()}</h1>
            <p className="text-sm text-gray-500 font-semibold mb-4">
              Ref: #{order.id}-{type.substring(0, 3).toUpperCase()}
            </p>
            <div className="text-sm">
              <p><span className="font-semibold text-gray-600">Date:</span> {formatDate(new Date())}</p>
              {type === 'invoice' && <p><span className="font-semibold text-gray-600">Due Date:</span> {formatDate(new Date(Date.now() + 7*24*60*60*1000))}</p>}
              {order.payment?.transaction_code && type === 'receipt' && (
                <p><span className="font-semibold text-gray-600">Transaction ID:</span> {order.payment.transaction_code}</p>
              )}
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="flex justify-between mb-12">
          <div className="w-1/2 pr-4">
            <h3 className="text-xs font-bold text-[#7e389e] uppercase tracking-wider mb-3">Billed To</h3>
            <p className="font-bold text-gray-800">{order.full_name || order.user_email}</p>
            <p className="text-sm text-gray-600">{order.email}</p>
            <p className="text-sm text-gray-600">{order.phone}</p>
          </div>
          <div className="w-1/2 pl-4 border-l border-gray-200">
            <h3 className="text-xs font-bold text-[#7e389e] uppercase tracking-wider mb-3">Shipping/Delivery</h3>
            <p className="text-sm text-gray-600">{order.shipping_address}</p>
            <p className="text-sm text-gray-600">{order.city}, {order.postal_code}</p>
            
            {type === 'delivery-note' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm"><span className="font-semibold">Transport Provider:</span> {order.transport_provider || 'Not Assigned'}</p>
                <p className="text-sm"><span className="font-semibold">Tracking No:</span> {order.tracking_number || 'N/A'}</p>
                <p className="text-sm"><span className="font-semibold">Delivery Status:</span> <span className="uppercase text-xs font-bold bg-gray-200 px-2 py-1 rounded">{order.delivery_status}</span></p>
              </div>
            )}
          </div>
        </div>

        {/* Line Items */}
        <table className="w-full mb-12">
          <thead>
            <tr className="bg-[#7e389e] text-white">
              <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider rounded-tl-md">Description</th>
              <th className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider">Qty</th>
              <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider">Unit Price (KES)</th>
              <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider rounded-tr-md">Total (KES)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="py-4 px-4 text-sm text-gray-800 font-medium">{item.name}</td>
                <td className="py-4 px-4 text-sm text-gray-600 text-center">{item.quantity}</td>
                <td className="py-4 px-4 text-sm text-gray-600 text-right">{parseFloat(item.price).toLocaleString()}</td>
                <td className="py-4 px-4 text-sm text-gray-800 font-bold text-right">{parseFloat(item.subtotal).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        {type !== 'delivery-note' && (
          <div className="flex justify-end mb-16">
            <div className="w-1/3">
              <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-200">
                <span>Subtotal</span>
                <span>{parseFloat(order.total_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm text-gray-600 border-b border-gray-200">
                <span>Tax (16% VAT Included)</span>
                <span>{(parseFloat(order.total_amount) * 0.16).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-4 text-xl font-bold border-b-4 border-[#7e389e]">
                <span className="text-gray-800">TOTAL KES</span>
                <span className="text-[#5b8a3e]">{parseFloat(order.total_amount).toLocaleString()}</span>
              </div>
              {type === 'receipt' && (
                 <div className="mt-4 flex items-center justify-between">
                   <span className="text-[#5b8a3e] font-bold text-lg uppercase tracking-widest border-2 border-[#5b8a3e] p-2 transform -rotate-12">PAID IN FULL</span>
                   <p className="text-xs text-gray-500">Method: {order.payment?.payment_method}</p>
                 </div>
              )}
            </div>
          </div>
        )}

        {/* Footer / Signatures */}
        {type === 'delivery-note' && (
          <div className="mt-20 border-t border-gray-200 pt-8 flex justify-between">
            <div className="w-1/3 text-center">
              <div className="border-b border-gray-400 mb-2 h-10"></div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Authorized Dispatcher</p>
            </div>
            <div className="w-1/3 text-center">
              <div className="border-b border-gray-400 mb-2 h-10"></div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Receiver Signature</p>
              <p className="text-xs text-gray-400 italic">I confirm receipt of goods in condition stated.</p>
            </div>
          </div>
        )}

        <div className="mt-16 text-center text-xs text-gray-400 print:fixed print:bottom-8 print:left-0 print:right-0">
          <p>Thank you for doing business with Grielisha Eco-Systems.</p>
          <p>Generated by Grielisha Backend Administration System.</p>
        </div>
      </div>
    </div>
  )
}

export default DocumentPrint
