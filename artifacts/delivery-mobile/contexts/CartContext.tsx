import React, { createContext, useContext, useMemo, useState } from 'react';

export type CartProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: number;
  category: string;
  storeName: string;
  cuisine: string;
  customization?: string;
  notes?: string;
};

export type CartItem = CartProduct & {
  cartKey: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  addItem: (product: CartProduct, quantity?: number) => void;
  applyCoupon: (code: string) => boolean;
  setQuantity: (cartKey: string, quantity: number) => void;
  removeItem: (cartKey: string) => void;
  clearCart: () => void;
};

const initialItems: CartItem[] = [
  {
    cartKey: 'buncker-classico',
    id: 'buncker-classico',
    name: 'Buncker Clássico',
    description: 'Sem alterações',
    price: 24.9,
    image: require('../assets/images/reference/buncker-classico.jpg'),
    category: 'Hambúrgueres',
    storeName: 'Buncker',
    cuisine: 'Hambúrgueres',
    quantity: 1,
  },
  {
    cartKey: 'combo-bacon',
    id: 'combo-bacon',
    name: 'Combo Bacon',
    description: 'Hambúrguer + batata média + refrigerante 350ml',
    price: 29.9,
    image: require('../assets/images/reference/combo-bacon.jpg'),
    category: 'Combos',
    storeName: 'Buncker',
    cuisine: 'Hambúrgueres',
    quantity: 1,
  },
];

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  const addItem = (product: CartProduct, quantity = 1) => {
    const cartKey = [
      product.id,
      product.customization ?? '',
      product.notes ?? '',
    ].join('::');

    setItems((current) => {
      const existing = current.find((item) => item.cartKey === cartKey);
      if (existing) {
        return current.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...current, { ...product, cartKey, quantity }];
    });
  };

  const setQuantity = (cartKey: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((item) => item.cartKey !== cartKey)
        : current.map((item) =>
            item.cartKey === cartKey ? { ...item, quantity } : item,
          ),
    );
  };

  const removeItem = (cartKey: string) => {
    setItems((current) => current.filter((item) => item.cartKey !== cartKey));
  };

  const clearCart = () => setItems([]);
  const applyCoupon = (code: string) => {
    if (code.trim().toUpperCase() !== 'LANCHE10') {
      setCouponCode(null);
      return false;
    }
    setCouponCode('LANCHE10');
    return true;
  };

  const value = useMemo(
    () => {
      const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
      return {
        items,
        itemCount: items.reduce((total, item) => total + item.quantity, 0),
        subtotal,
        discount: couponCode ? subtotal * 0.1 : 0,
        couponCode,
        addItem,
        applyCoupon,
        setQuantity,
        removeItem,
        clearCart,
      };
    },
    [items, couponCode],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart precisa ser usado dentro de CartProvider.');
  }
  return context;
}
