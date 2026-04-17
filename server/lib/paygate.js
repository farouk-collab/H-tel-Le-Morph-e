export async function createPayGatePayment({ amount, phone, reservation, provider }) {
  const mode = (process.env.PAYMENT_MODE || 'mock').toLowerCase()
  const reference = `LM-${Date.now()}`

  if (mode === 'mock') {
    return {
      ok: true,
      provider,
      reference,
      status: 'completed',
      amount,
      checkoutUrl: `${process.env.PAYGATE_RETURN_URL || process.env.APP_URL || 'http://localhost:5173'}/mon-compte?payment=${reference}`,
      meta: {
        simulated: true,
        phone,
        reservationId: reservation.id,
      },
    }
  }

  if (!process.env.PAYGATE_IDENTIFIER || !process.env.PAYGATE_API_KEY) {
    return {
      ok: false,
      message: 'Les identifiants PayGate ne sont pas configurés dans le fichier .env.',
    }
  }

  return {
    ok: false,
    message: 'Le mode live PayGate est prêt à être branché, mais la requête API exacte dépend de vos identifiants et de la documentation marchande fournie après activation.',
    reference,
  }
}
