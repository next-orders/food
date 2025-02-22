<template>
  <UForm
    :schema="productUpdateSchema"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('center.data.name')" name="name">
      <UInput
        v-model="state.name"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.description')" name="description">
      <UTextarea
        v-model="state.description"
        :rows="8"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.slug')" name="slug">
      <UInput
        v-model="state.slug"
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
      {{ $t('center.update.title') }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { ProductUpdateSchema } from '@next-orders/core/shared/services/product'
import type { FormSubmitEvent } from '@nuxt/ui'
import { productUpdateSchema } from '@next-orders/core/shared/services/product'

const { isOpened, productId } = defineProps<{
  isOpened: boolean
  productId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()
const { refresh: refreshProducts, products } = await useProduct()
const product = computed(() => products.value?.find((p) => p.id === productId))

const state = ref<Partial<ProductUpdateSchema>>({
  name: product.value?.name,
  description: product.value?.description,
  slug: product.value?.slug,
})

function resetState() {
  state.value = {
    name: product.value?.name,
    description: product.value?.description,
    slug: product.value?.slug,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<ProductUpdateSchema>) {
  emit('submitted')

  const { data, error } = await useAsyncData(
    'update-product',
    () => $fetch(`/api/product/${productId}`, {
      method: 'PATCH',
      body: event.data,
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
    resetState()
  }
}
</script>
