/** Opción de personalización de un producto (ej: "Sin cebolla", "Extra salsa") */
export interface CustomizationOption {
  id: string;
  label: string;
  price?: number;
}

/** Grupo de opciones de personalización (ej: "Proteína", "Extras") */
export interface ProductCustomization {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
}

/** Categoría del menú */
export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

/** Etiquetas disponibles para un producto */
export type ProductTag = 'nuevo' | 'popular' | 'promo';

/** Producto del menú */
export interface Product {
  id: string;
  categoryId: string;
  category?: Category;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  tags: ProductTag[];
  discountPercent: number;
  sortOrder: number;
  ingredients?: string[];
  customizations: ProductCustomization[];
  createdAt: string;
  updatedAt: string;
}
