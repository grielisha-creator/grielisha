import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const COMPANY_NAME = 'GRIELISHA DIGITAL';
const COMPANY_CONTACT = 'info@grielisha.com | +254 700 000 000';
const COMPANY_ADDRESS = 'Kisumu, Kenya';

export const generateDocument = (item, type, docType) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString();
  const title = `${docType.toUpperCase()}`;
  
  // Header Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');
  
  // Company Info
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text(COMPANY_NAME, 14, 20);
  doc.setFontSize(10);
  doc.setTextColor(156, 163, 175); // gray-400
  doc.text(`${COMPANY_ADDRESS} | ${COMPANY_CONTACT}`, 14, 28);
  
  // Document Type
  doc.setTextColor(249, 115, 22); // orange-500
  doc.setFontSize(28);
  doc.text(title, 200, 25, { align: 'right' });
  
  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  // Meta Info
  doc.text(`Date: ${dateStr}`, 14, 50);
  doc.text(`Reference ID: ${type === 'Order' ? 'ORD' : 'BKG'}-${item.id}`, 14, 56);
  doc.text(`Status: ${item.status?.toUpperCase()?.replace('_', ' ') || 'UNKNOWN'}`, 14, 62);
  
  // Customer Info
  const customerName = item.full_name || item.email || item.user_email || 'Valued Customer';
  const customerAddress = type === 'Order' 
    ? (item.shipping_address ? `${item.shipping_address}${item.city ? ', ' + item.city : ''}` : 'N/A') 
    : (item.location || 'N/A');
    
  doc.setFontSize(12);
  doc.text('Bill To:', 120, 50);
  doc.setFontSize(10);
  doc.text(`Name: ${customerName}`, 120, 56);
  if (type === 'Order') {
     doc.text(`Address: ${customerAddress}`, 120, 62);
     if (item.phone) doc.text(`Phone: ${item.phone}`, 120, 68);
  } else {
     doc.text(`Location: ${customerAddress}`, 120, 62);
     if (item.booking_date) doc.text(`Scheduled: ${item.booking_date} ${item.booking_time}`, 120, 68);
  }
  
  // Table
  let head = [['Description', 'Quantity', 'Unit Price (KES)', 'Total (KES)']];
  let body = [];
  
  if (type === 'Order') {
    if (item.items && Array.isArray(item.items)) {
       item.items.forEach(i => {
           if (docType === 'Delivery Note') {
               head = [['Item Description', 'Quantity Ordered', 'Quantity Delivered']];
               body.push([i.name, i.quantity, '']);
           } else {
               body.push([i.name, i.quantity, parseFloat(i.price).toLocaleString(), (i.quantity * parseFloat(i.price)).toLocaleString()]);
           }
       });
    } else {
       if (docType === 'Delivery Note') {
           head = [['Item Description', 'Quantity Ordered', 'Quantity Delivered']];
           body.push([`Assorted Order Items (ID: ${item.id})`, '1', '']);
       } else {
           body.push([`Assorted Order Items (ID: ${item.id})`, 1, parseFloat(item.total_amount).toLocaleString(), parseFloat(item.total_amount).toLocaleString()]);
       }
    }
  } else {
     if (docType === 'Delivery Note') {
         head = [['Service Description', 'Execution Status', 'Client Sign-off']];
         body.push([item.service_name, item.status, '']);
     } else {
         body.push([item.service_name, 1, parseFloat(item.total_price).toLocaleString(), parseFloat(item.total_price).toLocaleString()]);
     }
  }
  
  autoTable(doc, {
    startY: 80,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { top: 80 }
  });
  
  const finalY = doc.lastAutoTable?.finalY || 80;
  
  if (docType !== 'Delivery Note') {
      const totalAmount = type === 'Order' ? item.total_amount : item.total_price;
      
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(130, finalY + 10, 66, 25, 'F');
      
      doc.setFontSize(11);
      doc.text('Subtotal:', 135, finalY + 18);
      doc.text(`KES ${parseFloat(totalAmount).toLocaleString()}`, 190, finalY + 18, { align: 'right' });
      
      doc.setFontSize(14);
      doc.setTextColor(249, 115, 22);
      doc.text('Total:', 135, finalY + 28);
      doc.text(`KES ${parseFloat(totalAmount).toLocaleString()}`, 190, finalY + 28, { align: 'right' });
      
      doc.setTextColor(0, 0, 0);
      
      if (docType === 'Receipt') {
          doc.setFontSize(16);
          if (item.status === 'paid' || item.status === 'completed') {
              doc.setTextColor(34, 197, 94); // green-500
              doc.text('PAID IN FULL', 14, finalY + 20);
          } else {
              doc.setTextColor(239, 68, 68); // red-500
              doc.text('PAYMENT PENDING', 14, finalY + 20);
          }
      } else if (docType === 'Invoice') {
          doc.setFontSize(10);
          doc.setTextColor(0,0,0);
          doc.text('Payment Terms: Due upon receipt.', 14, finalY + 20);
      }
  } else {
      // Delivery Note specific footer
      doc.setFontSize(10);
      doc.text('Received by (Name & Signature): _________________________', 14, finalY + 30);
      doc.text('Date: _________________________', 14, finalY + 40);
  }
  
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(10);
  doc.text('Thank you for choosing Grielisha Digital!', 105, 280, { align: 'center' });
  
  doc.save(`${docType.replace(' ', '_')}_${type}_${item.id}.pdf`);
};
