<template>
  <UForm
    :schema="channelUpdateSchema"
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

    <UFormField :label="$t('common.description')" name="description">
      <UTextarea
        v-model="state.description"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('center.data.phone')" name="phone">
      <UInput
        v-model="state.phone"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('center.data.currency')" name="currencyCode">
      <USelect
        v-model="state.currencyCode"
        :items="getLocalizedCurrencyCodesForSelect()"
        :placeholder="$t('common.select')"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField :label="$t('center.data.country')" name="countryCode">
      <USelect
        v-model="state.countryCode"
        :items="getLocalizedCountryCodesForSelect()"
        :placeholder="$t('common.select')"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField :label="$t('center.data.timezone')" name="timeZone">
      <USelect
        v-model="state.timeZone"
        :items="getLocalizedTimezonesForSelect()"
        :placeholder="$t('common.select')"
        size="xl"
        class="w-full"
      />
    </UFormField>

    <UFormField
      :label="`${$t('app.cart.delivery')} / ${$t('app.minimum-order-value')}, ${channel.currencySign}`"
      name="minAmountForDelivery"
    >
      <UInput
        v-model="state.minAmountForDelivery"
        type="number"
        :placeholder="$t('common.optional')"
        size="xl"
        class="w-full items-center justify-center"
      />
    </UFormField>

    <UFormField :label="$t('center.data.delivery-conditions')" name="conditions">
      <UTextarea
        v-model="state.conditions"
        :rows="10"
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
import type { ChannelUpdateSchema } from '@next-orders/core/shared/services/channel'
import type { FormSubmitEvent } from '@nuxt/ui'
import { channelUpdateSchema } from '@next-orders/core/shared/services/channel'

const { isOpened } = defineProps<{
  isOpened: boolean
}>()

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

const state = ref<Partial<ChannelUpdateSchema>>({
  name: channel.name,
  description: channel.description ?? undefined,
  conditions: channel.conditions ?? undefined,
  phone: channel.phone ?? undefined,
  countryCode: channel.countryCode,
  currencyCode: channel.currencyCode,
  timeZone: channel.timeZone,
  minAmountForDelivery: channel.minAmountForDelivery ?? undefined,
})

function resetState() {
  state.value = {
    name: channel.name,
    description: channel.description ?? undefined,
    conditions: channel.conditions ?? undefined,
    phone: channel.phone ?? undefined,
    countryCode: channel.countryCode,
    currencyCode: channel.currencyCode,
    timeZone: channel.timeZone,
    minAmountForDelivery: channel.minAmountForDelivery ?? undefined,
  }
}

watch(
  () => isOpened,
  () => {
    resetState()
  },
)

async function onSubmit(event: FormSubmitEvent<ChannelUpdateSchema>) {
  emit('submitted')

  const { data, error } = await useAsyncData(
    'update-channel',
    () => $fetch('/api/channel', {
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
    toast.add({ title: t('toast.website-updated'), description: t('toast.updating-data') })
    resetState()
  }
}
</script>
