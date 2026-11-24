/**
 * Payment Gateway Helper for Raghav Rasoi
 * Supports Cash on Delivery / Pay at Shop out-of-the-box,
 * and seamlessly connects to Razorpay / PhonePe when credentials are provided.
 */

export interface PaymentOrderParams {
  orderId: string;
  amountInRupees: number;
  customerName: string;
  customerPhone: string;
}

export function isOnlinePaymentConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createOnlinePaymentOrder(params: PaymentOrderParams) {
  if (!isOnlinePaymentConfigured()) {
    return {
      success: true,
      mode: 'OFFLINE_FALLBACK',
      message: 'Online payment keys not configured; order will be placed as Pay at Counter / COD.',
    };
  }

  // When Razorpay keys are provided in .env:
  try {
    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString('base64');

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(params.amountInRupees * 100), // in paise
        currency: 'INR',
        receipt: params.orderId,
        notes: {
          customerName: params.customerName,
          customerPhone: params.customerPhone,
        },
      }),
    });

    const data = await res.json();
    return {
      success: true,
      mode: 'RAZORPAY',
      gatewayOrderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return {
      success: false,
      error: 'Unable to initiate online payment. You can choose Pay at Counter.',
    };
  }
}
