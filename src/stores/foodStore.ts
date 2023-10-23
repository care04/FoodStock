import { defineStore, acceptHMRUpdate } from 'pinia'
import type { Food, foodStoragePlace, groceryFood } from '@/types/FoodStockTypes'
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
    },
    error: "",
    groceryList: []
  }),
  actions: {
    async getFood() {
      await axios({
        method: "GET",
        url: "http://baserow.sosensible.net/api/database/rows/table/719/?user_field_names=true&exclude=groceryList",
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
        url: "http://baserow.sosensible.net/api/database/fields/table/719/",
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
        url: "http://baserow.sosensible.net/api/database/rows/table/719/" + selectedFood.id + "/?user_field_names=true",
        headers: {
          Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j",
          "Content-Type": "application/json"
        },
        data: {
          unit: unitId,
          amountToKeep: +selectedFood.amountToKeep,
          stock: +selectedFood.stock,
          need: +selectedFood.need,
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    async createFood(selectedFood: Food, storageId: number, unitId: number) {
      await axios({
        method: "POST",
        url: "http://baserow.sosensible.net/api/database/rows/table/719/?user_field_names=true",
        headers: {
          Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j",
          "Content-Type": "application/json"
        },
        data: {
          foodName: selectedFood.foodName,
          amountToKeep: +selectedFood.amountToKeep,
          stock: +selectedFood.stock,
          need: +selectedFood.need,
          foodStoragePlace: storageId,
          unit: unitId, 
        }
      }).then((results) => {
        console.log(results) 
        this.getFood()
        
      }).catch((error) => {
        this.error = error.message
      })
    },
    async getGroceryList(){
      await axios({
        method: "GET",
        url: "http://baserow.sosensible.net/api/database/rows/table/724/?user_field_names=true",
        headers: {
          Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j"
        }
      }).then((response) => {
        this.groceryList = response.data.results
      })
    },
    async createGroceryList(selectedFood: Food){
      let checkCopy = "go ahead"
      this.getGroceryList()
      let itemUpdate = {keep: 0, id: 0}
      this.GroceryList.filter(item => {
        if(item.Food[0].value === selectedFood.foodName){
          checkCopy = "don't create"
          itemUpdate = {keep: selectedFood.need, id: item.id}
        }
      })
      if (checkCopy === "go ahead") {
        await axios({
          method: "POST",
          url: "http://baserow.sosensible.net/api/database/rows/table/724/?user_field_names=true",
          headers: {
            Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j",
            "Content-Type": "application/json"
          },
          data: {
            amount: selectedFood.need,
            Unit: selectedFood.unit.value,
            Food: [
                selectedFood.id
            ]
          }
        }).then(() => {
          this.getGroceryList()
          console.log(this.groceryList)
        })
      } else {
        this.updateGroceryListItem(itemUpdate.keep, itemUpdate.id)
      }
    },
    async updateGroceryListItem(keep: number, id: number) {
      axios({
        method: "PATCH",
        url: "http://baserow.sosensible.net/api/database/rows/table/724/" + id + "/?user_field_names=true",
        headers: {
          Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j",
          "Content-Type": "application/json"
        },
        data: {
          amount: keep
        }
      }).then((response) => {
        console.log(response)
      })
    },
    deleteAreaItemFromList(foodName: String){
      this.getGroceryList()
      this.GroceryList.filter((item) => {
        if(item.Food[0].value === foodName) {
          this.deleteListItem(item.id)
        }
        return (item)
      })
    },
    async deleteListItem(id: number) {
      await axios({
        method: "DELETE",
        url: "http://baserow.sosensible.net/api/database/rows/table/724/"+id+"/",
        headers: {
          Authorization: "Token sLoqMh0UfN5O0WHBeOuwGHvlq7vpPK5j"
        }
      }).then(() => {
        this.getGroceryList()
      })
    }
  },
  getters: {
    areaFood(state) {
      return state.food.filter( food => {
        return state.currentRoom?.id === food.foodStoragePlace.id
      })
    },
    GroceryList(state) {
      return state.groceryList
    },
    listItemToRemove(state) {
      return state.groceryList.filter(item => {
        if (item.Food[0].id === 0) {
          return item.id
        }
      })
    }
  }
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFoodStore, import.meta.hot))
}