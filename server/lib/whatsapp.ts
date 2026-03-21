import type { BookingWithCondition } from '../types';

function formatBookingMessage(booking: BookingWithCondition): string {
  const ref = booking.id.substring(0, 8).toUpperCase();
  return [
    `New Booking - Elite Physio Clinics`,
    ``,
    `Reference: ${ref}`,
    `Patient: ${booking.patientName}`,
    `Phone: ${booking.patientPhone}`,
    `Email: ${booking.patientEmail}`,
    `Condition: ${booking.conditionTitle}`,
    `Date: ${booking.date}`,
    `Time: ${booking.startTime} - ${booking.endTime}`,
  ].join('\n');
}

export async function sendBookingNotification(booking: BookingWithCondition): Promise<void> {
  const message = formatBookingMessage(booking);
  const provider = process.env.WHATSAPP_PROVIDER;

  try {
    if (provider === 'meta') {
      const token = process.env.WHATSAPP_TOKEN;
      const from = process.env.WHATSAPP_FROM;
      const to = process.env.WHATSAPP_TO;
      if (!token || !from || !to) throw new Error('Meta WhatsApp env vars not configured');

      await fetch(`https://graph.facebook.com/v18.0/${from}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        }),
      });
      console.log('[WhatsApp] Notification sent via Meta');
    } else if (provider === 'twilio') {
      const token = process.env.WHATSAPP_TOKEN;
      const from = process.env.WHATSAPP_FROM;
      const to = process.env.WHATSAPP_TO;
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      if (!token || !from || !to || !accountSid) throw new Error('Twilio env vars not configured');

      const params = new URLSearchParams({ From: `whatsapp:${from}`, To: `whatsapp:${to}`, Body: message });
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: 'POST',
        headers: { Authorization: `Basic ${Buffer.from(`${accountSid}:${token}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      console.log('[WhatsApp] Notification sent via Twilio');
    } else {
      console.log('[WhatsApp] No provider configured — logging notification:');
      console.log(message);
    }
  } catch (err) {
    console.error('[WhatsApp] Notification failed (non-blocking):', err);
  }
}
