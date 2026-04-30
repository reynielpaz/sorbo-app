import { useEffect, useMemo, useState } from 'react';
import type { CustomizationOption, Product, ProductCustomization } from '@/types';
import {
  APP_NAME,
  PRODUCT_ORDER_PAYMENT_METHODS,
  type ProductOrderPaymentMethodId,
} from '@/utils/constants';
import { formatPrice } from '@/utils/formatPrice';

type SelectedOptionsByGroup = Record<string, string[]>;

interface SelectedCustomizationGroup {
  customization: ProductCustomization;
  selectedOptions: CustomizationOption[];
}

interface ProductOrderDraft {
  product: Product;
  quantity: number;
  selectedCustomizationGroups: SelectedCustomizationGroup[];
  selectedAddOns: Product[];
  specialInstructions: string;
  customerName: string;
  customerPhone: string;
  selectedPaymentMethod: ProductOrderPaymentMethodId | null;
  selectedPaymentMethodName: string;
  totalEstimate: number;
  whatsappMessage: string;
}

const SPECIAL_INSTRUCTIONS_LIMIT = 240;
const EMPTY_CUSTOMIZATIONS: ProductCustomization[] = [];
const EMPTY_PRODUCTS: Product[] = [];
const CUSTOMER_NAME_LIMIT = 80;
const CUSTOMER_PHONE_LIMIT = 24;

interface UseProductOrderComposerOptions {
  initialCustomerName?: string | null;
  initialCustomerPhone?: string | null;
  availableAddOns?: Product[];
}

function buildSelectedCustomizationGroups(
  customizations: ProductCustomization[],
  selectedOptionsByGroup: SelectedOptionsByGroup
): SelectedCustomizationGroup[] {
  return customizations
    .map((customization) => {
      const selectedIds = new Set(selectedOptionsByGroup[customization.id] ?? []);

      return {
        customization,
        selectedOptions: customization.options.filter((option) => selectedIds.has(option.id)),
      };
    })
    .filter((group) => group.selectedOptions.length > 0);
}

function formatOptionForMessage(option: CustomizationOption) {
  if (typeof option.price === 'number' && option.price > 0) {
    return `${option.label} (+${formatPrice(option.price)})`;
  }

  return option.label;
}

function buildWhatsAppMessage(options: {
  product: Product;
  quantity: number;
  selectedCustomizationGroups: SelectedCustomizationGroup[];
  selectedAddOns: Product[];
  specialInstructions: string;
  customerName: string;
  customerPhone: string;
  selectedPaymentMethodName: string;
  totalEstimate: number;
}) {
  const lines = [
    `Hola, equipo de ${APP_NAME} 👋`,
    '',
    'Quiero realizar el siguiente pedido:',
    '',
    `🍽️ Producto: ${options.product.name}`,
    `Cantidad: ${options.quantity}`,
    `Precio base: ${formatPrice(options.product.price)}`,
  ];

  if (options.selectedCustomizationGroups.length > 0) {
    lines.push('', 'Customizaciones:');

    options.selectedCustomizationGroups.forEach((group) => {
      const selection = group.selectedOptions.map(formatOptionForMessage).join(', ');
      lines.push(`- ${group.customization.name}: ${selection}`);
    });
  }

  if (options.selectedAddOns.length > 0) {
    lines.push('', 'Adicionales:');

    options.selectedAddOns.forEach((addOn) => {
      lines.push(`- ${addOn.name} (${formatPrice(addOn.price)})`);
    });
  }

  if (options.specialInstructions) {
    lines.push('', 'Instrucciones especiales:', `- ${options.specialInstructions}`);
  }

  if (options.selectedPaymentMethodName) {
    lines.push('', 'Método de pago:', `- ${options.selectedPaymentMethodName}`);
  }

  if (options.customerName || options.customerPhone) {
    lines.push('', 'Datos del cliente:');

    if (options.customerName) {
      lines.push(`- Nombre: ${options.customerName}`);
    }

    if (options.customerPhone) {
      lines.push(`- Teléfono: ${options.customerPhone}`);
    }
  }

  lines.push(
    '',
    `Total estimado: ${formatPrice(options.totalEstimate)}`,
    '',
    '¿Me confirman disponibilidad, por favor?',
    'Gracias.'
  );

  return lines.join('\n');
}

function getMissingRequiredGroupIds(
  customizations: ProductCustomization[],
  selectedOptionsByGroup: SelectedOptionsByGroup
) {
  return customizations
    .filter((customization) => customization.required)
    .filter((customization) => {
      const selectedIds = selectedOptionsByGroup[customization.id] ?? [];
      return selectedIds.length === 0;
    })
    .map((customization) => customization.id);
}

