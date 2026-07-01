const API_BASE_URL = 'http://localhost:8000/api/v1'

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

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' })
}
