<template>
  <UForm
    :schema="productVariantCreateSchema"
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
      {{ $t('center.create.title') }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { ProductVariantCreateSchema } from '@next-orders/core/shared/services/product'
import type { FormSubmitEvent } from '@nuxt/ui'
import { productVariantCreateSchema } from '@next-orders/core/shared/services/product'

const { isOpened, productId } = defineProps<{
  isOpened: boolean
  productId: string
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()
const { refresh: refreshProducts } = await useProduct()

const state = ref<Partial<ProductVariantCreateSchema>>({
  name: undefined,
  weightUnit: undefined,
  weightValue: undefined,
  gross: undefined,
  net: undefined,
  sku: undefined,
  calories: undefined,
  carbohydrate: undefined,
  protein: undefined,
  fat: undefined,
  productId,
})

function resetState() {
  state.value = {
    name: undefined,
    weightUnit: undefined,
    weightValue: undefined,
    gross: undefined,
    net: undefined,
    sku: undefined,
    calories: undefined,
    carbohydrate: undefined,
    protein: undefined,
    fat: undefined,
    productId,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<ProductVariantCreateSchema>) {
  const { data, error } = await useAsyncData(
    'create-product-variant',
    () => $fetch('/api/product/variant', {
      method: 'POST',
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
    toast.add({ title: t('toast.variant-created'), description: t('toast.updating-data') })
    resetState()
  }
}
</script>
