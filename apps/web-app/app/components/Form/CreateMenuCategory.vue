<template>
  <UForm
    :schema="menuCategoryCreateSchema"
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
import type { MenuCategoryCreateSchema } from '@next-orders/core/shared/services/menu'
import type { FormSubmitEvent } from '@nuxt/ui'
import { menuCategoryCreateSchema } from '@next-orders/core/shared/services/menu'

const { isOpened, menuId } = defineProps<{
  isOpened: boolean
  menuId: string
}>()

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

const state = ref<Partial<MenuCategoryCreateSchema>>({
  name: undefined,
  menuId,
})

function resetState() {
  state.value = {
    name: undefined,
    menuId,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<MenuCategoryCreateSchema>) {
  const { data, error } = await useAsyncData(
    'create-menu-category',
    () => $fetch('/api/category', {
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
    toast.add({ title: t('toast.category-created'), description: t('toast.updating-data') })
    resetState()
  }
}
</script>
