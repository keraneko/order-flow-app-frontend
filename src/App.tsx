import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/Home'
import Carts from './pages/Carts'
import CartList from './pages/CartList'
import Customers from './pages/Customers'
import Confirm from './pages/Confirm'
import Layout from '@/Layoute.tsx'
import {CartProvider} from './context/cart/CartProvider'
import { CustomerProvider } from './context/customer/CustomerProvider' 
import { OrderProvider } from './context/order/OrderProvider'
import Apitest from './pages/Apitest'

function App() {

  return (
    <>
    <CustomerProvider>
    <CartProvider>
      <OrderProvider>
      <BrowserRouter>
      
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/carts" element={<Carts />} />
          <Route path="/cartlist" element={<CartList />} />
          <Route path="/customers" element={<Customers />} />
          <Route path='/confirm' element={<Confirm />} />
          <Route path='/test' element={<Apitest />} />
        </Route>
      </Routes>
      </BrowserRouter>
      </OrderProvider>
      </CartProvider>
      </CustomerProvider>
    </>
  )
}

export default App
