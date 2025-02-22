<template>
  <CatalogBreadcrumb :items="breadcrumbs" />

  <div class="mb-4 flex flex-col md:flex-row justify-between md:items-center gap-2">
    <h1 class="text-2xl md:text-3xl font-semibold">
      {{ menu?.name }}
    </h1>

    <div class="flex flex-col md:flex-row gap-4">
      <FormUpdateMenuActivity :menu-id="menu?.id ?? ''" :is-active="menu?.isActive ?? false" />

      <UButton
        size="xl"
        variant="gradient"
        class="w-full md:w-fit"
        @click="modal.open(ModalCreateMenuCategory, { menuId: menu?.id })"
      >
        {{ t('center.add.menu-category') }}
      </UButton>
    </div>
  </div>

  <div
    v-for="category in menu?.categories"
    :key="category.id"
    class="mb-8"
  >
    <div class="mb-4 pb-2 border-b border-(--ui-border) flex flex-row gap-3 items-center">
      <h2 class="text-xl lg:text-2xl">
        {{ category.name }}
      </h2>
      <Icon
        :name="icons.edit"
        class="w-5 h-5 text-neutral-500 cursor-pointer"
        @click="modal.open(ModalUpdateMenuCategory, { categoryId: category.id })"
      />
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
      <CommandCenterProductCard
        v-for="product in category.products"
        :key="product.id"
        :product-id="product.id"
      />
      <CommandCenterProductCreateCard
        @click="modal.open(ModalCreateProduct, { categoryId: category.id })"
      />
    </div>
  </div>

  <GuideMenu />
</template>

<script setup lang="ts">
import { ModalCreateMenuCategory, ModalCreateProduct, ModalUpdateMenuCategory } from '#components'

definePageMeta({
  layout: 'command-center',
  middleware: ['02-staff'],
})

const { params } = useRoute('command-center-menu-id')
const channel = useChannelStore()
const menu = channel.getMenu(params.id)
if (!menu) {
  throw createError({ statusCode: 404, statusMessage: 'Menu not found' })
}

const { t } = useI18n()
const { icons } = useAppConfig()
const modal = useModal()

const breadcrumbs = computed(() => [
  { label: t('common.website'), icon: 'food:home', to: '/' },
  {
    label: t('center.menu.title'),
    to: '/command-center/menu',
  },
  { label: t('center.menu.menu-page') },
])
</script>
