import type { CartItem } from '@/features/cart/types';
import { supabase } from '@/lib/supabase';
import type { OrderType } from '@/types/order';
import type { PaymentMethodId } from '@/utils/constants';

type JsonObject = Record<string, unknown>;

export interface CreateOrderInput {
  userId?: string | null;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethodId;
  orderType: OrderType;
  notes?: string;
  ticket: string;
  customerName: string;
  customerPhone: string;
}

export interface CreateOrderResult {
  id: string | null;
  ticket: string;
}

interface InsertedOrderRow {
  id: string | null;
}

function mapCartItemToOrderPayload(item: CartItem): JsonObject {
  return {
    id: item.id,
    productId: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    lineTotal: item.lineTotal,
    imageUrl: item.imageUrl ?? null,
    customizations: item.customizations.map((customization) => ({
      groupId: customization.groupId,
      groupName: customization.groupName,
      optionId: customization.optionId,
      optionName: customization.optionName,
      priceDelta: customization.priceDelta,
    })),
    addOns: item.addOns.map((addOn) => ({
      productId: addOn.productId,
      name: addOn.name,
      price: addOn.price,
      imageUrl: addOn.imageUrl ?? null,
    })),
    specialInstructions: item.specialInstructions,
  };
}

function buildOrderNotes(ticket: string, notes?: string) {
  const trimmedNotes = notes?.trim() ?? '';

  if (!trimmedNotes) {
    return `Ticket: ${ticket}`;
  }

  return `Ticket: ${ticket}\n\nNota cliente:\n${trimmedNotes}`;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const orderPayload = {
    user_id: input.userId ?? null,
    items: input.items.map(mapCartItemToOrderPayload),
    total: input.total,
    payment_method: input.paymentMethod,
    order_type: input.orderType,
    notes: buildOrderNotes(input.ticket, input.notes),
    status: 'pending',
  };

  const { data, error } = await supabase
    .from('orders')
    .insert(orderPayload)
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'No pudimos registrar el pedido.');
  }

  const insertedOrder = data as InsertedOrderRow | null;

  return {
    id: typeof insertedOrder?.id === 'string' ? insertedOrder.id : null,
    ticket: input.ticket,
  };
}
