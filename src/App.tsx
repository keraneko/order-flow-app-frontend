import { BrowserRouter, Routes, Route } from 'react-router'
import Home from './pages/Home'
import Carts from './pages/Carts'
import CartList from './pages/CartList'
import Layout from '@/Layoute.tsx'
import {CartProvider} from './contexts/CartContext'
function App() {

  return (
    <>
    <CartProvider>
      <BrowserRouter>
      
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/carts" element={<Carts />} />
          <Route path="/cartlist" element={<CartList />} />
        </Route>
      </Routes>
      </BrowserRouter>
      </CartProvider>
    </>
  )
}

export default App