function findPaymentMethodName(paymentMethodId: ProductOrderPaymentMethodId | null) {
  if (!paymentMethodId) {
    return '';
  }

  return PRODUCT_ORDER_PAYMENT_METHODS.find((paymentMethod) => paymentMethod.id === paymentMethodId)?.name ?? '';
}

export function useProductOrderComposer(
  product: Product | null,
  options?: UseProductOrderComposerOptions
) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructionsState] = useState('');
  const [customerName, setCustomerNameState] = useState(options?.initialCustomerName?.trim() ?? '');
  const [customerPhone, setCustomerPhoneState] = useState(options?.initialCustomerPhone?.trim() ?? '');
  const [selectedPaymentMethod, setSelectedPaymentMethodState] =
    useState<ProductOrderPaymentMethodId | null>(null);
  const [selectedOptionsByGroup, setSelectedOptionsByGroup] = useState<SelectedOptionsByGroup>({});
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [hasEditedCustomerName, setHasEditedCustomerName] = useState(false);
  const [hasEditedCustomerPhone, setHasEditedCustomerPhone] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setSpecialInstructionsState('');
    setSelectedOptionsByGroup({});
    setSelectedAddOnIds([]);
  }, [product?.id]);

  useEffect(() => {
    const initialCustomerName = options?.initialCustomerName?.trim() ?? '';

    if (!hasEditedCustomerName && initialCustomerName) {
      setCustomerNameState((currentValue) => currentValue || initialCustomerName);
    }
  }, [hasEditedCustomerName, options?.initialCustomerName]);

  useEffect(() => {
    const initialCustomerPhone = options?.initialCustomerPhone?.trim() ?? '';

    if (!hasEditedCustomerPhone && initialCustomerPhone) {
      setCustomerPhoneState((currentValue) => currentValue || initialCustomerPhone);
    }
  }, [hasEditedCustomerPhone, options?.initialCustomerPhone]);

  const customizations = product?.customizations ?? EMPTY_CUSTOMIZATIONS;
  const availableAddOns = options?.availableAddOns ?? EMPTY_PRODUCTS;

  const selectedCustomizationGroups = useMemo(
    () => buildSelectedCustomizationGroups(customizations, selectedOptionsByGroup),
    [customizations, selectedOptionsByGroup]
  );

  const selectedAddOns = useMemo(
    () => availableAddOns.filter((addOn) => selectedAddOnIds.includes(addOn.id)),
    [availableAddOns, selectedAddOnIds]
  );

  const missingRequiredGroupIds = useMemo(
    () => getMissingRequiredGroupIds(customizations, selectedOptionsByGroup),
    [customizations, selectedOptionsByGroup]
  );

  const extrasPerUnit = useMemo(
    () =>
      selectedCustomizationGroups.reduce(
        (sum, group) =>
          sum +
          group.selectedOptions.reduce((groupSum, option) => groupSum + (option.price ?? 0), 0),
        0
      ),
    [selectedCustomizationGroups]
  );
  const addOnsTotal = useMemo(
    () => selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0),
    [selectedAddOns]
  );

  const estimatedUnitTotal = (product?.price ?? 0) + extrasPerUnit;
  const totalEstimate = estimatedUnitTotal * quantity + addOnsTotal;
  const sanitizedSpecialInstructions = specialInstructions.trim();
  const sanitizedCustomerName = customerName.trim();
  const sanitizedCustomerPhone = customerPhone.trim();
  const selectedPaymentMethodName = findPaymentMethodName(selectedPaymentMethod);
  const isCustomerNameValid = sanitizedCustomerName.length >= 2;
  const hasSelectedPaymentMethod = Boolean(selectedPaymentMethod);
  const canSubmit =
    Boolean(product?.isAvailable) &&
    missingRequiredGroupIds.length === 0 &&
    isCustomerNameValid &&
    hasSelectedPaymentMethod;

  const disabledReason = !product
    ? 'Producto no disponible en este momento'
    : !product.isAvailable
    ? 'Producto no disponible en este momento'
    : missingRequiredGroupIds.length > 0
      ? 'Selecciona las opciones obligatorias para continuar'
      : !isCustomerNameValid
        ? 'Ingresa tu nombre para continuar'
        : !hasSelectedPaymentMethod
          ? 'Selecciona un método de pago para continuar'
      : null;

  const whatsappMessage = useMemo(
    () => {
      if (!product) {
        return '';
      }

      return buildWhatsAppMessage({
        product,
        quantity,
        selectedCustomizationGroups,
        selectedAddOns,
        specialInstructions: sanitizedSpecialInstructions,
        customerName: sanitizedCustomerName,
        customerPhone: sanitizedCustomerPhone,
        selectedPaymentMethodName,
        totalEstimate,
      });
    },
    [
      product,
      quantity,
      sanitizedSpecialInstructions,
      sanitizedCustomerName,
      sanitizedCustomerPhone,
      selectedAddOns,
      selectedCustomizationGroups,
      selectedPaymentMethodName,
      totalEstimate,
    ]
  );

  const productOrderDraft = useMemo<ProductOrderDraft | null>(() => {
    if (!product) {
      return null;
    }

    return {
      product,
      quantity,
      selectedCustomizationGroups,
      selectedAddOns,
      specialInstructions: sanitizedSpecialInstructions,
      customerName: sanitizedCustomerName,
      customerPhone: sanitizedCustomerPhone,
      selectedPaymentMethod,
      selectedPaymentMethodName,
      totalEstimate,
      whatsappMessage,
    };
  }, [
    product,
    quantity,
    sanitizedSpecialInstructions,
    sanitizedCustomerName,
    sanitizedCustomerPhone,
    selectedAddOns,
    selectedCustomizationGroups,
    selectedPaymentMethod,
    selectedPaymentMethodName,
    totalEstimate,
    whatsappMessage,
  ]);

  function incrementQuantity() {
    setQuantity((currentQuantity) => currentQuantity + 1);
  }

  function decrementQuantity() {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  }

  function setSpecialInstructions(nextValue: string) {
    setSpecialInstructionsState(nextValue.slice(0, SPECIAL_INSTRUCTIONS_LIMIT));
  }

  function setCustomerName(nextValue: string) {
    setHasEditedCustomerName(true);
    setCustomerNameState(nextValue.slice(0, CUSTOMER_NAME_LIMIT));
  }

  function setCustomerPhone(nextValue: string) {
    setHasEditedCustomerPhone(true);
    setCustomerPhoneState(nextValue.slice(0, CUSTOMER_PHONE_LIMIT));
  }

  function setSelectedPaymentMethod(paymentMethodId: ProductOrderPaymentMethodId) {
    setSelectedPaymentMethodState(paymentMethodId);
  }

  function toggleAddOn(addOn: Product) {
    setSelectedAddOnIds((currentSelectedIds) =>
      currentSelectedIds.includes(addOn.id)
        ? currentSelectedIds.filter((selectedId) => selectedId !== addOn.id)
        : [...currentSelectedIds, addOn.id]
    );
  }

  function isOptionSelected(customizationId: string, optionId: string) {
    return (selectedOptionsByGroup[customizationId] ?? []).includes(optionId);
  }

  function toggleOption(customization: ProductCustomization, optionId: string) {
    setSelectedOptionsByGroup((current) => {
      const currentSelection = current[customization.id] ?? [];

      if (customization.type === 'single') {
        if (currentSelection[0] === optionId) {
          return current;
        }

        return {
          ...current,
          [customization.id]: [optionId],
        };
      }

      const isSelected = currentSelection.includes(optionId);
      const nextSelection = isSelected
        ? currentSelection.filter((selectedId) => selectedId !== optionId)
        : [...currentSelection, optionId];

      if (nextSelection.length === 0) {
        const nextSelectedOptionsByGroup = { ...current };
        delete nextSelectedOptionsByGroup[customization.id];
        return nextSelectedOptionsByGroup;
      }

      return {
        ...current,
        [customization.id]: nextSelection,
      };
    });
  }

  return {
    quantity,
    selectedOptionsByGroup,
    selectedCustomizationGroups,
    selectedAddOnIds,
    selectedAddOns,
    missingRequiredGroupIds,
    specialInstructions,
    customerName,
    customerPhone,
    selectedPaymentMethod,
    selectedPaymentMethodName,
    specialInstructionsLimit: SPECIAL_INSTRUCTIONS_LIMIT,
    specialInstructionsCount: specialInstructions.length,
    extrasPerUnit,
    addOnsTotal,
    estimatedUnitTotal,
    totalEstimate,
    whatsappMessage,
    productOrderDraft,
    canSubmit,
    disabledReason,
    isCustomerNameValid,
    hasSelectedPaymentMethod,
    incrementQuantity,
    decrementQuantity,
    setSpecialInstructions,
    setCustomerName,
    setCustomerPhone,
    setSelectedPaymentMethod,
    toggleAddOn,
    isOptionSelected,
    toggleOption,
  };
}
