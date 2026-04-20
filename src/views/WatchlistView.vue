<script setup>
import { ref, onMounted } from 'vue'
import { useWatchlistStore } from '../stores/watchlist'
import { getStockQuote } from '../services/stockApi'

const watchlistStore = useWatchlistStore()
const stockData = ref({})
const loading = ref(false)
const error = ref('')

async function loadWatchlistData() {
  if (!watchlistStore.stocks.length) return

  try {
    loading.value = true
    error.value = ''

    for (const stock of watchlistStore.stocks) {
      const quote = await getStockQuote(stock.symbol)
      stockData.value[stock.symbol] = quote
    }
  } catch (err) {
    error.value = 'Failed to load watchlist data.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function removeFromWatchlist(symbol) {
  watchlistStore.removeStock(symbol)
  delete stockData.value[symbol]
}

function getChangeClass(value) {
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return ''
}

onMounted(() => {
  loadWatchlistData()
})
</script>

<template>
  <div class="container">
    <h1>Watchlist</h1>

    <p v-if="loading">Loading watchlist data...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="watchlistStore.stocks.length === 0">
      <p>No stocks in your watchlist yet.</p>
    </div>

    <div
      v-for="stock in watchlistStore.stocks"
      :key="stock.symbol"
      class="card"
    >
      <h2>{{ stock.symbol }} - {{ stock.description }}</h2>
      <p><strong>Current Price:</strong> {{ stockData[stock.symbol]?.c ?? 'Loading...' }}</p>
      <p :class="getChangeClass(stockData[stock.symbol]?.d)">
        <strong>Change:</strong> {{ stockData[stock.symbol]?.d ?? 'Loading...' }}
      </p>
      <p :class="getChangeClass(stockData[stock.symbol]?.dp)">
        <strong>Percent Change:</strong> {{ stockData[stock.symbol]?.dp ?? 'Loading...' }}%
      </p>

      <button @click="removeFromWatchlist(stock.symbol)" class="remove-btn">
        Remove
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
  padding: 30px 20px;
  font-family: Arial, sans-serif;
}

.card {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #fafafa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.remove-btn {
  padding: 10px 16px;
  cursor: pointer;
}

.error {
  color: red;
}

.positive {
  color: green;
  font-weight: bold;
}

.negative {
  color: red;
  font-weight: bold;
}
</style>