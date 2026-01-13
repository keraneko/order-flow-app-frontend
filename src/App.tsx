import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import CreateProductPage  from './pages/Products/CreateProduct'
import ProductsPage  from './pages/Products/IndexProducts'
import UpdateProductPage  from './pages/Products/UpdateProduct'

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
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/products/new' element={<CreateProductPage />} />
          <Route path='/products/:id/edit' element={<UpdateProductPage />} />
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
