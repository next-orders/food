interface MenuWithData extends Menu {
  categories: MenuCategoryWithData[]
}

interface MenuCategoryWithData extends MenuCategory {
  products: ProductWithData[]
}

interface ProductWithData extends Product {
  variants: ProductVariant[]
  category: MenuCategory
}

export const useChannelStore = defineStore('channel', () => {
  const id = ref('')
  const isActive = ref(false)
  const name = ref('')
  const description = ref<string | null>(null)
  const currencyCode = ref<CurrencyCode | undefined>(undefined)
  const countryCode = ref<CountryCode | undefined>(undefined)
  const timeZone = ref<string>('')
  const isPickupAvailable = ref(false)
  const isDeliveryAvailable = ref(false)
  const phone = ref<string | null>(null)
  const conditions = ref<string | null>(null)
  const minAmountForDelivery = ref<number | null>(null)
  const masterAccountExists = ref(false)
  const workingDay = ref<WorkingDay | undefined>(undefined)
  const workingDays = ref<WorkingDay[]>([])
  const menus = ref<MenuWithData[]>([])
  const paymentMethods = ref<PaymentMethod[]>([])
  const warehouses = ref<Warehouse[]>([])

  const activeMenu = computed<MenuWithData | null>(() => menus.value.find((menu) => menu.isActive) || null)
  const activeCategories = computed<MenuCategoryWithData[]>(() => activeMenu.value ? activeMenu.value.categories : [])
  const activeProducts = computed<ProductWithData[]>(() => activeCategories.value.flatMap((category) => category.products.filter((p) => p.variants.length > 0)))
  const allCategories = computed<MenuCategoryWithData[]>(() => menus.value.flatMap((menu) => menu.categories))
  const allProducts = computed<ProductWithData[]>(() => menus.value.flatMap((menu) => menu.categories.flatMap((category) => category.products)))
  const currencySign = computed<string>(() => currencyCode.value ? CURRENCY_SIGNS[currencyCode.value as CurrencyCode] : '')
  const isOnMaintenance = computed<boolean>(() => isActive.value === false || !activeMenu.value || (!isPickupAvailable.value && !isDeliveryAvailable.value))
  const isInitialized = computed<boolean>(() => !!id.value && !!masterAccountExists.value)

  async function update() {
    const { data } = await useFetch('/api/channel', {
      lazy: true,
      server: true,
    })
    if (!data.value) {
      throw new Error('Channel data not found')
    }

    id.value = data.value.id
    isActive.value = data.value.isActive
    name.value = data.value.name
    description.value = data.value.description
    currencyCode.value = data.value.currencyCode as CurrencyCode
    countryCode.value = data.value.countryCode as CountryCode
    timeZone.value = data.value.timeZone
    isPickupAvailable.value = data.value.isPickupAvailable
    isDeliveryAvailable.value = data.value.isDeliveryAvailable
    phone.value = data.value.phone
    conditions.value = data.value.conditions
    minAmountForDelivery.value = data.value.minAmountForDelivery
    masterAccountExists.value = data.value.masterAccountExists
    menus.value = data.value.menus
    paymentMethods.value = data.value.paymentMethods as PaymentMethod[]
    warehouses.value = data.value.warehouses
    workingDay.value = data.value.workingDay as WorkingDay | undefined
    workingDays.value = data.value.workingDays as WorkingDay[]
  }
  function getMenu(id: string): MenuWithData | null {
    return menus.value.find((menu) => menu.id === id) || null
  }
  function getMenuCategory(id: string): MenuCategoryWithData | null {
    return allCategories.value.find((category) => category.id === id) || null
  }
  function getActiveMenuCategory(id: string): MenuCategoryWithData | null {
    return activeMenu.value?.categories.find((category) => category.id === id) || null
  }
  function getActiveMenuCategoryBySlug(slug: string): MenuCategoryWithData | null {
    return activeMenu.value?.categories.find((category) => category.slug === slug) || null
  }
  function getProduct(id: string): ProductWithData | null {
    return allProducts.value.find((product) => product.id === id) || null
  }
  function getProductBySlug(slug: string): ProductWithData | null {
    return allProducts.value.find((product) => product.slug === slug) || null
  }

  return {
    id,
    isActive,
    name,
    description,
    currencyCode,
    countryCode,
    timeZone,
    isPickupAvailable,
    isDeliveryAvailable,
    phone,
    conditions,
    minAmountForDelivery,
    masterAccountExists,
    workingDay,
    workingDays,
    menus,
    paymentMethods,
    warehouses,

    activeMenu,
    activeCategories,
    activeProducts,
    allCategories,
    allProducts,
    currencySign,
    isOnMaintenance,
    isInitialized,

    update,
    getMenu,
    getMenuCategory,
    getActiveMenuCategory,
    getActiveMenuCategoryBySlug,
    getProduct,
    getProductBySlug,
  }
})
