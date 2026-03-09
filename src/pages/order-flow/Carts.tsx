import CartList from '@/components/cart/CartList';
import CartProducts from '@/components/cart/CartProducts';

function Carts() {
  return (
    <>
      <div className="flex justify-between">
        <div className="w-2/3">
          <CartProducts />
        </div>
        <div className="w-1/3">
          <CartList />
        </div>
      </div>
    </>
  );
}

export default Carts;
