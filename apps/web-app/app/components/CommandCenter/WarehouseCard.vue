<template>
  <div class="bg-(--ui-bg-muted) relative min-h-36 text-center flex flex-col items-center justify-center">
    <Icon :name="icons.house" class="size-12 mb-2 text-(--ui-text-dimmed)" />

    <h3 class="text-xl font-semibold">
      {{ warehouse?.name }}
    </h3>

    <div>{{ warehouse?.address }}</div>
  </div>
</template>

<script setup lang="ts">
const { warehouseId } = defineProps<{
  warehouseId: string
}>()

const { icons } = useAppConfig()
const channel = useChannelStore()
const warehouse = computed(() => channel.warehouses.find((w) => w.id === warehouseId))
</script>
