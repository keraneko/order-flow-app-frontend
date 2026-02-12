import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from '@/Layoute.tsx';

import { AppErrorFallback } from './components/errors/AppErrorFallback';
import Apitest from './pages/__practice__/react-query/OrderUseQueryTest';
import Test from './pages/__practice__/react-query/Test';
import CartList from './pages/CartList';
import Carts from './pages/Carts';
import Confirm from './pages/Confirm';
import Customers from './pages/Customers';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
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
          <Route path="/carts" element={<Carts />} />
          <Route path="/cartlist" element={<CartList />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/test" element={<Apitest />} />
          <Route path="/test/:postId" element={<Test />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<CreateProductPage />} />
          <Route path="/products/:id/edit" element={<UpdateProductPage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/stores/new" element={<CreateStorePage />} />
          <Route path="/stores/:storeId/edit" element={<UpdateStorePage />} />
          <Route path="/orders" element={<OrderIndexPage />} />
          <Route path="/orders/:orderId" element={<OrderShowPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
