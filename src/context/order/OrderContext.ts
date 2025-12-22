import { createContext} from "react"
import type { Customer } from "@/context/customer/CustomerContext"
import type { CartItem } from "../cart/CartContext" 



export type Order = {
  customer: Customer
  items: CartItem[]
  totalAmount: number
  createdAt: string
}

type OrderContextType = {
  order: Order | null
  createOrder: (order: Order) => void
  resetOrder: () => void
}

export const OrderContext = createContext<OrderContextType | null>(null)