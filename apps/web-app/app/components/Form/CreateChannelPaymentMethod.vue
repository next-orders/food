<template>
  <UForm
    :schema="channelPaymentMethodCreateSchema"
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

    <UFormField :label="$t('center.data.type')" name="type">
      <USelect
        v-model="state.type"
        :items="getLocalizedPaymentMethodTypesForSelect()"
        :placeholder="$t('common.select')"
        size="xl"
        class="w-full"
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
import type { ChannelPaymentMethodCreateSchema } from '@next-orders/core/shared/services/channel'
import type { FormSubmitEvent } from '@nuxt/ui'
import { channelPaymentMethodCreateSchema } from '@next-orders/core/shared/services/channel'

const { isOpened } = defineProps<{
  isOpened: boolean
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

const state = ref<Partial<ChannelPaymentMethodCreateSchema>>({
  name: undefined,
  type: undefined,
})

function resetState() {
  state.value = {
    name: undefined,
    type: undefined,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<ChannelPaymentMethodCreateSchema>) {
  const { data, error } = await useAsyncData(
    'create-payment-method',
    () => $fetch('/api/channel/payment-method', {
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
    toast.add({ title: t('toast.payment-method-created'), description: t('toast.updating-data') })
    resetState()
  }
}
</script>
