<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useFoodStore } from "../stores/foodStore"
var foodStore = useFoodStore()
// await foodStore.getStuff()
onBeforeMount(()=> {
  foodStore.getStuff()
  foodStore.getGroceryList()
})
</script>

<template>
  <main>
    <h2>
      <RouterLink v-for="
      // @ts-ignore
      areas in foodStore.rooms" 
      :key="areas.id" :to="{name: 'area', params: {areaValue: areas.value} }">
        {{areas.value}}<br/>
      </RouterLink>
    </h2>
  </main>
</template>
