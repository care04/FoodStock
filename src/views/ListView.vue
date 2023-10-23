<script setup lang="ts">
import {onBeforeMount} from "vue";
import { useFoodStore } from "../stores/foodStore"
var foodStore = useFoodStore()
function deleteItem(id: number) {
  console.log(id)
  foodStore.deleteListItem(id)
}
function printList() {
  const printableContent = document.getElementById('grocery-list')
  const printWindow = window.open('', '', 'height=1000,width=1000')
  printWindow.document.write(printableContent.innerHTML)
  printWindow.print()
}
onBeforeMount(() => {
  foodStore.getGroceryList()
})  
</script>
<template>
  <main>
    <ul id="grocery-list">
      <h2>Grocery List</h2>
      <li v-for="food in foodStore.groceryList" :key="food.id">
      <button class="btn" @click="deleteItem(food.id)">x</button>
        {{ "    " + food.amount + " "}}{{ food.Unit + " " }}{{ food.Food[0].value }}
      </li>
    </ul>
    <button @click="printList()" class="btn" margin-top="10">print</button>
  </main>
</template>