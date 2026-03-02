import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from '@/Layoute.tsx';

import { AppErrorFallback } from './components/errors/AppErrorFallback';
import DeliveryTypeSelector from './components/order/DeliveryTypeSelector';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Carts from './pages/order-flow/Carts';
import Confirm from './pages/order-flow/Confirm';
import Customers from './pages/order-flow/Customers';
import OrderIndexPage from './pages/orders/IndexOrders';
import OrderShowPage from './pages/orders/OrderShow';
import CreateProductPage from './pages/products/CreateProduct';
import ProductsPage from './pages/products/IndexProducts';
import UpdateProductPage from './pages/products/UpdateProduct';
import CreateStorePage from './pages/stores/CreateStore';
import StoresPage from './pages/stores/IndexStores';
import UpdateStorePage from './pages/stores/UpdateStore';

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
          <Route path="/order/options" element={<DeliveryTypeSelector />} />
          <Route path="/order/cart" element={<Carts />} />
          <Route path="/order/customer" element={<Customers />} />
          <Route path="/order/confirm" element={<Confirm />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<CreateProductPage />} />
          <Route path="/products/:id/edit" element={<UpdateProductPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/stores/new" element={<CreateStorePage />} />
          <Route path="/stores/:storeId/edit" element={<UpdateStorePage />} />
          <Route path="/orders" element={<OrderIndexPage />} />
          <Route path="/orders/:id" element={<OrderShowPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
