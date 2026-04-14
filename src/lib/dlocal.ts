
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

export interface DLocalSubscriptionPlanRequest {
  name: string;
  description: string;
  amount: number;
  currency: string;
  country: string;
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
}

export interface DLocalSubscriptionRequest {
  plan_id: string;
  order_id: string;
  success_url: string;
  back_url: string;
  notification_url?: string;
}

function getAuthHeaders() {
  const apiKey = process.env.DLOCAL_GO_API_KEY;
  const apiSecret = process.env.DLOCAL_GO_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    throw new Error("Credenciales de dLocal Go no configuradas en el servidor");
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}:${apiSecret}`
  };
}

function getBaseUrl() {
  const isSandbox = process.env.DLOCAL_ENV !== 'production';
  return isSandbox 
    ? 'https://api-sbx.dlocalgo.com/v1' 
    : 'https://api.dlocalgo.com/v1';
}

export async function createDLocalPayment(data: DLocalPaymentRequest) {
  const baseUrl = getBaseUrl();
  const headers = getAuthHeaders();

  console.log(`Iniciando pago dLocal API para orden: ${data.order_id}`);

  try {
    const response = await fetch(`${baseUrl}/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error dLocal API Response:", result);
      return { success: false, error: result };
    }

    return { 
      success: true, 
      redirect_url: result.redirect_url,
      id: result.id 
    };
  } catch (error) {
    console.error("Excepción en llamada a dLocal API:", error);
    return { success: false, error };
  }
}

export async function createDLocalSubscriptionPlan(data: DLocalSubscriptionPlanRequest) {
  const baseUrl = getBaseUrl();
  const headers = getAuthHeaders();

  console.log(`Creando plan de suscripción dLocal: ${data.name}`);

  try {
    const response = await fetch(`${baseUrl}/subscription_plans`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error dLocal API Response (Plan):", result);
      return { success: false, error: result };
    }

    return { success: true, id: result.id };
  } catch (error) {
    console.error("Excepción al crear plan dLocal:", error);
    return { success: false, error };
  }
}

export async function createDLocalSubscription(data: DLocalSubscriptionRequest) {
  const baseUrl = getBaseUrl();
  const headers = getAuthHeaders();

  console.log(`Iniciando suscripción dLocal para orden: ${data.order_id} con plan: ${data.plan_id}`);

  try {
    const response = await fetch(`${baseUrl}/subscriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error dLocal API Response (Subscription):", result);
      return { success: false, error: result };
    }

    return { 
      success: true, 
      redirect_url: result.redirect_url,
      id: result.id 
    };
  } catch (error) {
    console.error("Excepción al crear suscripción dLocal:", error);
    return { success: false, error };
  }
}

export async function cancelDLocalSubscription(subscriptionId: string) {
  const baseUrl = getBaseUrl();
  const headers = getAuthHeaders();

  console.log(`Cancelando suscripción dLocal: ${subscriptionId}`);

  try {
    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error dLocal API Response (Cancel):", result);
      return { success: false, error: result };
    }

    return { success: true };
  } catch (error) {
    console.error("Excepción al cancelar suscripción dLocal:", error);
    return { success: false, error };
  }
}

export async function retrieveDLocalPayment(paymentId: string) {
  const headers = getAuthHeaders();
  const baseUrl = getBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/payments/${paymentId}`, {
      method: 'GET',
      headers
    });

    const result = await response.json();

    return { success: response.ok, payment: result };
  } catch (error) {
    return { success: false, error };
  }
}
