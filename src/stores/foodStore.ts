import { defineStore, acceptHMRUpdate } from 'pinia'
import type { Food, foodStoragePlace } from '@/types/FoodStockTypes'
import axios from 'axios'

export const useFoodStore = defineStore("food", {
  state: () => ({
    rooms: [
      {id: 3754, value: "Refrigerator", color: "darker-blue"},
      {id: 3757, value: "Pantry", color: "light-purple"},
      {id: 3756, value: "Porch", color: "darker-purple"},
      {id: 3755, value: "Freezer", color: "yellow"}
    ] as foodStoragePlace[],
    food: [] as Food[],
    currentRoom: {} as foodStoragePlace,
  }),
  actions: {
    async getFood() {
      await axios({
        method: "GET",
        url: "http://baserow.localcloud.sosensible.net:82/api/database/rows/table/719/?user_field_names=true&exclude=groceryList",
        headers: {
          Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j"
        }
      }).then((response) => {
        this.food = response.data.results as Food[]
        
      })
    },
  },
  getters: {
    areaFood(state) {
      return state.food.filter( food => {
        console.log({scr: state.currentRoom, ffsp: food.foodStoragePlace[0]})
        return state.currentRoom.id === food.foodStoragePlace[0].id
      })
    }
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFoodStore, import.meta.hot))
}