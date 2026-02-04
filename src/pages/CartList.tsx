import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/context/cart/CartContext';
import { useCart } from '@/context/cart/useCart';

interface CartItemProps {
  item: CartItem;
}

function CartItems({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  // const [tempQty, setTempQty] = useState(String(item.quantity));

  // const handleBlur =() => {
  //     const num = Number(tempQty);
  //     if (Number.isNaN(num) && num < 1) {
  //     setTempQty(String(item.quantity))
  //     return
  //     }
  //     updateQuantity(item.id,num)
  //     }

  const [showBlukButton, setShowBlukButton] = useState(false);

  return (
    <>
      <Button
        className="border bg-white text-black"
        onClick={() => setShowBlukButton((prev) => !prev)}
      >
        more
      </Button>
      <div className="mb-2 flex max-w-5xl items-center border-b p-1">
        <Trash2
          className="m-2 h-10 w-10 rounded border-2 text-red-500"
          onClick={() => {
            removeItem(item.id);
          }}
        />
        <div>
          {item.image ? (
            <img
              className="h-20 w-40 shrink rounded-md object-cover"
              src={`http://localhost/storage/${item.image}`}
              alt={item.name}
            />
          ) : (
            <div className="flex h-20 w-30 items-center justify-center">
              Not Image
            </div>
          )}
        </div>
        <div className="flex h-20 w-full flex-col justify-between pl-4">
          <div>
            <p className="text-base leading-tight font-medium">{item.name}</p>
          </div>
          <div className="flex items-center justify-between">
            <Minus
              className="h-10 w-10 rounded border-2"
              onClick={() => {
                updateQuantity(item.id, item.quantity - 1);
              }}
            />
            <div className="m-1 flex h-10 w-10 items-center justify-center rounded border text-base">
              <p> {item.quantity}</p>
            </div>
            <Plus
              className="h-10 w-10 rounded border-2"
              onClick={() => {
                updateQuantity(item.id, item.quantity + 1);
              }}
            />
            <p className="text-base font-medium">
              ¥ {(item.price * item.quantity).toLocaleString('ja-JP')}
            </p>
          </div>
        </div>
      </div>
      {showBlukButton && (
        <div className="flex justify-end">
          <Button
            onClick={() => {
              updateQuantity(item.id, item.quantity + 10);
            }}
          >
            +10
          </Button>
          <Button
            onClick={() => {
              updateQuantity(item.id, item.quantity + 100);
            }}
          >
            +100
          </Button>
        </div>
      )}
    </>
  );
}

function CartList() {
  const { items, totalPrice, totalItem } = useCart();

  //cartError
  const [cartError, setCartError] = useState<string | null>(null);
  const navigate = useNavigate();
  const onNext = () => {
    if (items.length === 0) {
      setCartError('商品を選択してください');

      return;
    }
    setCartError(null);
    void navigate('/customers');
  };

  return (
    <>
      {items.map((item) => (
        <div key={item.id} className="">
          <CartItems item={item} />
        </div>
      ))}
      <div className="mt-2 flex h-20 flex-col justify-between rounded border bg-gray-100">
        {cartError && items.length === 0 && (
          <p className="text-sm text-red-500">{cartError}</p>
        )}
        <div className="flex justify-between">
          <p>商品小計({totalItem}点)</p>
          <p className="text-xl font-medium text-red-400">
            ¥{totalPrice.toLocaleString('ja-JP')}円
          </p>
        </div>
        <Button
          onClick={onNext}
          className="w-full bg-rose-500 text-xl font-medium hover:bg-rose-800"
        >
          次へ進む
        </Button>
      </div>
    </>
  );
}

export default CartList;
