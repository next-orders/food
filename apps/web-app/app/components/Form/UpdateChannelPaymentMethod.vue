<template>
  <UForm
    :schema="channelPaymentMethodUpdateSchema"
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
import type { ChannelPaymentMethodUpdateSchema } from '@next-orders/core/shared/services/channel'
import type { FormSubmitEvent } from '@nuxt/ui'
import { channelPaymentMethodUpdateSchema } from '@next-orders/core/shared/services/channel'

const { isOpened, paymentMethodId } = defineProps<{
  isOpened: boolean
  paymentMethodId: string
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()
const paymentMethod = computed(() => channel.paymentMethods.find((p) => p.id === paymentMethodId))

const state = ref<Partial<ChannelPaymentMethodUpdateSchema>>({
  name: paymentMethod.value?.name,
})

function resetState() {
  state.value = {
    name: paymentMethod.value?.name,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<ChannelPaymentMethodUpdateSchema>) {
  emit('submitted')

  const { data, error } = await useAsyncData(
    'update-payment-method',
    () => $fetch(`/api/channel/payment-method/${paymentMethodId}`, {
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
    toast.add({ title: t('toast.payment-method-updated'), description: t('toast.updating-data') })
    resetState()
  }
}
</script>
