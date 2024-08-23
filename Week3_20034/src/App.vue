<template>
  <nav>
    <router-link
        v-for="route in routes"
        :key="route.path"
        :to="route.path"
    >
      {{ route.name }}
    </router-link>
  </nav>
  <router-view/>
</template>
<script>
import { routes } from './router';
export default {
  data() {
    return {
      routes
    }
  }
}
</script>