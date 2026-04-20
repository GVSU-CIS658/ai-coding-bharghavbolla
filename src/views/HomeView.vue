<script setup>
import { ref } from 'vue'
import { searchStocks, getStockQuote } from '../services/stockApi'
import { useWatchlistStore } from '../stores/watchlist'

const query = ref('')
const results = ref([])
const selected = ref(null)
const quote = ref(null)
const error = ref('')
const loading = ref(false)

const store = useWatchlistStore()

async function search() {
  error.value = ''
  results.value = []
  selected.value = null
  quote.value = null

  if (!query.value.trim()) {
    error.value = 'Please enter a stock symbol or company name.'
    return
  }

  try {
    loading.value = true
    results.value = await searchStocks(query.value)
    if (!results.value.length) {
      error.value = 'No matching stocks found.'
    }
  } catch (err) {
    error.value = 'Search failed. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function selectStock(stock) {
  error.value = ''
  selected.value = stock

  try {
    loading.value = true
    quote.value = await getStockQuote(stock.symbol)
  } catch (err) {
    error.value = 'Could not load stock quote.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function add() {
  if (!selected.value) return

  store.addStock({
    symbol: selected.value.symbol,
    description: selected.value.description
  })
}

function formatTime(ts) {
  if (!ts) return 'N/A'
  return new Date(ts * 1000).toLocaleString()
}

function getChangeClass(value) {
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return ''
}
</script>

<template>
  <div class="container">
    <h1>Stock App</h1>

    <div class="search-box">
      <input v-model="query" placeholder="Search stock by symbol or company name" />
      <button @click="search">Search</button>
    </div>

    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <ul v-if="results.length" class="results">
      <li v-for="s in results" :key="s.symbol">
        <button @click="selectStock(s)" class="result-btn">
          {{ s.symbol }} - {{ s.description }}
        </button>
      </li>
    </ul>

    <div v-if="quote && selected" class="card">
      <h2>{{ selected.symbol }} - {{ selected.description }}</h2>
      <p :class="getChangeClass(quote.d)">
        <strong>Current Price:</strong> {{ quote.c }}
      </p>
      <p :class="getChangeClass(quote.d)">
        <strong>Change:</strong> {{ quote.d }}
      </p>
      <p :class="getChangeClass(quote.dp)">
        <strong>Percent Change:</strong> {{ quote.dp }}%
      </p>
      <p><strong>High:</strong> {{ quote.h }}</p>
      <p><strong>Low:</strong> {{ quote.l }}</p>
      <p><strong>Open:</strong> {{ quote.o }}</p>
      <p><strong>Previous Close:</strong> {{ quote.pc }}</p>
      <p><strong>Last Updated:</strong> {{ formatTime(quote.t) }}</p>

      <button @click="add" class="add-btn">Add to Watchlist</button>
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

h1 {
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-box input {
  flex: 1;
  padding: 12px;
  font-size: 16px;
}

.search-box button,
.result-btn,
.add-btn {
  padding: 10px 16px;
  cursor: pointer;
}

.results {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.results li {
  margin-bottom: 10px;
}

.result-btn {
  width: 100%;
  text-align: left;
}

.card {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #fafafa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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