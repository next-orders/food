<template>
  <UModal :title="$t('center.create.menu')">
    <template #body>
      <FormCreateMenu :is-opened="modal.isOpen.value" @success="modal.close()" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const modal = useModal()
</script>
