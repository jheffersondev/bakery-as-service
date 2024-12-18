<template>
  <Navbar />
  <router-view :key="$route.fullPath"></router-view>
</template>

<script lang="ts" setup>
import Navbar from '@/components/Account/Navbar.vue'
</script>

<style></style>
