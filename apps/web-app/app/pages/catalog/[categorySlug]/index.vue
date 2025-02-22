<template>
  <CatalogBreadcrumb :items="breadcrumbs" />

  <h1 class="text-3xl font-medium">
    {{ category.name }}
  </h1>
  <div>{{ $t('app.category-page-description') }}</div>

  <div class="mt-4 max-w-7xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
    <ProductCard
      v-for="product in category.products"
      :key="product.id"
      :product-id="product.id"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { params } = useRoute('catalog-categorySlug')
const channel = useChannelStore()

const category = channel.getActiveMenuCategoryBySlug(params.categorySlug)
if (!category) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Category not found',
  })
}

useHead({
  title: category.name,
})

const breadcrumbs = computed(() => [
  { label: t('common.home'), icon: 'food:home', to: '/' },
  { label: category.name },
])
</script>
