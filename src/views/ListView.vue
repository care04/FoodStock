<script setup lang="ts">
import {onBeforeMount} from "vue";
import { useFoodStore } from "../stores/foodStore"
var foodStore = useFoodStore()

onBeforeMount(() => {
  foodStore.getGroceryList()
})  
</script>
<template>
  <main>
    <p v-for="food in foodStore.groceryList" :key="food.id">{{ food.amount + " "}}{{ food.Food[0].value }}</p>
  </main>
</template>