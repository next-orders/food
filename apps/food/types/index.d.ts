declare global {
  interface Channel {
    id: string
    createdAt: Date
    updatedAt: Date
    slug: string
    name: string
    description: string | null
    currencyCode: CurrencyCode
  }

  type CurrencyCode = 'USD' | 'EUR' | 'RUB'

  interface Menu {
    id: string
    createdAt: Date
    updatedAt: Date
    slug: string
    name: string
    channelId: string
    categories: MenuCategory[]
  }

  interface MenuCategory {
    id: string
    createdAt: Date
    updatedAt: Date
    slug: string
    name: string
    menuId: string
  }

  interface Product {
    id: string
    createdAt: Date
    updatedAt: Date
    slug: string
    name: string
    description: string
    isAvailableForPurchase: boolean
    channelId: string
    categoryId: string
    variants: ProductVariant[]
  }

  interface ProductVariant {
    id: string
    createdAt: Date
    updatedAt: Date
    productId: string
    weightUnit: WeightUnit
    weightValue: number
    gross: number
    net: number | null
  }

  type WeightUnit = 'G' | 'KG' | 'ML' | 'L' | 'OZ' | 'LB'

  interface Checkout {
    id: string
    createdAt: Date
    updatedAt: Date
    deliveryMethod: CheckoutDeliveryMethod
    shippingPrice: number
    totalPrice: number
    discount: number | null
    channelId: string
  }

  type CheckoutDeliveryMethod = 'DELIVERY' | 'WAREHOUSE'

  interface CheckoutLine {
    id: string
    createdAt: Date
    updatedAt: Date
    checkoutId: string
    productVariantId: string
    quantity: number
    unitPrice: number
    undiscountedUnitPrice: number
    totalPrice: number
    undiscountedTotalPrice: number
    isGift: boolean
  }
}

export {}
