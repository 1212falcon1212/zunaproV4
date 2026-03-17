import type { OrderItem, Address } from '@zunapro/types';

interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod?: string;
  locale: string;
}

export function generateInvoiceHtml(data: InvoiceData): string {
  const formatCurrency = (amount: number) =>
    `${data.currency} ${amount.toFixed(2)}`;

  const formatAddress = (addr: Address) =>
    `${addr.firstName} ${addr.lastName}<br>${addr.address1}${addr.address2 ? '<br>' + addr.address2 : ''}<br>${addr.city}${addr.state ? ', ' + addr.state : ''} ${addr.postalCode}<br>${addr.country}`;

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${(item.name as Record<string, string>)[data.locale] || Object.values(item.name)[0]}${item.variantName ? `<br><small style="color: #666;">${item.variantName}</small>` : ''}${item.sku ? `<br><small style="color: #999;">SKU: ${item.sku}</small>` : ''}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.total)}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .invoice-title { font-size: 28px; font-weight: bold; color: #1a1a1a; }
    .invoice-meta { text-align: right; color: #666; font-size: 14px; }
    .addresses { display: flex; gap: 40px; margin-bottom: 30px; }
    .address-block { flex: 1; }
    .address-block h3 { font-size: 12px; text-transform: uppercase; color: #999; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #f8f9fa; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; border-bottom: 2px solid #dee2e6; }
    .totals { width: 300px; margin-left: auto; }
    .totals tr td { padding: 6px 0; }
    .totals tr:last-child { border-top: 2px solid #333; font-weight: bold; font-size: 16px; }
    .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div style="color: #666; margin-top: 4px;">${data.invoiceNumber}</div>
    </div>
    <div class="invoice-meta">
      <div><strong>Date:</strong> ${data.date}</div>
      <div><strong>Order:</strong> ${data.orderNumber}</div>
      ${data.paymentMethod ? `<div><strong>Payment:</strong> ${data.paymentMethod}</div>` : ''}
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <h3>Bill To</h3>
      <p>${formatAddress(data.billingAddress)}</p>
    </div>
    <div class="address-block">
      <h3>Ship To</h3>
      <p>${formatAddress(data.shippingAddress)}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Price</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <table class="totals">
    <tr>
      <td>Subtotal</td>
      <td style="text-align: right;">${formatCurrency(data.subtotal)}</td>
    </tr>
    ${data.tax > 0 ? `<tr><td>Tax</td><td style="text-align: right;">${formatCurrency(data.tax)}</td></tr>` : ''}
    ${data.shipping > 0 ? `<tr><td>Shipping</td><td style="text-align: right;">${formatCurrency(data.shipping)}</td></tr>` : ''}
    ${data.discount > 0 ? `<tr><td>Discount</td><td style="text-align: right;">-${formatCurrency(data.discount)}</td></tr>` : ''}
    <tr>
      <td>Total</td>
      <td style="text-align: right;">${formatCurrency(data.total)}</td>
    </tr>
  </table>

  <div class="footer">
    <p>Thank you for your purchase!</p>
  </div>
</body>
</html>`;
}
