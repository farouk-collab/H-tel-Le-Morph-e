function buildReference() {
  return `LM-${Date.now()}`
}

function buildReturnUrl(reference) {
  const baseUrl = process.env.PAYGATE_RETURN_URL || process.env.APP_URL || 'http://localhost:5173/mon-compte'
  const returnUrl = new URL(baseUrl)
  returnUrl.searchParams.set('payment', reference)
  return returnUrl.toString()
}

function buildDescription({ reservation, provider, reference }) {
  const reservationLabel = reservation?.reservationLabel || reservation?.roomName || reservation?.spaceName || 'Reservation Hotel Le Morphee'
  const providerLabel = provider === 'flooz' ? 'Flooz' : provider === 'tmoney' ? 'TMoney' : 'PayGate'
  return `${reservationLabel} - ${providerLabel} - ${reference}`
}

function buildPayGateHostedUrl({ amount, description, provider, phone, reference }) {
  const paymentPageBase = process.env.PAYGATE_PAYMENT_PAGE || 'https://paygateglobal.com/v1/page'
  const callbackUrl = process.env.PAYGATE_CALLBACK_URL || ''
  const params = new URLSearchParams({
    amount: String(Math.round(Number(amount || 0))),
    description,
    identifier: process.env.PAYGATE_IDENTIFIER,
    token: process.env.PAYGATE_API_KEY,
    url: buildReturnUrl(reference),
  })

  if (callbackUrl) {
    // Inference from PayGate's public FAQ: some setups keep the callback in the
    // dashboard, but we also pass it explicitly when available.
    params.set('callback_url', callbackUrl)
  }

  if (provider === 'flooz' || provider === 'tmoney') {
    params.set('provider', provider)
  }

  if (phone) {
    params.set('phone', phone)
  }

  return `${paymentPageBase}?${params.toString()}`
}

export async function createPayGatePayment({ amount, phone, reservation, provider }) {
  const mode = (process.env.PAYMENT_MODE || 'mock').toLowerCase()
  const reference = buildReference()

  if (mode === 'mock') {
    return {
      ok: true,
      provider,
      reference,
      status: 'completed',
      amount,
      checkoutUrl: buildReturnUrl(reference),
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

  const numericAmount = Math.round(Number(amount || 0))

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return {
      ok: false,
      message: 'Le montant PayGate est invalide.',
      reference,
    }
  }

  return {
    ok: true,
    provider,
    reference,
    status: 'pending',
    amount: numericAmount,
    checkoutUrl: buildPayGateHostedUrl({
      amount: numericAmount,
      description: buildDescription({ reservation, provider, reference }),
      provider,
      phone,
      reference,
    }),
    meta: {
      simulated: false,
      integrationMode: 'hosted-page',
      provider,
      phone: phone || null,
      reservationId: reservation.id,
      callbackConfigured: Boolean(process.env.PAYGATE_CALLBACK_URL),
    },
  }
}
