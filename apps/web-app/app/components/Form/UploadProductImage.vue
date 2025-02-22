<template>
  <UForm
    :schema="productImageUploadSchema"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('common.photo')" name="file">
      <UInput
        v-model="state.file"
        type="file"
        accept="image/*"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UButton
      type="submit"
      variant="solid"
      color="primary"
      size="xl"
      class="mt-3 w-full justify-center items-center"
    >
      {{ $t('center.upload.title') }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { ProductImageUploadSchema } from '@next-orders/core/shared/services/product'
import type { FormSubmitEvent } from '@nuxt/ui'
import { productImageUploadSchema } from '@next-orders/core/shared/services/product'

const { isOpened, productId } = defineProps<{
  isOpened: boolean
  productId: string
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()
const { refresh: refreshProducts } = await useProduct()

const state = ref<Partial<ProductImageUploadSchema>>({
  file: undefined,
})

function resetState() {
  state.value = {
    file: undefined,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<ProductImageUploadSchema>) {
  const formData = new FormData()
  formData.append('file', event.data.file)

  const { data, error } = await useAsyncData(
    'upload-product-image',
    () => $fetch(`/api/product/${productId}/image`, {
      method: 'POST',
      body: formData,
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
    toast.add({ title: t('toast.photo-loaded'), description: t('toast.updating-data') })
    resetState()
  }
}
</script>
