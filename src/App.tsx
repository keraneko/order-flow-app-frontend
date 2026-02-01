import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

import AppRoutes from './AppRoutes'
import {CartProvider} from './context/cart/CartProvider'
import { CustomerProvider } from './context/customer/CustomerProvider' 
import { OrderProvider } from './context/order/OrderProvider'
import './App.css'

function App() {

  return (
    <>
    <CustomerProvider>
      <CartProvider>
        <OrderProvider>
          <BrowserRouter>
            <Toaster position='top-center'/>
            <AppRoutes />
          </BrowserRouter>
        </OrderProvider>
      </CartProvider>
    </CustomerProvider>
    </>
  )
}

export default App
