import { useContext } from 'react';

import { CartContext } from './CartContext';

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider'); //間違った使い方をしたらエラーを出す
  }

  return context;
};
