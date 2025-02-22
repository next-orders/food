<template>
  <USwitch
    size="xl"
    :label="getLocalizedDayOfWeek(day)"
    :default-value="isActive"
    @change="onSubmit"
  />
</template>

<script setup lang="ts">
const { isActive, day } = defineProps<{
  isActive: boolean
  day: WorkingDay['day']
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

async function onSubmit() {
  const { data, error } = await useAsyncData(
    'update-working-day-activity',
    () => $fetch('/api/channel/working-day/activity', {
      method: 'POST',
      body: { day },
    }),
  )

  if (error.value) {
    console.error(error.value)
    toast.add({ title: t('error.title'), description: '...' })
  }

  if (data.value) {
    await channel.update()
    emit('success')
    toast.add({ title: t('toast.working-day-updated'), description: t('toast.updating-data') })
  }
}
</script>
