<template>
  <NuxtLink :to="`/command-center/menu/${menuId}`">
    <div class="bg-(--ui-bg-muted) rounded-xl py-6 relative min-h-60 text-center flex flex-col items-center justify-center">
      <div v-if="menu?.isActive" class="absolute top-2 right-2 w-12 h-12 p-2 bg-neutral-50 dark:bg-neutral-600 rounded-full">
        <Icon :name="icons.monitorCheck" class="w-8 h-8 text-emerald-500 opacity-100" />
      </div>

      <Icon :name="icons.book" class="w-12 h-12 mb-2 text-neutral-300 dark:text-neutral-500" />

      <h3 class="text-xl font-semibold">
        {{ menu?.name }}
      </h3>

      <ul>
        <li v-for="category in menu?.categories" :key="category.id">
          {{ getLocaleValue({ values: category.name, locale, defaultLocale: channel.defaultLocale }) }} ({{ category.products?.length }})
        </li>
      </ul>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { menuId } = defineProps<{
  menuId: string
}>()

const { locale } = useI18n()
const { icons } = useAppConfig()
const channel = useChannelStore()
const menu = channel.getMenu(menuId)
</script>
