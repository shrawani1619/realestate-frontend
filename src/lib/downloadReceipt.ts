import { Booking } from '@/lib/types';

export function downloadBookingReceipt(booking: Booking) {
  const receipt = `
REAL ESTATE — BOOKING RECEIPT
=============================

Booking ID: ${booking._id}
Date: ${new Date(booking.createdAt).toLocaleString()}
Status: ${booking.status.toUpperCase()}

CUSTOMER
--------
Name: ${booking.fullName}
Email: ${booking.email}
Phone: ${booking.phone}

PLOT DETAILS
------------
Plot Number: ${booking.plot?.plotNumber || '—'}
Layout: ${booking.layout?.name || '—'}
Location: ${booking.layout?.location || '—'}
Size: ${booking.plot?.size || '—'}
Price: ₹${booking.plot?.price?.toLocaleString() || '—'}

${booking.approvedAt ? `Approved: ${new Date(booking.approvedAt).toLocaleString()}\n` : ''}
Thank you for your booking!
`.trim();

  const blob = new Blob([receipt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `booking-receipt-${booking.plot?.plotNumber || booking._id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
