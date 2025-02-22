<template>
  <div class="bg-(--ui-bg-muted) relative min-h-28 text-center flex flex-col items-center justify-center">
    <Icon :name="icons.moneyCard" class="size-8 text-(--ui-text-dimmed)" />

    <h3 class="text-lg font-semibold leading-tight">
      {{ paymentMethod?.name }}
    </h3>

    <p class="text-sm text-(--ui-text-muted)">
      {{ paymentMethod?.type }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { paymentMethodId } = defineProps<{
  paymentMethodId: string
}>()

const { icons } = useAppConfig()
const channel = useChannelStore()
const paymentMethod = computed(() => channel.paymentMethods.find((p) => p.id === paymentMethodId))
</script>
