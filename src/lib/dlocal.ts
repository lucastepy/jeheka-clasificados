
export interface DLocalPaymentRequest {
  amount: number;
  currency: string;
  country: string;
  order_id: string;
  description: string;
  success_url: string;
  back_url: string;
  notification_url?: string;
  allow_recurring?: boolean;
}

export async function createDLocalPayment(data: DLocalPaymentRequest) {
  const apiKey = process.env.DLOCAL_GO_API_KEY;
  const apiSecret = process.env.DLOCAL_GO_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    console.error("DLOCAL_GO_API_KEY or DLOCAL_GO_API_SECRET not set");
    // En desarrollo, podríamos simular el éxito si queremos, pero mejor fallar para avisar al usuario
    // return { success: false, message: "Faltan credenciales de dLocal" };
  }

  const isSandbox = process.env.DLOCAL_ENV !== 'production';
  const baseUrl = isSandbox 
    ? 'https://api-sbx.dlocalgo.com/v1' 
    : 'https://api.dlocalgo.com/v1';

  try {
    const response = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}:${apiSecret}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("dLocal API Error:", result);
      return { success: false, error: result };
    }

    return { success: true, redirect_url: result.redirect_url, result };
  } catch (error) {
    console.error("dLocal Request Exception:", error);
    return { success: false, error };
  }
}

export async function retrieveDLocalPayment(paymentId: string) {
  const apiKey = process.env.DLOCAL_GO_API_KEY;
  const apiSecret = process.env.DLOCAL_GO_API_SECRET;
  
  const isSandbox = process.env.DLOCAL_ENV !== 'production';
  const baseUrl = isSandbox 
    ? 'https://api-sbx.dlocalgo.com/v1' 
    : 'https://api.dlocalgo.com/v1';

  try {
    const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}:${apiSecret}`
      }
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result };
    }

    return { success: true, payment: result };
  } catch (error) {
    return { success: false, error };
  }
}
