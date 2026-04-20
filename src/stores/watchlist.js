import { defineStore } from 'pinia'

export const useWatchlistStore = defineStore('watchlist', {
  state: () => ({
    stocks: JSON.parse(localStorage.getItem('watchlist') || '[]')
  }),

  actions: {
    save() {
      localStorage.setItem('watchlist', JSON.stringify(this.stocks))
    },

    addStock(stock) {
      if (!this.stocks.find(s => s.symbol === stock.symbol)) {
        this.stocks.push(stock)
        this.save()
      }
    },

    removeStock(symbol) {
      this.stocks = this.stocks.filter(s => s.symbol !== symbol)
      this.save()
    }
  }
})