<template>
  <UButton
    type="submit"
    size="xl"
    variant="soft"
    color="error"
    class="w-full justify-center"
    @submit="onSubmit"
  >
    {{ $t('center.delete.title') }}
  </UButton>
</template>

<script setup lang="ts">
const { productVariantId } = defineProps<{
  isOpened: boolean
  productVariantId: string
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()
const { refresh: refreshProducts } = await useProduct()

async function onSubmit() {
  const { data, error } = await useAsyncData(
    'delete-product-variant',
    () => $fetch(`/api/product/variant/${productVariantId}`, {
      method: 'DELETE',
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
    toast.add({ title: t('toast.variant-deleted'), description: t('toast.updating-data') })
  }
}
</script>
