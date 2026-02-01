import { Routes, Route, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { AppErrorFallback } from "./components/ui/AppErrorFallback";

import Home from "./pages/Home";
import Carts from "./pages/Carts";
import CartList from "./pages/CartList";
import Customers from "./pages/Customers";
import Confirm from "./pages/Confirm";
import Apitest from "./pages/Apitest";
import CreateProductPage from "./pages/Products/CreateProduct";
import ProductsPage from "./pages/Products/IndexProducts";
import UpdateProductPage from "./pages/Products/UpdateProduct";
import Layout from "@/Layoute.tsx";
import StoresPage from "./pages/Stores/Indexstores";
import CreateStorePage from "./pages/Stores/CreateStore";
import UpdateStorePage from "./pages/Stores/UpdateStore";

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
          <Route path="/stores/:storeid/edit" element={<UpdateStorePage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
