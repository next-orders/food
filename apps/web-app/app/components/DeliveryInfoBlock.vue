<template>
  <p class="font-medium text-lg mb-2">
    {{ title }}
  </p>
  <div class="flex flex-row gap-2 items-center mb-2">
    <Icon :name="icons.clock" /> {{ $t('app.cart.today-until') }} {{ todayUntil }}
  </div>
  <div class="mb-2">
    <div v-if="checkout?.deliveryMethod === 'DELIVERY' && channel.minAmountForDelivery" class="flex flex-row gap-2 items-center">
      <Icon :name="icons.delivery" />
      <div class="lowercase">
        {{ $t('app.cart.from') }} {{ channel.minAmountForDelivery }} <span class="text-sm">{{ channel.currencySign }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { icons } = useAppConfig()
const { t } = useI18n()

const channel = useChannelStore()
const checkout = useCheckoutStore()
const title = computed(() => checkout.deliveryMethod === 'DELIVERY' ? t('app.cart.delivery') : t('app.cart.pickup'))
const todayUntil = computed(() => channel.workingDay?.isActive ? channel.workingDay.close : undefined)
</script>
