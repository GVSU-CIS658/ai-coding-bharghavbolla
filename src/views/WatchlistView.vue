<script setup>
import { useWatchlistStore } from '../stores/watchlist'

const store = useWatchlistStore()
</script>

<template>
  <div>
    <h1>Watchlist</h1>

    <div v-for="s in store.stocks" :key="s.symbol">
      <p>{{ s.symbol }} - {{ s.description }}</p>
      <button @click="store.removeStock(s.symbol)">Remove</button>
    </div>
  </div>
</template>