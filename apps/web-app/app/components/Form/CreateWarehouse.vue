<template>
  <UForm
    :schema="warehouseCreateSchema"
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
      {{ $t('center.create.title') }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { WarehouseCreateSchema } from '@next-orders/core/shared/services/warehouse'
import type { FormSubmitEvent } from '@nuxt/ui'
import { warehouseCreateSchema } from '@next-orders/core/shared/services/warehouse'

const { isOpened } = defineProps<{
  isOpened: boolean
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

const state = ref<Partial<WarehouseCreateSchema>>({
  name: undefined,
  address: undefined,
})

function resetState() {
  state.value = {
    name: undefined,
    address: undefined,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<WarehouseCreateSchema>) {
  const { data, error } = await useAsyncData(
    'create-warehouse',
    () => $fetch('/api/warehouse', {
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
    emit('success')
    toast.add({ title: t('toast.warehouse-created'), description: t('toast.updating-data') })
    resetState()
  }
}
</script>
