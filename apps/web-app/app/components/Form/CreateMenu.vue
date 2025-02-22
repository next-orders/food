<template>
  <UForm
    :schema="menuCreateSchema"
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
      {{ $t('center.create.title') }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { MenuCreateSchema } from '@next-orders/core/shared/services/menu'
import type { FormSubmitEvent } from '@nuxt/ui'
import { menuCreateSchema } from '@next-orders/core/shared/services/menu'

const { isOpened } = defineProps<{
  isOpened: boolean
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

const state = ref<Partial<MenuCreateSchema>>({
  name: undefined,
})

function resetState() {
  state.value = {
    name: undefined,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<MenuCreateSchema>) {
  const { data, error } = await useAsyncData(
    'create-menu',
    () => $fetch('/api/menu', {
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
    toast.add({ title: t('toast.menu-created'), description: t('toast.updating-data') })
    resetState()
  }
}
</script>
