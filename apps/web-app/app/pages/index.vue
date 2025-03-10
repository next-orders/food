<template>
  <CommandCenterStaffBar v-if="user?.isStaff" class="mb-4" />
  <MaintenanceMessage v-if="channel.isOnMaintenance" />

  <h1 class="mb-2 text-3xl md:text-4xl font-medium">
    {{ getLocaleValue({ values: channel.name, locale, defaultLocale: channel.defaultLocale }) }}
  </h1>
  <div class="mb-8">
    {{ getLocaleValue({ values: channel.description, locale, defaultLocale: channel.defaultLocale }) }}
  </div>

  <CategoryBlock
    v-for="category in channel.activeCategories"
    :key="category.id"
    :category-id="category.id"
    :is-first="channel.activeCategories.indexOf(category) === 0"
  />
</template>

<script setup lang="ts">
const { locale } = useI18n()
const { user } = useUserSession()
const channel = useChannelStore()

useHead({
  title: getLocaleValue({ values: channel.name, locale: locale.value, defaultLocale: channel.defaultLocale }),
  meta: [
    {
      name: 'description',
      content: getLocaleValue({ values: channel.description, locale: locale.value, defaultLocale: channel.defaultLocale }),
    },
  ],
})
</script>
