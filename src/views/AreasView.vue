<script setup lang="ts">
import {ref, type Ref, computed, onBeforeMount} from "vue"
import { useFoodStore } from "../stores/foodStore"
import { useRoute } from "vue-router"
import type { Food } from "../types/FoodStockTypes"
import { storeToRefs } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
var foodStore = useFoodStore()
let { currentRoom } = storeToRefs(foodStore)
var New = false
var unitId = ref(0)
function save () {
  selectedFood.value.need = need.value
  if(New === false) {
    foodStore.updateFood(selectedFood.value, unitId.value)
    close()
  } else {
    let exsist = false 
    foodStore.areaFood.filter( item => {
      if (item.foodName.toUpperCase() === selectedFood.value.foodName.toUpperCase()) {
        exsist = true
      }
    })
    if (exsist === false ) {
      foodStore.createFood(selectedFood.value, currentRoom.value.id, unitId.value)
    } else {
      alert("already created")
    }
    New = false
  }
  
}
function close () {
  selectedFood.value = foodStore.emptyFoodItem as Food
}
function callModal(fi: Food) {
  selectedFood.value = fi
  unitId.value = fi.unit.id
}
async function setRoom(room:any) {
  currentRoom.value = room // this is not typical for inside a computed method so moved to external method
}
var selectedFood: Ref<Food> = ref(foodStore.emptyFoodItem)

var need = computed(() => {
  var toGet =  +selectedFood.value.amountToKeep - +selectedFood.value.stock
  if (toGet < 0 ) {
    toGet = 0
  }
  return toGet
})
const storeRoom = computed(() => {
  foodStore.getStuff()
  foodStore.getFood() 
  var route = useRoute()
  let room = foodStore.rooms.filter((area) => {
    return (area.value === route.params.areaValue)
  })[0]
  setRoom(room)
  return room
})
function create() {
  New = true
  selectedFood.value = {
      amountToKeep: 0,
      foodName: "",
      foodStoragePlace: {
        color: "",
        id: 0,
        value: ""
      },
      unit: {
        color: "",
        id: 0,
        value: ""
      },
      id: 0,
      need: 0,
      order: 0,
      stock: 0,
    }
}
onBeforeMount(() => {
  foodStore.getGroceryList()
})
</script>
<template>
  <div class="about">
    <h1>{{ storeRoom?.value }}</h1>
    <h3 v-if="foodStore.error != ''">Error: {{ foodStore.error }}</h3>
    <ul>
      <li v-for="fi in foodStore.areaFood" :key="fi.id">
        <button class="btn" onclick="my_modal_4.showModal()" @click="callModal(fi)">{{ fi.foodName }}</button><button><FontAwesomeIcon icon="fa-solid fa-arrow-right-arrow-left"/></button>
      </li>
    </ul>
    <dialog id="my_modal_4" class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 v-if="New">New Food</h3><button onclick="my_modal_4.close()" @click="close()">x</button>
        <h3 class="font-bold text-lg" v-if="!New">{{ selectedFood.foodName}}</h3>
        <div class="form-control w-half max-w-xs" v-if="New">
          <label class="label">
            <span class="label-text">Name</span>
          </label>
          <input type="text" placeholder="Food Name" class="input input-bordered w-full max-w-xs" v-model="selectedFood.foodName"/>
        </div>
        <div class="form-control w-half max-w-xs">
          <label class="label">
            <span class="label-text">Amount To Keep</span>
          </label>
          <input type="number" placeholder="Amount To Keep" class="input input-bordered w-full max-w-xs" v-model="selectedFood.amountToKeep"/>
        </div>
        <div class="form-control w-half max-w-xs">
          <label class="label">
            <span class="label-text">Unit</span>
          </label>
          <select class="select select-bordered" v-model="unitId">
            <option disabled selected value="">Pick Unit ({{ unitId }})</option>
            <option v-for="unit in foodStore.Units" :key="unit.id" :value="unit.id">{{ unit.value }}</option>
          </select>
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Owned</span>
          </label>
          <input type="number" placeholder="Owned" class="input input-bordered w-full max-w-xs" v-model="selectedFood.stock"/>
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Need To Get</span>
          </label>
          <input type="number" placeholder="Need To Get" class="input input-bordered w-full max-w-xs" v-model="need"/>
        </div>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn" @click="save()">Save</button>
          </form>
        </div>
      </div>
    </dialog>
    <button class="btn" onclick="my_modal_4.showModal()" @click="create()">+</button>
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
