<template>
  <div class="min-w-60 px-4 py-3 bg-(--ui-bg-muted) rounded-xl">
    <USwitch
      size="xl"
      :label="isAvailableForPurchase ? $t('center.product.available-for-purchase') : $t('center.product.not-available-for-purchase')"
      :default-value="isAvailableForPurchase"
      @change="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
const { isAvailableForPurchase, productId } = defineProps<{
  isAvailableForPurchase: boolean
  productId: string
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()
const { refresh: refreshProducts } = await useProduct()

async function onSubmit() {
  const { data, error } = await useAsyncData(
    'update-product-availability',
    () => $fetch(`/api/product/${productId}`, {
      method: 'PATCH',
      body: {
        isAvailableForPurchase: !isAvailableForPurchase,
      },
    }),
  )

  if (error.value) {
    console.error(error.value)
    toast.add({ title: t('error.title'), description: '...' })
  }

  if (data.value) {
    await channel.update()
    await refreshProducts()
    emit('success')
    toast.add({ title: t('toast.product-updated'), description: t('toast.updating-data') })
  }
}
</script>
