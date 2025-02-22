<template>
  <form class="space-y-4" @submit="onSubmit">
    <div v-for="day in channel.workingDays" :key="day.id">
      <div class="grid grid-cols-2 gap-4">
        <UFormField :label="`${getLocalizedDayOfWeek(day.day)}, ${$t('common.time-from')}`" :name="`${day.day}.open`">
          <UInput
            v-model="workingDays[day.day as WorkingDay['day']].open"
            type="time"
            size="xl"
            class="w-full items-center justify-center"
          />
        </UFormField>

        <UFormField :label="$t('common.time-to')" :name="`${day.day}.close`">
          <UInput
            v-model="workingDays[day.day as WorkingDay['day']].close"
            type="time"
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
  </form>
</template>

<script setup lang="ts">
defineProps<{
  isOpened: boolean
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const

const workingDays = reactive(prepareWorkingDays())

function prepareWorkingDays() {
  const preparedDays = {
    MONDAY: { open: '', close: '' },
    TUESDAY: { open: '', close: '' },
    WEDNESDAY: { open: '', close: '' },
    THURSDAY: { open: '', close: '' },
    FRIDAY: { open: '', close: '' },
    SATURDAY: { open: '', close: '' },
    SUNDAY: { open: '', close: '' },
  }

  for (const day of days) {
    const dayData = channel.workingDays.find((d) => d.day === day)
    preparedDays[day] = {
      open: `${dayData?.openHours.toString().padStart(2, '0')}:${dayData?.openMinutes.toString().padStart(2, '0')}`,
      close: `${dayData?.closeHours.toString().padStart(2, '0')}:${dayData?.closeMinutes.toString().padStart(2, '0')}`,
    }
  }

  return preparedDays
}

async function onSubmit() {
  emit('submitted')

  // add to all open and close ':00' at the end of workingDays object for future zod time() validation
  const workingDaysCopy = JSON.parse(JSON.stringify(workingDays)) as typeof workingDays

  Object.values(workingDaysCopy).forEach((day) => {
    day.open += ':00'
    day.close += ':00'
  })

  const { data, error } = await useAsyncData(
    'update-working-days',
    () => $fetch('/api/channel/working-day', {
      method: 'PATCH',
      body: workingDaysCopy,
    }),
  )

  if (error.value) {
    console.error(error.value)
    toast.add({ title: t('error.title'), description: '...' })
  }

  if (data.value) {
    await channel.update()
    emit('success')
    toast.add({ title: t('toast.opening-hours-updated'), description: t('toast.updating-data') })
  }
}
</script>
