import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  AddCartItemInput,
  CartAddOnItem,
  CartCustomizationOption,
  CartItem,
} from '../types';

const CART_STORAGE_KEY = 'sorbo_cart';

interface CartStoreState {
  items: CartItem[];
  addItem: (input: AddCartItemInput) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementItem: (itemId: string) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  hasItems: () => boolean;
}

function normalizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.trunc(quantity));
}

function sortCustomizations(customizations: CartCustomizationOption[]) {
  return [...customizations].sort((left, right) => {
    const groupComparison = left.groupId.localeCompare(right.groupId);

    if (groupComparison !== 0) {
      return groupComparison;
    }

    return left.optionId.localeCompare(right.optionId);
  });
}

function sortAddOns(addOns: CartAddOnItem[]) {
  return [...addOns].sort((left, right) => left.productId.localeCompare(right.productId));
}

function getCustomizationsTotal(customizations: CartCustomizationOption[]) {
  return customizations.reduce((total, option) => total + option.priceDelta, 0);
}

function getAddOnsTotal(addOns: CartAddOnItem[]) {
  return addOns.reduce((total, addOn) => total + addOn.price, 0);
}

function calculateLineTotal(item: Pick<CartItem, 'price' | 'quantity' | 'customizations' | 'addOns'>) {
  const unitTotal = item.price + getCustomizationsTotal(item.customizations);
  return (unitTotal + getAddOnsTotal(item.addOns)) * normalizeQuantity(item.quantity);
}

function normalizeCartInput(input: AddCartItemInput, quantity = input.quantity): AddCartItemInput {
  const normalizedInput = {
    ...input,
    quantity: normalizeQuantity(quantity),
    customizations: sortCustomizations(input.customizations),
    addOns: sortAddOns(input.addOns),
    specialInstructions: input.specialInstructions.trim(),
  };

  return {
    ...normalizedInput,
    lineTotal: calculateLineTotal(normalizedInput),
  };
}

function createCartItemId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `cart_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getCustomizationsSignature(customizations: CartCustomizationOption[]) {
  return sortCustomizations(customizations)
    .map((option) => `${option.groupId}:${option.optionId}`)
    .join('|');
}

function getAddOnsSignature(addOns: CartAddOnItem[]) {
  return sortAddOns(addOns)
    .map((addOn) => addOn.productId)
    .join('|');
}

function getComparableSignature(item: Pick<CartItem, 'productId' | 'customizations' | 'addOns' | 'specialInstructions'>) {
  return [
    item.productId,
    getCustomizationsSignature(item.customizations),
    getAddOnsSignature(item.addOns),
    item.specialInstructions.trim(),
  ].join('::');
}

function createCartItem(input: AddCartItemInput): CartItem {
  const normalizedInput = normalizeCartInput(input);

  return {
    ...normalizedInput,
    id: createCartItemId(),
    createdAt: new Date().toISOString(),
  };
}

function updateCartItemQuantity(item: CartItem, quantity: number): CartItem {
  const normalizedQuantity = normalizeQuantity(quantity);
  const nextItem = {
    ...item,
    quantity: normalizedQuantity,
  };

  return {
    ...nextItem,
    lineTotal: calculateLineTotal(nextItem),
  };
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(input) {
        const normalizedInput = normalizeCartInput(input);
        const inputSignature = getComparableSignature(normalizedInput);

        set((state) => {
          const existingItem = state.items.find(
            (item) => getComparableSignature(item) === inputSignature
          );

          if (!existingItem) {
            return {
              items: [...state.items, createCartItem(normalizedInput)],
            };
          }

          return {
            items: state.items.map((item) => {
              if (item.id !== existingItem.id) {
                return item;
              }

              const mergedInput = normalizeCartInput(
                normalizedInput,
                item.quantity + normalizedInput.quantity
              );

              return {
                ...item,
                ...mergedInput,
                id: item.id,
                createdAt: item.createdAt,
              };
            }),
          };
        });
      },

      removeItem(itemId) {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity(itemId, quantity) {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? updateCartItemQuantity(item, quantity) : item
          ),
        }));
      },

      incrementItem(itemId) {
        const item = get().items.find((cartItem) => cartItem.id === itemId);

        if (!item) {
          return;
        }

        get().updateQuantity(itemId, item.quantity + 1);
      },

      decrementItem(itemId) {
        const item = get().items.find((cartItem) => cartItem.id === itemId);

        if (!item) {
          return;
        }

        get().updateQuantity(itemId, item.quantity - 1);
      },

      clearCart() {
        set({ items: [] });
      },

      getItemCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal() {
        return get().items.reduce((total, item) => total + item.lineTotal, 0);
      },

      hasItems() {
        return get().items.length > 0;
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
