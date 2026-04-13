
export interface DLocalPaymentRequest {
  amount: number;
  currency: string;
  country: string;
  order_id: string;
  description: string;
  success_url: string;
  back_url: string;
  notification_url?: string;
}

export async function createDLocalPayment(data: DLocalPaymentRequest) {
  const apiKey = process.env.DLOCAL_GO_API_KEY;
  const apiSecret = process.env.DLOCAL_GO_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    throw new Error("Credenciales de dLocal Go no configuradas en el servidor");
  }

  const isSandbox = process.env.DLOCAL_ENV !== 'production';
  const baseUrl = isSandbox 
    ? 'https://api-sbx.dlocalgo.com/v1' 
    : 'https://api.dlocalgo.com/v1';

  console.log(`Iniciando pago dLocal API (${isSandbox ? 'SANDBOX' : 'PRODUCTION'}) para orden: ${data.order_id}`);

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
      console.error("Error dLocal API Response:", result);
      return { success: false, error: result };
    }

    return { 
      success: true, 
      redirect_url: result.redirect_url, // Esta es la URL que devuelve la API para redirigir al checkout
      id: result.id 
    };
  } catch (error) {
    console.error("Excepción en llamada a dLocal API:", error);
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

    return { success: response.ok, payment: result };
  } catch (error) {
    return { success: false, error };
  }
}
