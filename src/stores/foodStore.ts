import { defineStore, acceptHMRUpdate } from 'pinia'
import type { Food, foodStoragePlace } from '@/types/FoodStockTypes'
import axios from 'axios'
export const useFoodStore = defineStore("food", {
  state: () => ({
    rooms: [] as foodStoragePlace[],
    food: [] as Food[],
    currentRoom: {} as foodStoragePlace,
    Units: [] as foodStoragePlace[],
    emptyFoodItem: {
      amountToKeep: 0,
      foodName: "",
      foodStoragePlace: [{
        color: "",
        id: 0,
        value: ""
      }],
      unit: [{
        color: "",
        id: 0,
        value: ""
      }],
      id: 0,
      need: 0,
      order: 0,
      stock: 0,
    },
    error: ""
  }),
  actions: {
    async getFood() {
      await axios({
        method: "GET",
        url: "http://10.0.0.6/api/database/rows/table/719/?user_field_names=true&exclude=groceryList",
        headers: {
          Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j"
        }
      }).then((response) => {
        this.food = response.data.results as Food[]
      })
    },
    async getStuff() {
      axios({
        method: "GET",
        url: "http://10.0.0.6/api/database/fields/table/719/",
        headers: {
          Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j",
        }
      }).then((response) => {
        this.rooms = response.data[5].select_options as [foodStoragePlace]
        this.Units = response.data[6].select_options as [foodStoragePlace]
      })
    },
    async updateFood(selectedFood: Food, unitId: number) {
      await axios({
        method: "PATCH",
        url: "http://10.0.0.6/api/database/rows/table/719/" + selectedFood.id + "/?user_field_names=true",
        headers: {
          Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j",
          "Content-Type": "application/json"
        },
        data: {
          unit: [unitId],
          amountToKeep: +selectedFood.amountToKeep,
          stock: +selectedFood.stock,
          need: +selectedFood.need,
        }
      }).then((response) => {
        console.log(response.data.results)
      }).catch((error) => {
        console.log(error)
      })
    },
    async createFood(selectedFood: Food, storageId: number, unitId: number) {
      await axios({
        method: "Post",
        url: "http://10.0.0.6/api/database/rows/table/719/?user_field_names=true",
        headers: {
          Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j",
          "Content-Type": "application/json"
        },
        data: {
          unit: [+unitId], 
          amountToKeep: +selectedFood.amountToKeep,
          stock: +selectedFood.stock,
          need: +selectedFood.need,
          foodStoragePlace: [+storageId],
          foodName: selectedFood.foodName,
        }
      }).then(() => {
        this.error = ""
      }).catch((error) => {
        console.log(error)
        this.error = error.message
      })
    }
  },
  getters: {
    areaFood(state) {
      return state.food.filter( food => {
        return state.currentRoom?.id === food.foodStoragePlace[0].id
      })
    },
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFoodStore, import.meta.hot))
}