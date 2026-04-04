import { jsPDF } from 'jspdf';
import { formatCurrency } from './helpers';

function printItem(doc, item, y) {
  const preferences = Array.isArray(item.preferences)
    ? item.preferences.filter(Boolean).join(', ')
    : String(item.preferences || '').trim();

  doc.setFont('helvetica', 'bold');
  doc.text(`${item.quantity} x ${item.name}`, 16, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(item.price * item.quantity), 180, y, { align: 'right' });

  if (preferences) {
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(`Preferences: ${preferences}`, 16, y + 5);
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    return y + 10;
  }

  return y + 7;
}

export function buildTicketPDF(order, options = {}) {
  const doc = new jsPDF();
  const title = options.title || 'Cafe POS Suite';
  const footerAction = options.footerAction || 'Thank you for ordering with us.';
  const timestamp = new Date(order.ticketGeneratedAt || order.createdAt || Date.now()).toLocaleString();

  doc.setFillColor(11, 18, 32);
  doc.rect(0, 0, 210, 36, 'F');
  doc.setTextColor(249, 250, 251);
  doc.setFontSize(18);
  doc.text(title, 16, 18);
  doc.setFontSize(10);
  doc.text(`Order ${order.id}`, 16, 26);

  doc.setTextColor(17, 24, 39);
  doc.setFontSize(11);
  doc.text(`Table number: ${order.tableId || 'N/A'}`, 16, 48);
  doc.text(`Customer name: ${order.customer?.name || order.customerName || 'Guest'}`, 16, 56);
  doc.text(`Payment method: ${order.paymentMethod || 'Cash'}`, 16, 64);
  doc.text(`Timestamp: ${timestamp}`, 16, 72);

  doc.setDrawColor(209, 213, 219);
  doc.line(16, 78, 194, 78);

  let y = 88;
  doc.setFont('helvetica', 'bold');
  doc.text('Items', 16, y);
  doc.text('Total', 180, y, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  y += 8;

  order.items.forEach((item) => {
    y = printItem(doc, item, y);
    if (y > 262) {
      doc.addPage();
      y = 20;
    }
  });

  y += 4;
  doc.line(16, y, 194, y);
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal', 16, y);
  doc.text(formatCurrency(order.subtotal ?? order.total ?? 0), 180, y, { align: 'right' });
  y += 8;
  doc.text('Grand total', 16, y);
  doc.text(formatCurrency(order.total ?? 0), 180, y, { align: 'right' });

  if (order.estimatedPrepMinutes) {
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Estimated preparation time: ${order.estimatedPrepMinutes} minutes`, 16, y);
  }

  y += 18;
  doc.setTextColor(107, 114, 128);
  doc.text(footerAction, 16, y);

  return doc;
}

export function downloadTicketPDF(order, options = {}) {
  const doc = buildTicketPDF(order, options);
  const filename = options.filename || `ticket-${order.id}.pdf`;
  doc.save(filename);
  return doc;
}