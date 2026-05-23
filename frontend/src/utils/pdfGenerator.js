import jsPDF from 'jspdf';

const COMPANY_NAME = 'GELWO TECHNOLOGIES';
const COMPANY_EMAIL = 'gelwotech@gmail.com';
const COMPANY_PHONE = '079-782-9911 / 0112556940';
const COMPANY_ADDRESS = 'Lwande Apartment Door 52, Kakamega, Kenya';
const COMPANY_OWNER = 'Gelwo Technologies';
const BANK_NAME = 'Kenya Commercial Bank (KCB)';
const BANK_ACCOUNT = '1335480404';
const BANK_ACCOUNT_NAME = 'Gelwo Technologies';
const MPESA_NUMBER = '0797829911';

// Draw a table manually using raw jsPDF primitives
const drawTable = (doc, headers, rows, startY) => {
  const colWidths = headers.map(() => 170 / headers.length);
  const rowHeight = 10;
  const startX = 14;

  // Header row background
  doc.setFillColor(126, 56, 158);
  doc.rect(startX, startY, 182, rowHeight, 'F');

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  headers.forEach((h, i) => {
    const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 2;
    doc.text(String(h), x, startY + 7);
  });

  // Draw data rows
  doc.setFont('helvetica', 'normal');
  rows.forEach((row, rowIdx) => {
    const y = startY + rowHeight * (rowIdx + 1);
    // Alternate row background
    if (rowIdx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(startX, y, 182, rowHeight, 'F');
    }
    doc.setTextColor(30, 30, 30);
    row.forEach((cell, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 2;
      const truncated = String(cell ?? '').substring(0, 28);
      doc.text(truncated, x, y + 7);
    });
    // Row border
    doc.setDrawColor(220, 220, 220);
    doc.line(startX, y + rowHeight, startX + 182, y + rowHeight);
  });

  // Outer border
  doc.setDrawColor(126, 56, 158);
  doc.rect(startX, startY, 182, rowHeight * (rows.length + 1));

  return startY + rowHeight * (rows.length + 1);
};

