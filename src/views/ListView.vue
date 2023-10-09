<script setup lang="ts">
import {onBeforeMount} from "vue";
import { useFoodStore } from "../stores/foodStore"
var foodStore = useFoodStore()
function deleteItem(id: number) {
  console.log(id)
  foodStore.deleteListItem(id)
}
onBeforeMount(() => {
  foodStore.getGroceryList()
})  
</script>
<template>
  <main>
    <ul>
      <li v-for="food in foodStore.groceryList" :key="food.id">
      <button class="btn" @click="deleteItem(food.id)">x</button>
        {{ "    " + food.amount + " "}}{{ food.Unit + " " }}{{ food.Food[0].value }}
      </li>
    </ul>
  </main>
</template>