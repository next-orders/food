<template>
  <div class="mb-4 flex flex-row gap-2 items-center justify-between">
    <NuxtLink :to="productUrl">
      <div class="max-w-[15rem] flex flex-row gap-2 flex-nowrap items-center cursor-pointer active:scale-95 lg:hover:scale-95 lg:active:scale-90 duration-200 group">
        <div class="relative size-14 aspect-square">
          <ProductImage :id="line?.productVariant.product.mediaId" size="xs" />
        </div>

        <div>
          <p class="font-base text-xs leading-tight line-clamp-2">
            {{ line?.productVariant.product.name }}
          </p>
          <div class="mt-1 flex flex-row gap-2 flex-nowrap">
            <div class="text-sm font-medium tracking-tight">
              {{ formatNumberToLocal(line?.productVariant.gross) }} <span class="text-xs">{{ channel.currencySign }}</span>
            </div>
            <div class="text-sm text-(--ui-text-muted) font-light">
              {{ variant?.weightValue }}{{ getWeightLocalizedUnit(variant?.weightUnit) }}
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>

    <CartLineCounter :line-id="lineId" />
  </div>
</template>

<script setup lang="ts">
const { lineId } = defineProps<{
  lineId: string
}>()

const channel = useChannelStore()
const { checkout } = useCheckout()
const line = computed(() => checkout.value?.lines?.find((l) => l.id === lineId))
const variant = computed(() => line.value?.productVariant)
const product = computed(() => line.value?.productVariant?.product)
const productUrl = computed(() => `/catalog/${product.value?.category?.slug}/${product.value?.slug}`)
</script>
