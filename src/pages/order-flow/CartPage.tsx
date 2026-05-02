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

  const [showBlukButton, setShowBlukButton] = useState(false);

  return (
    <div className="mb-3">
      <div className="flex items-center gap-3 rounded-xl border bg-white p-3">
        {/* 画像 */}
        <div className="shrink-0">
          {item.image ? (
            <img
              className="h-20 w-24 shrink-0 rounded-lg object-contain"
              src={`http://localhost/storage/${item.image}`}
              alt={item.name}
            />
          ) : (
            <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
              画像なし
            </div>
          )}
        </div>

        {/* 商品情報・数量 */}
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-start justify-between">
            <p className="text-sm leading-tight font-semibold">{item.name}</p>
            <Trash2
              className="h-5 w-5 shrink-0 cursor-pointer text-gray-300 transition-colors hover:text-red-400"
              onClick={() => removeItem(item.id)}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* 数量操作 */}
            <div className="flex items-center gap-1">
              <Minus
                className="h-8 w-8 cursor-pointer rounded-lg border p-1 text-gray-500 transition-colors hover:bg-amber-50"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              />
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium">
                {item.quantity}
              </div>
              <Plus
                className="h-8 w-8 cursor-pointer rounded-lg border p-1 text-gray-500 transition-colors hover:bg-amber-50"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              />
            </div>

            {/* 小計 */}
            <p className="text-sm font-bold text-amber-700">
              ¥{(item.price * item.quantity).toLocaleString('ja-JP')}
            </p>
          </div>
        </div>
      </div>

      {/* more ボタン */}
      <div className="mt-1 flex justify-end">
        <button
          className="text-xs text-gray-300 transition-colors hover:text-gray-400"
          onClick={() => setShowBlukButton((prev) => !prev)}
        >
          {showBlukButton ? '閉じる' : 'まとめて追加 ∨'}
        </button>
      </div>

      {/* まとめて追加ボタン */}
      {showBlukButton && (
        <div className="mt-1 flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-xs"
            onClick={() => updateQuantity(item.id, item.quantity + 10)}
          >
            +10
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-xs"
            onClick={() => updateQuantity(item.id, item.quantity + 100)}
          >
            +100
          </Button>
        </div>
      )}
    </div>
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
    void navigate('/order/customer');
  };

  return (
    <div className="flex flex-col gap-1">
      <h2 className="py-4 text-lg font-bold">カート</h2>

      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          カートに商品がありません
        </p>
      ) : (
        items.map((item) => <CartItems key={item.id} item={item} />)
      )}

      {/* 合計・次へ */}
      <div className="mt-2 rounded-xl border bg-gray-50 p-4">
        {cartError && items.length === 0 && (
          <p className="mb-2 text-sm text-red-500">{cartError}</p>
        )}
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-gray-500">商品小計（{totalItem}点）</p>
          <p className="text-lg font-bold text-amber-700">
            ¥{totalPrice.toLocaleString('ja-JP')}円
          </p>
        </div>
        <Button
          onClick={onNext}
          className="w-full rounded-xl bg-amber-700 text-base font-medium hover:bg-amber-800"
        >
          次へ進む →
        </Button>
      </div>
    </div>
  );
}

export default CartList;
