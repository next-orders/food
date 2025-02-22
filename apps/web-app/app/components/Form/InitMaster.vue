<template>
  <div class="mb-4 flex flex-row gap-4 justify-center items-center">
    <NuxtImg
      src="/img/hot-drink.png"
      alt=""
      class="size-16"
    />

    <h2 class="text-lg leading-tight font-medium">
      {{ $t('init.admin-data') }}
    </h2>
  </div>

  <UForm
    :schema="userCreateSchema"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('common.login')" name="login">
      <UInput
        v-model="state.login"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('common.password')" name="password">
      <UInput
        v-model="state.password"
        :type="isPasswordVisible ? 'text' : 'password'"
        :ui="{ trailing: 'pe-2' }"
        size="xl"
        class="w-full items-center justify-center"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="md"
            :icon="isPasswordVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
            :aria-pressed="isPasswordVisible"
            aria-controls="password"
            @click="isPasswordVisible = !isPasswordVisible"
          />
        </template>
      </UInput>
    </UFormField>

    <UFormField
      :label="$t('app.checkout.your-name')"
      :hint="$t('common.optional')"
      name="name"
    >
      <UInput
        v-model="state.name"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UButton
      type="submit"
      variant="gradient"
      size="xl"
      class="mt-3 w-full justify-center items-center"
      :disabled="!isFormValid"
    >
      {{ $t('app.cart.next-label') }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { UserCreateSchema } from '@next-orders/core/shared/services/user'
import type { FormSubmitEvent } from '@nuxt/ui'
import { userCreateSchema } from '@next-orders/core/shared/services/user'

const emit = defineEmits(['success'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

const isPasswordVisible = ref(false)

const state = ref<Partial<UserCreateSchema>>({
  login: undefined,
  password: undefined,
  name: undefined,
})

const isFormValid = computed<boolean>(() => {
  return (
    !!state.value.login
    && !!state.value.password
  )
})

async function onSubmit(event: FormSubmitEvent<UserCreateSchema>) {
  const { data, error } = await useAsyncData(
    'create-channel-master',
    () => $fetch('/api/channel/master', {
      method: 'PUT',
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
    toast.add({ title: t('toast.account-configured'), description: t('toast.updating-data') })
  }
}
</script>
