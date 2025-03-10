<template>
  <Navigation>
    <div>
      <div class="mb-6">
        <NuxtLink
          href="/"
          class="font-medium text-xl"
        >
          {{ getLocaleValue({ values: channel.name, locale, defaultLocale: channel.defaultLocale }) }}
        </NuxtLink>
        <div class="mt-1 text-sm leading-tight">
          {{ getLocaleValue({ values: channel.description, locale, defaultLocale: channel.defaultLocale }) }}
        </div>

        <div v-if="channel.phone" class="mt-4 text-lg leading-tight">
          {{ channel.phone }}
        </div>
      </div>

      <div v-if="checkout" class="mb-8">
        <DeliveryInfoBlock />

        <button
          class="flex flex-row gap-2 items-center active:scale-95 lg:hover:scale-95 lg:active:scale-90 duration-200"
          @click="modalDeliveryInfo.open()"
        >
          <Icon :name="icons.link" /> {{ $t('app.show-details-label') }}
        </button>
      </div>

      <div class="mb-32">
        <p class="font-medium text-lg">
          {{ $t('app.catalog') }}
        </p>

        <ULink
          v-for="category in channel.activeCategories"
          :key="category.id"
          :to="`/catalog/${category.slug}`"
          :active="$route.path.startsWith(`/catalog/${category.slug}`)"
          class="text-base font-normal flex flex-row items-center gap-4 w-full h-12 px-3 rounded-2xl lg:hover:bg-(--ui-bg-accented) duration-200"
          :class="{ 'bg-(--ui-bg-accented) font-medium': $route.path.startsWith(`/catalog/${category.slug}`) }"
        >
          {{ getLocaleValue({ values: category.name, locale, defaultLocale: channel.defaultLocale }) }}
        </ULink>
      </div>
    </div>

    <div class="mb-6 flex flex-col gap-2">
      <div class="flex flex-row gap-2">
        <ColorModeToggle />
      </div>
    </div>
  </Navigation>
</template>

<script setup lang="ts">
import { ModalDeliveryInfo } from '#components'

const { locale } = useI18n()
const { icons } = useAppConfig()
const channel = useChannelStore()
const checkout = useCheckoutStore()
const overlay = useOverlay()
const modalDeliveryInfo = overlay.create(ModalDeliveryInfo)
</script>
