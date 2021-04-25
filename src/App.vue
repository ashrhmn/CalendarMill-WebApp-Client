<template>
  <div class="mx-auto bg-green-10">
    <div>
      <h1 class="text-6xl font-bold">Siraj Calendar Mill</h1>
      <hr>
      <h1 class="text-3xl font-bold">Ganga Prasad, Shahzadpur, Sirajgonj</h1>
      <hr>
      <hr>
      <hr>
    </div>
    <div id="nav">
      <router-link to="/">Customers</router-link> |
      <router-link to="/item">Items</router-link> |
      <router-link to="/data">Data</router-link> |
      <router-link to="/new">New Entry</router-link>
    </div>
    <router-view />
  </div>
</template>

<script setup>
// import CustomerList from "./components/CustomerList.vue";
// import ItemList from "./components/ItemList.vue";
// import NewData from "./components/NewData.vue";
// import DataView from "./components/DataView.vue";

// <CustomerList />
// <ItemList/>

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>