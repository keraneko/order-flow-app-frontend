import './App.css'
import { Toaster } from '@/components/ui/sonner'
import { BrowserRouter } from 'react-router-dom'
import {CartProvider} from './context/cart/CartProvider'
import { CustomerProvider } from './context/customer/CustomerProvider' 
import { OrderProvider } from './context/order/OrderProvider'
import AppRoutes from './AppRoutes'

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
