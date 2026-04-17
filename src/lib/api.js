const JSON_HEADERS = { 'Content-Type': 'application/json' }

async function request(path, options = {}) {
  const response = await fetch(path, options)
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof body === 'object' && body?.message ? body.message : 'Une erreur est survenue.'
    throw new Error(message)
  }

  return body
}

export function apiGet(path, token) {
  return request(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}

export function apiPost(path, data, token) {
  return request(path, {
    method: 'POST',
    headers: {
      ...JSON_HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  })
}

export function apiPut(path, data, token) {
  return request(path, {
    method: 'PUT',
    headers: {
      ...JSON_HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  })
}

export function apiDelete(path, token) {
  return request(path, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}
