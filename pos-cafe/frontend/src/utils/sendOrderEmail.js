import { supabase } from '../services/supabaseClient';
import { buildTicketPDF } from './generateTicketPDF';

/**
 * Send an order receipt email via Supabase Edge Function.
 * Falls back gracefully if the function is not deployed.
 */
export async function sendOrderEmail(orderData, customerEmail) {
  if (!customerEmail) {
    console.log('No customer email provided — skipping email.');
    return null;
  }

  // Build PDF as base64 attachment
  let pdfBase64 = null;
  try {
    const doc = buildTicketPDF(orderData, { title: 'Cafe POS Suite — Receipt' });
    pdfBase64 = doc.output('datauristring').split(',')[1];
  } catch (err) {
    console.error('PDF generation for email failed:', err);
  }

  const items = (orderData.items ?? []).map(
    (item) => `${item.quantity}x ${item.name}`
  );

  const payload = {
    to: customerEmail,
    subject: 'Your Cafe Order Receipt',
    order_id: orderData.id ?? orderData.orderId ?? 'N/A',
    table_number: orderData.tableCode ?? orderData.tableId ?? 'N/A',
    customer_name: orderData.customerName ?? orderData.customer?.name ?? 'Guest',
    items,
    total: orderData.total ?? 0,
    pdf_base64: pdfBase64,
  };

  try {
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: payload,
    });

    if (error) {
      console.error('Email send error:', error);
      return null;
    }

    console.log('Order receipt email sent:', data);
    return data;
  } catch (err) {
    // Edge Function may not be deployed — log and continue
    console.warn('Email function not available:', err.message);
    return null;
  }
}
