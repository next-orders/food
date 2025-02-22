<template>
  <UButton
    type="submit"
    variant="soft"
    color="error"
    size="xl"
    class="w-full justify-center items-center"
    @submit="onSubmit"
  >
    {{ $t('center.delete.title') }}
  </UButton>
</template>

<script setup lang="ts">
const { productId, redirectTo } = defineProps<{
  isOpened: boolean
  productId: string
  redirectTo: string
}>()

const emit = defineEmits(['success'])

const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()
const { refresh: refreshProducts } = await useProduct()

async function onSubmit() {
  const { data, error } = await useAsyncData(
    'delete-product',
    () => $fetch(`/api/product/${productId}`, {
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
    toast.add({ title: t('toast.product-deleted'), description: t('toast.updating-data') })
    router.push(redirectTo)
  }
}
</script>
