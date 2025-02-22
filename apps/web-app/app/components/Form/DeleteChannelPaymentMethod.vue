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
const { paymentMethodId } = defineProps<{
  isOpened: boolean
  paymentMethodId: string
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

async function onSubmit() {
  const { data, error } = await useAsyncData(
    'delete-payment-method',
    () => $fetch(`/api/channel/payment-method/${paymentMethodId}`, {
      method: 'DELETE',
    }),
  )

  if (error.value) {
    console.error(error.value)
    toast.add({ title: t('error.title'), description: '...' })
  }

  if (data.value) {
    await channel.update()
    emit('success')
    toast.add({ title: t('toast.payment-method-deleted'), description: t('toast.updating-data') })
  }
}
</script>
