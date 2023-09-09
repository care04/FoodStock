export interface Food {
  amountToKeep: Number,
  foodName: String,
  foodStoragePlace: foodStoragePlace[],
  id: Number,
  need: Number,
  order: Number,
  stock: Number,
}
export interface GroceryList {
  food: string,
  amountNeeded: number
}


export interface foodStoragePlace {
  color: string,
  id: number,
  value: string
}