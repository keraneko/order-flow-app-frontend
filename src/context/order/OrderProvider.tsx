import { OrderContext } from "./OrderContext"
import type { Order } from "./OrderContext"
import {useState} from "react"


export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [order, setOrder] = useState<Order | null>(null)

  const createOrder = (order: Order) => {
    setOrder(order)
    console.log('created order:', order)
  }

  const resetOrder = () => {
    setOrder(null)
  }

  return (
    <OrderContext.Provider value={{order, createOrder, resetOrder }}>
      {children}
    </OrderContext.Provider>
  )
}