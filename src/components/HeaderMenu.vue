<template>
  <v-app-bar color="#012D3C" prominent>
    <router-link
      :to="{
        name: 'Tournaments',
      }"
      class="link"
    >
      <v-toolbar-title class="header-text"><h3>MOTOSCORE</h3></v-toolbar-title>
    </router-link>
  </v-app-bar>
</template>

<script setup lang="ts"></script>
<style lang="scss" scoped>
.header-text {
  color: $white;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
