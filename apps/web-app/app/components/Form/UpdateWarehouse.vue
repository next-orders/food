<template>
  <UForm
    :schema="warehouseUpdateSchema"
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

    <UFormField :label="$t('app.checkout.address.title')" name="address">
      <UInput
        v-model="state.address"
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
import type { WarehouseUpdateSchema } from '@next-orders/core/shared/services/warehouse'
import type { FormSubmitEvent } from '@nuxt/ui'
import { warehouseUpdateSchema } from '@next-orders/core/shared/services/warehouse'

const { isOpened, warehouseId } = defineProps<{
  isOpened: boolean
  warehouseId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()
const warehouse = computed(() => channel.warehouses.find((w) => w.id === warehouseId))

const state = ref<Partial<WarehouseUpdateSchema>>({
  name: warehouse.value?.name,
  address: warehouse.value?.address,
})

function resetState() {
  state.value = {
    name: warehouse.value?.name,
    address: warehouse.value?.address,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<WarehouseUpdateSchema>) {
  emit('submitted')

  const { data, error } = await useAsyncData(
    'update-warehouse',
    () => $fetch(`/api/warehouse/${warehouseId}`, {
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
    emit('success')
    toast.add({ title: t('toast.warehouse-updated'), description: t('toast.updating-data') })
    resetState()
  }
}
</script>
