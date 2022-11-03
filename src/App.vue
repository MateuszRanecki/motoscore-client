<template>
  <v-app class="container">
    <header-menu />
    <v-main>
      <v-container>
        <suspense> <router-view /></suspense>
        <template #fallback> Loading... </template>
      </v-container>
    </v-main>
  </v-app>
</template>

<style></style>

<script setup lang="ts">
import HeaderMenu from "@/components/HeaderMenu.vue";
import { startConnection } from "./helpers/serverConnect";
startConnection();
</script>

<style>
.container {
  background: #00141e;
  overflow: hidden;
}
</style>
