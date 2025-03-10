<template>
  <UModal :title="checkout?.deliveryMethod === 'DELIVERY' ? $t('app.cart.delivery-details') : $t('app.cart.pickup-details')" :ui="{ footer: 'justify-end' }">
    <template #body>
      <div class="font-sans whitespace-pre-wrap">
        {{ getLocaleValue({ values: channel.conditions, locale, defaultLocale: channel.defaultLocale }) }}
      </div>

      <div v-if="channel.minAmountForDelivery && checkout?.deliveryMethod === 'DELIVERY'">
        <h3 class="mt-8 mb-2 text-xl font-medium">
          {{ $t('common.more-information') }}
        </h3>

        <div class="mb-2 flex flex-row justify-between">
          <div>{{ $t('app.minimum-order-value') }}</div>
          <div>
            {{ channel.minAmountForDelivery }} <span class="text-sm">{{ channel.currencySign }}</span>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        variant="solid"
        size="lg"
        @click="closeAll"
      >
        {{ $t('common.ok') }}
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const channel = useChannelStore()
const checkout = useCheckoutStore()
const overlay = useOverlay()

function closeAll() {
  for (const o of overlay.overlays) {
    overlay.close(o.id)
  }
}
</script>