export const generateDocument = async (item, type, docType) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString();

  // Load the logo image asynchronously
  const img = new Image();
  img.src = '/logo.png';
  await new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = resolve; // Continue even if logo fails to load
  });

  // ── Header band ──
  doc.setFillColor(126, 56, 158);
  doc.rect(0, 0, 210, 42, 'F');

  // Add Logo to PDF if loaded successfully
  let textX = 14;
  if (img.complete && img.naturalWidth > 0) {
    const imgHeight = 24;
    const imgWidth = imgHeight * (img.naturalWidth / img.naturalHeight);
    doc.addImage(img, 'PNG', 14, 9, imgWidth, imgHeight);
    textX = 14 + imgWidth + 6; // Shift text to the right
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY_NAME, textX, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text(`${COMPANY_ADDRESS}  |  ${COMPANY_PHONE}  |  ${COMPANY_EMAIL}`, textX, 26);

  // Document type label (top right)
  doc.setTextColor(91, 138, 62);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(docType.toUpperCase(), 196, 22, { align: 'right' });

  // ── Meta info ──
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const refId = type === 'Order' ? `ORD-${item.id}` : `BKG-${item.id}`;
  doc.text(`Reference: ${refId}`, 14, 52);
  doc.text(`Date: ${dateStr}`, 14, 58);
  doc.text(`Status: ${item.status?.toUpperCase()?.replace(/_/g, ' ') || 'UNKNOWN'}`, 14, 64);

  // ── Customer block ──
  const customerEmail = item.email || item.user_email || 'N/A';
  const customerAddr = type === 'Order'
    ? [item.shipping_address, item.city].filter(Boolean).join(', ') || 'N/A'
    : item.location || 'N/A';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('BILL TO:', 120, 52);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Email: ${customerEmail}`, 120, 58);
  if (type === 'Order') {
    doc.text(`Address: ${customerAddr}`, 120, 64);
    if (item.phone) doc.text(`Phone: ${item.phone}`, 120, 70);
  } else {
    doc.text(`Location: ${customerAddr}`, 120, 64);
    if (item.booking_date) doc.text(`Scheduled: ${item.booking_date} ${item.booking_time || ''}`, 120, 70);
  }

  // ── Table ──
  let headers = [];
  let rows = [];

  if (docType === 'Delivery Note') {
    if (type === 'Order') {
      headers = ['Item Description', 'Qty Ordered', 'Qty Delivered'];
      if (item.items?.length) {
        rows = item.items.map(i => [i.name, i.quantity, '______']);
      } else {
        rows = [[`Order #${item.id} — Assorted Items`, '1', '______']];
      }
    } else {
      headers = ['Service Description', 'Execution Status', 'Client Sign-off'];
      rows = [[item.service_name || 'Service', item.status || 'Pending', '______']];
    }
  } else {
    headers = ['Description', 'Qty', 'Unit Price (KES)', 'Total (KES)'];
    if (type === 'Order') {
      if (item.items?.length) {
        rows = item.items.map(i => [
          i.name, i.quantity,
          parseFloat(i.price).toLocaleString(),
          (i.quantity * parseFloat(i.price)).toLocaleString()
        ]);
      } else {
        rows = [[`Order #${item.id}`, 1,
          parseFloat(item.total_amount).toLocaleString(),
          parseFloat(item.total_amount).toLocaleString()]];
      }
    } else {
      rows = [[item.service_name || 'Service Booking', 1,
        parseFloat(item.total_price).toLocaleString(),
        parseFloat(item.total_price).toLocaleString()]];
    }
  }

  const tableEndY = drawTable(doc, headers, rows, 78);

  // ── Totals / Footer ──
  if (docType !== 'Delivery Note') {
    const total = type === 'Order' ? item.total_amount : item.total_price;

    // Total box
    doc.setFillColor(241, 245, 249);
    doc.rect(120, tableEndY + 8, 76, 22, 'F');
    doc.setDrawColor(15, 23, 42);
    doc.rect(120, tableEndY + 8, 76, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Subtotal:', 124, tableEndY + 16);
    doc.text(`KES ${parseFloat(total).toLocaleString()}`, 194, tableEndY + 16, { align: 'right' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(126, 56, 158);
    doc.text('TOTAL:', 124, tableEndY + 25);
    doc.setTextColor(91, 138, 62);
    doc.text(`KES ${parseFloat(total).toLocaleString()}`, 194, tableEndY + 25, { align: 'right' });

    // Paid stamp (Receipt only)
    if (docType === 'Receipt') {
      const isPaid = item.status === 'paid' || item.status === 'completed';
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(isPaid ? 91 : 239, isPaid ? 138 : 68, isPaid ? 62 : 68);
      doc.text(isPaid ? '✓ PAID IN FULL' : 'PAYMENT PENDING', 14, tableEndY + 22);
    } else {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Payment Terms: Due upon receipt.', 14, tableEndY + 14);
      doc.text(`Bank: ${BANK_NAME}  |  A/C No: ${BANK_ACCOUNT}`, 14, tableEndY + 20);
      doc.text(`A/C Name: ${BANK_ACCOUNT_NAME}  |  M-Pesa: ${MPESA_NUMBER} (${COMPANY_OWNER})`, 14, tableEndY + 26);
    }
  } else {
    // Delivery note sign-off
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    doc.text('Received by (Print Name): _______________________________', 14, tableEndY + 18);
    doc.text('Signature: _______________________________   Date: ___________', 14, tableEndY + 28);
  }

  // ── Page footer ──
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(156, 163, 175);
  doc.text(`Thank you for choosing GELWO TECHNOLOGIES! | ${COMPANY_EMAIL} | ${COMPANY_PHONE}`, 105, 285, { align: 'center' });
  doc.line(14, 282, 196, 282);

  doc.save(`${docType.replace(/ /g, '_')}_${type}_${item.id}.pdf`);
};
