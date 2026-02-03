import {useState} from "react"

import type { Order } from "./OrderContext"
import { OrderContext } from "./OrderContext"


export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [order, setOrder] = useState<Order | null>(null)

  const createOrder = async (order: Order) => {
    setOrder(order)
    console.log('created order:', order)

    const res = await fetch("api/orders",
      {method: "POST",
        headers: {"Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(order),
    })
      console.log("status:", res.status)
      const text = await res.text()
      console.log(text)  
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