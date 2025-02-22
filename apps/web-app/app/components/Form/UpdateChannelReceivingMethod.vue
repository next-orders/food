<template>
  <USwitch
    size="xl"
    :label="method === 'DELIVERY' ? $t('app.cart.delivery') : $t('app.cart.pickup')"
    :default-value="isActive"
    @change="onSubmit"
  />
</template>

<script setup lang="ts">
const { isActive, method } = defineProps<{
  isActive: boolean
  method: 'DELIVERY' | 'PICKUP'
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

async function onSubmit() {
  const { data, error } = await useAsyncData(
    'update-channel-receiving-method',
    () => $fetch('/api/channel/receiving-method', {
      method: 'POST',
      body: { method },
    }),
  )

  if (error.value) {
    console.error(error.value)
    toast.add({ title: t('error.title'), description: '...' })
  }

  if (data.value) {
    await channel.update()
    emit('success')
    toast.add({ title: t('toast.receiving-method-updated'), description: t('toast.updating-data') })
  }
}
</script>
