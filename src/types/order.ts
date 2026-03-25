/** Estado del pedido en el flujo de cocina */
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

/** Tipo de pedido */
export type OrderType = 'takeout' | 'dine_in';

/** Método de pago */
export type PaymentMethod = 'pago_movil' | 'binance' | 'zelle' | 'efectivo';

/** Item individual dentro de un pedido */
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  customizations?: string[];
  imageUrl?: string;
}

/** Item en el carrito de compras (antes de convertirse en orden) */
export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  customizations?: string[];
}

/** Pedido completo */
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  paymentMethod?: PaymentMethod;
  orderType: OrderType;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
