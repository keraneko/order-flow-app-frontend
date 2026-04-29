import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AdminLayout, PublicLayout } from '@/Layoute.tsx';

import { RequireRole } from './components/auth/RequireRole';
import { AppErrorFallback } from './components/errors/AppErrorFallback';
import DeliveryTypeSelector from './components/order/DeliveryTypeSelector';
import Home from './pages/Home';
import Login from './pages/LoginPage';
import NotFound from './pages/NotFound';
import Carts from './pages/order-flow/Carts';
import Confirm from './pages/order-flow/Confirm';
import Customers from './pages/order-flow/Customers';
import OrderIndexPage from './pages/orders/IndexOrders';
import OrderDeliveryTypeEditPage from './pages/orders/OrderDeliveryTypeEditPage';
import OrderItemsEdit from './pages/orders/OrderItemsEdit';
import OrderShowPage from './pages/orders/OrderShow';
import CreateProductPage from './pages/products/CreateProduct';
import ProductsPage from './pages/products/IndexProducts';
import UpdateProductPage from './pages/products/UpdateProduct';
import { ProtectedRoute } from './pages/ProtectedRoute';
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
        {/* login責務 */}
        <Route path="/login" element={<Login />} />
        <Route element={<PublicLayout />}>
          {/* 公開用Route */}
          <Route path="/" element={<Home />} />
          <Route path="/order/options" element={<DeliveryTypeSelector />} />
          <Route path="/order/cart" element={<Carts />} />
          <Route path="/order/customer" element={<Customers />} />
          <Route path="/order/confirm" element={<Confirm />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            {/* 管理用Route */}
            <Route
              path="/products"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <ProductsPage />
                </RequireRole>
              }
            />
            <Route
              path="/products/new"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <CreateProductPage />
                </RequireRole>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <UpdateProductPage />
                </RequireRole>
              }
            />
            <Route
              path="/stores"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <StoresPage />
                </RequireRole>
              }
            />
            <Route
              path="/stores/new"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <CreateStorePage />
                </RequireRole>
              }
            />
            <Route
              path="/stores/:storeId/edit"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <UpdateStorePage />
                </RequireRole>
              }
            />
            <Route path="/orders" element={<OrderIndexPage />} />
            <Route path="/orders/:id" element={<OrderShowPage />} />
            <Route path="/orders/:id/items/edit" element={<OrderItemsEdit />} />
            <Route
              path="/orders/:id/delivery-type/edit"
              element={<OrderDeliveryTypeEditPage />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
