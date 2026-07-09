export const API_BASE_URL = 'http://localhost:8000/api'

/**
 * Perform a generic fetch call with automatic authentication header inclusion.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    let errorData = {}
    try {
      errorData = await response.json()
    } catch {
      // Fallback if response is not JSON
    }
    
    // Auto-logout on unauthorized credentials
    if (response.status === 401) {
      localStorage.removeItem('token')
      window.dispatchEvent(new Event('auth_logout'))
    }

    throw new Error(errorData.detail || 'API request failed')
  }

  return response.json()
}

async function download(endpoint, fallbackFilename = 'download.pdf') {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    let errorData = {}
    try {
      errorData = await response.json()
    } catch {
      // PDF endpoints may return plain error bodies.
    }
    if (response.status === 401) {
      localStorage.removeItem('token')
      window.dispatchEvent(new Event('auth_logout'))
    }
    throw new Error(errorData.detail || 'File download failed')
  }

  const blob = await response.blob()
  const disposition = response.headers.get('Content-Disposition') || ''
  const filenameMatch = disposition.match(/filename="?([^"]+)"?/i)
  const filename = filenameMatch?.[1] || fallbackFilename
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(url)
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
  download,
}
