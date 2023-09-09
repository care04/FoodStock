<script setup lang="ts">
import {onBeforeMount} from "vue"
import { useFoodStore } from "../stores/foodStore"
import { useRoute } from "vue-router"
// import { storeToRefs } from 'pinia';

var foodStore = useFoodStore()
onBeforeMount(()=> {
  foodStore.getFood() 
  var route = useRoute()
  var room = foodStore.rooms.filter((area) => {
    return (area.value === route.params.areaValue)
  })
  foodStore.currentRoom = room[0]
})
</script>
<template>
  <div class="about">
    <h1>{{foodStore.currentRoom.value}}</h1>
    <ul>
      <li v-for="fi in foodStore.areaFood" :key="fi.id">
        <button>{{ fi.foodName }}</button>
      </li>
    </ul>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
