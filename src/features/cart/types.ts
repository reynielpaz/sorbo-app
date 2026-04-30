export interface CartCustomizationOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface CartAddOnItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  categoryName?: string;
  customizations: CartCustomizationOption[];
  addOns: CartAddOnItem[];
  specialInstructions: string;
  lineTotal: number;
  createdAt: string;
}

export type AddCartItemInput = Omit<CartItem, 'id' | 'createdAt'>;
