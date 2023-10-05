export interface Food {
  amountToKeep: Number,
  foodName: String,
  foodStoragePlace: foodStoragePlace,
  unit: foodStoragePlace,
  id: Number,
  need: Number,
  order: Number,
  stock: Number,
}
export interface GroceryList {
  Food:[groceryFood]
  amount: Number
  id: Number
  order: Number
}
export interface groceryFood {
  id: Number,
  value: String
}
export interface foodStoragePlace {
  color: string,
  id: number,
  value: string
}
