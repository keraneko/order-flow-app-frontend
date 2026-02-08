import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from '@/Layoute.tsx';

import { AppErrorFallback } from './components/errors/AppErrorFallback';
import Apitest from './pages/Apitest';
import CartList from './pages/CartList';
import Carts from './pages/Carts';
import Confirm from './pages/Confirm';
import Customers from './pages/Customers';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import OrderIndexPage from './pages/Orders/IndexOrdersPage';
import CreateProductPage from './pages/Products/CreateProduct';
import ProductsPage from './pages/Products/IndexProducts';
import UpdateProductPage from './pages/Products/UpdateProduct';
import CreateStorePage from './pages/Stores/CreateStore';
import StoresPage from './pages/Stores/Indexstores';
import UpdateStorePage from './pages/Stores/UpdateStore';

export default function AppRoutes() {
  const location = useLocation();

  return (
    <ErrorBoundary
      FallbackComponent={AppErrorFallback}
      resetKeys={[location.pathname]}
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/carts" element={<Carts />} />
          <Route path="/cartlist" element={<CartList />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/test" element={<Apitest />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<CreateProductPage />} />
          <Route path="/products/:id/edit" element={<UpdateProductPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/stores/new" element={<CreateStorePage />} />
          <Route path="/stores/:storeId/edit" element={<UpdateStorePage />} />
          <Route path="/orders" element={<OrderIndexPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
