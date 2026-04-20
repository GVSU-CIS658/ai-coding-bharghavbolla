const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY
const BASE = 'https://finnhub.io/api/v1'

export async function searchStocks(query) {
  if (!API_KEY) {
    throw new Error('Missing Finnhub API key')
  }

  const res = await fetch(
    `${BASE}/search?q=${encodeURIComponent(query)}&token=${API_KEY}`
  )

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`)
  }

  const data = await res.json()
  return data.result?.slice(0, 5) || []
}

export async function getStockQuote(symbol) {
  if (!API_KEY) {
    throw new Error('Missing Finnhub API key')
  }

  const res = await fetch(
    `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`
  )

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`)
  }

  return await res.json()
}