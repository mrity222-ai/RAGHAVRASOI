/**
 * SMS Gateway Helper for Raghav Rasoi
 * Sends real OTP verification SMS to Indian mobile numbers via Fast2SMS / Twilio.
 * In development mode, logs OTP to console and returns success.
 */

export async function sendOtpSms(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

  if (cleanPhone.length !== 10) {
    return { success: false, message: 'Invalid 10-digit mobile number' };
  }

  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    console.log(`[DEVELOPMENT MODE] OTP for ${cleanPhone}: ${otp}`);
    return {
      success: true,
      message: 'OTP generated in development mode.',
    };
  }

  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variables_values: otp,
        route: 'otp',
        numbers: cleanPhone,
      }),
    });

    const data = await response.json();
    if (data.return) {
      return { success: true, message: 'OTP sent to mobile successfully.' };
    } else {
      console.warn('Fast2SMS response:', data);
      return { success: false, message: data.message || 'SMS delivery failed' };
    }
  } catch (err) {
    console.error('Error sending OTP SMS:', err);
    return { success: false, message: 'SMS gateway network error' };
  }
}
