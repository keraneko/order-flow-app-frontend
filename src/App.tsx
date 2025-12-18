import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/Home'
import Carts from './pages/Carts'
import CartList from './pages/CartList'
import Customers from './pages/Customers'
import Confirm from './pages/Confirm'
import Layout from '@/Layoute.tsx'
import {CartProvider} from './context/CartContext'
import { CustomerProvider } from './context/CustomerContext'

function App() {

  return (
    <>
    <CustomerProvider>
    <CartProvider>
      <BrowserRouter>
      
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/carts" element={<Carts />} />
          <Route path="/cartlist" element={<CartList />} />
          <Route path="/customers" element={<Customers />} />
          <Route path='/confirm' element={<Confirm />} />
        </Route>
      </Routes>
      </BrowserRouter>
      </CartProvider>
      </CustomerProvider>
    </>
  )
}

export default App
