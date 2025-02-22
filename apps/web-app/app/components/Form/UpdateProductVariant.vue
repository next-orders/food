<template>
  <UForm
    :schema="productVariantUpdateSchema"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('center.data.name')" name="name">
      <UInput
        v-model="state.name"
        :placeholder="$t('center.product.variant-name-placeholder')"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="`${$t('common.price')}, ${channel.currencySign}`" name="gross">
      <UInput
        v-model="state.gross"
        type="number"
        step="any"
        placeholder="0.00"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <div class="grid grid-cols-2 gap-2">
      <UFormField :label="$t('common.weight-or-volume')" name="weightValue">
        <UInput
          v-model="state.weightValue"
          type="number"
          step="any"
          size="xl"
          class="w-full items-center justify-center"
        />
      </UFormField>

      <UFormField :label="$t('common.measurement-unit')" name="weightUnit">
        <USelect
          v-model="state.weightUnit"
          :items="getLocalizedWeightUnitsForSelect()"
          :placeholder="$t('common.select')"
          size="xl"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField :label="$t('common.sku')" name="sku">
      <UInput
        v-model="state.sku"
        :placeholder="$t('common.optional')"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <div class="pt-4">
      <h3 class="font-semibold">
        {{ $t('common.optional') }}: {{ $t('common.nutrition.value-title') }}
      </h3>

      <div class="grid grid-cols-2 gap-2">
        <UFormField :label="`${$t('common.nutrition.calories')}, ${$t('common.nutrition.kcal')}`" name="calories">
          <UInput
            v-model="state.calories"
            type="number"
            step="any"
            size="xl"
            class="w-full items-center justify-center"
          />
        </UFormField>

        <UFormField :label="$t('common.nutrition.protein')" name="protein">
          <UInput
            v-model="state.protein"
            type="number"
            step="any"
            size="xl"
            class="w-full items-center justify-center"
          />
        </UFormField>

        <UFormField :label="$t('common.nutrition.fat')" name="fat">
          <UInput
            v-model="state.fat"
            type="number"
            step="any"
            size="xl"
            class="w-full items-center justify-center"
          />
        </UFormField>

        <UFormField :label="$t('common.nutrition.carbohydrate')" name="carbohydrate">
          <UInput
            v-model="state.carbohydrate"
            type="number"
            step="any"
            size="xl"
            class="w-full items-center justify-center"
          />
        </UFormField>
      </div>
    </div>

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
import type { ProductVariantUpdateSchema } from '@next-orders/core/shared/services/product'
import type { FormSubmitEvent } from '@nuxt/ui'
import { productVariantUpdateSchema } from '@next-orders/core/shared/services/product'

const { isOpened, productId, productVariantId } = defineProps<{
  isOpened: boolean
  productId: string
  productVariantId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()
const { refresh: refreshProducts, products } = await useProduct()

const product = computed(() => products.value?.find((product) => product.id === productId))
const productVariant = computed(() => product.value?.variants?.find((variant) => variant.id === productVariantId))

const state = ref<Partial<ProductVariantUpdateSchema>>({
  name: productVariant.value?.name,
  weightUnit: productVariant.value?.weightUnit as ProductVariantUpdateSchema['weightUnit'],
  weightValue: productVariant.value?.weightValue,
  gross: productVariant.value?.gross,
  net: productVariant.value?.net ?? undefined,
  sku: productVariant.value?.sku ?? undefined,
  calories: productVariant.value?.calories ?? undefined,
  carbohydrate: productVariant.value?.carbohydrate ?? undefined,
  protein: productVariant.value?.protein ?? undefined,
  fat: productVariant.value?.fat ?? undefined,
})

function resetState() {
  state.value = {
    name: productVariant.value?.name,
    weightUnit: productVariant.value?.weightUnit as ProductVariantUpdateSchema['weightUnit'],
    weightValue: productVariant.value?.weightValue,
    gross: productVariant.value?.gross,
    net: productVariant.value?.net ?? undefined,
    sku: productVariant.value?.sku ?? undefined,
    calories: productVariant.value?.calories ?? undefined,
    carbohydrate: productVariant.value?.carbohydrate ?? undefined,
    protein: productVariant.value?.protein ?? undefined,
    fat: productVariant.value?.fat ?? undefined,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<ProductVariantUpdateSchema>) {
  emit('submitted')

  const { data, error } = await useAsyncData(
    'update-product-variant',
    () => $fetch(`/api/product/variant/${productVariantId}`, {
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
    toast.add({ title: t('toast.variant-updated'), description: t('toast.updating-data') })
    resetState()
  }
}
</script>
