<template>
  <div>
    <nav class="nav">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/watchlist">Watchlist</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f5f5f5;
}
a {
  text-decoration: none;
  font-weight: bold;
}
</style>