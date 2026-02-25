import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

import AppRoutes from './AppRoutes';
import { CartProvider } from './context/cart/CartProvider';
import { CustomerProvider } from './context/customer/CustomerProvider';
import { FulfillmentProvider } from './context/fulfillment/FulfillmentProvider';
import { OrderProvider } from './context/order/OrderProvider';
import './App.css';

function App() {
  return (
    <>
      <FulfillmentProvider>
        <CustomerProvider>
          <CartProvider>
            <OrderProvider>
              <BrowserRouter>
                <Toaster position="top-center" />
                <AppRoutes />
              </BrowserRouter>
            </OrderProvider>
          </CartProvider>
        </CustomerProvider>
      </FulfillmentProvider>
    </>
  );
}

export default App;
