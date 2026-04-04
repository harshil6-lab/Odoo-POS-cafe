import { jsPDF } from 'jspdf';

export function generateOrderPDF(orderData) {
  const doc = new jsPDF();
  const timestamp = new Date(orderData.createdAt || Date.now()).toLocaleString();

  // Header
  doc.setFillColor(11, 18, 32);
  doc.rect(0, 0, 210, 36, 'F');
  doc.setTextColor(249, 250, 251);
  doc.setFontSize(18);
  doc.text('Cafe POS Suite — Order', 16, 18);
  doc.setFontSize(10);
  doc.text(`Order ID: ${orderData.id}`, 16, 28);

  // Order details
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(11);
  let y = 48;
  doc.text(`Table number: ${orderData.tableCode ?? orderData.tableId ?? 'N/A'}`, 16, y);
  y += 8;
  doc.text(`Customer name: ${orderData.customerName ?? orderData.customer?.name ?? 'Guest'}`, 16, y);
  y += 8;
  doc.text(`Timestamp: ${timestamp}`, 16, y);
  y += 12;

  // Divider
  doc.setDrawColor(209, 213, 219);
  doc.line(16, y, 194, y);
  y += 10;

  // Items header
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 16, y);
  doc.text('Qty', 130, y, { align: 'right' });
  doc.text('Amount', 190, y, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  y += 8;

  // Items list
  const items = orderData.items ?? [];
  items.forEach((item) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const price = Number(item.price ?? 0);
    const qty = Number(item.quantity ?? 1);

    doc.text(item.name ?? 'Item', 16, y);
    doc.text(String(qty), 130, y, { align: 'right' });
    doc.text(`₹${(price * qty).toFixed(2)}`, 190, y, { align: 'right' });
    y += 7;
  });

  // Total
  y += 4;
  doc.line(16, y, 194, y);
  y += 10;

  const total = orderData.total ?? items.reduce((sum, i) => sum + (Number(i.price ?? 0) * Number(i.quantity ?? 1)), 0);

  doc.setFont('helvetica', 'bold');
  doc.text('Total amount', 16, y);
  doc.text(`₹${Number(total).toFixed(2)}`, 190, y, { align: 'right' });

  // Footer
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Thank you for ordering with us.', 16, y);

  // Download
  const filename = `order-${orderData.id ?? 'unknown'}.pdf`;
  doc.save(filename);

  return doc;
}
