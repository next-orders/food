<template>
  <UForm
    :schema="channelUpdateSchema"
    :state="state"
    class="flex flex-col gap-3"
    @submit="onSubmit"
  >
    <UFormField :label="$t('center.data.name')" name="name">
      <UButtonGroup class="w-full">
        <UDropdownMenu :items="localeState.items">
          <UButton
            color="neutral"
            variant="outline"
            :icon="localeState.icon.value"
            class="w-12 items-center justify-center"
          />
        </UDropdownMenu>

        <UInput
          v-model="state.name"
          :placeholder="defaultName"
          size="xl"
          class="grow"
        />
      </UButtonGroup>
    </UFormField>

    <UFormField :label="$t('common.description')" name="description">
      <UTextarea
        v-model="state.description"
        :placeholder="defaultDescription"
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

    <UFormField :label="$t('common.language')" name="defaultLocale">
      <USelect
        v-model="state.defaultLocale"
        :items="getLocalizedLanguageCodesForSelect()"
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
        :placeholder="defaultConditions"
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
      block
      class="mt-3"
    >
      {{ $t('center.update.title') }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { ChannelUpdateSchema } from '@next-orders/core/shared/services/channel'
import type { FormSubmitEvent } from '@nuxt/ui'
import { channelUpdateSchema } from '@next-orders/core/shared/services/channel'
import { getLocalizedCountryCodesForSelect } from '../../utils/helpers'

const emit = defineEmits(['success', 'submitted'])

const { t } = useI18n()
const toast = useToast()
const channel = useChannelStore()

const localeState = useLocalizedState(resetState)

const defaultName = channel.name.find((name) => name.locale === channel.defaultLocale)?.value
const defaultDescription = channel.description.find((description) => description.locale === channel.defaultLocale)?.value
const defaultConditions = channel.conditions.find((condition) => condition.locale === channel.defaultLocale)?.value

const state = ref<Partial<ChannelUpdateSchema>>({
  locale: localeState.locale.value,
  name: channel.name.find((name) => name.locale === localeState.locale.value)?.value,
  description: channel.description.find((description) => description.locale === localeState.locale.value)?.value,
  conditions: channel.conditions.find((condition) => condition.locale === localeState.locale.value)?.value,
  phone: channel.phone ?? undefined,
  countryCode: channel.countryCode,
  currencyCode: channel.currencyCode,
  defaultLocale: channel.defaultLocale,
  timeZone: channel.timeZone,
  minAmountForDelivery: channel.minAmountForDelivery ?? undefined,
})

function resetState() {
  state.value = {
    locale: localeState.locale.value,
    name: channel.name.find((name) => name.locale === localeState.locale.value)?.value,
    description: channel.description.find((description) => description.locale === localeState.locale.value)?.value,
    conditions: channel.conditions.find((condition) => condition.locale === localeState.locale.value)?.value,
    phone: channel.phone ?? undefined,
    countryCode: channel.countryCode,
    currencyCode: channel.currencyCode,
    defaultLocale: channel.defaultLocale,
    timeZone: channel.timeZone,
    minAmountForDelivery: channel.minAmountForDelivery ?? undefined,
  }
}

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
