<script setup lang="ts">
import { useFoodStore } from "../stores/foodStore"
var foodStore = useFoodStore()
var rooms = foodStore.rooms
</script>

<template>
  <main>
    <h2>
      <RouterLink v-for="
      // @ts-ignore
      areas in rooms" 
      :key="areas.id" :to="{name: 'area', params: {areaValue: areas.value} }">
        {{areas.value}}<br/>
      </RouterLink>
    </h2>
  </main>
</template>
