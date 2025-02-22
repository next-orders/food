<template>
  <div class="min-w-60 px-4 py-3 bg-(--ui-bg-muted) rounded-xl">
    <USwitch
      size="xl"
      :label="isActive ? $t('center.menu.is-active') : $t('center.menu.is-not-active')"
      :default-value="isActive"
      @change="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
const { isActive, menuId } = defineProps<{
  isActive: boolean
  menuId: string
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

async function onSubmit() {
  const { data, error } = await useAsyncData(
    'update-menu-activity',
    () => $fetch(`/api/menu/${menuId}/activity`, {
      method: 'POST',
    }),
  )

  if (error.value) {
    console.error(error.value)
    toast.add({ title: t('error.title'), description: '...' })
  }

  if (data.value) {
    await channel.update()
    emit('success')
    toast.add({ title: t('toast.menu-updated'), description: t('toast.updating-data') })
  }
}
</script>
