<template>
  <header class="z-20 h-16 bg-white dark:bg-neutral-600 fixed top-0 left-0 right-0">
    <CommandCenterHeader />
  </header>

  <CommandCenterNavigation />

  <main class="min-h-dvh relative w-auto top-16 lg:pl-72">
    <div class="min-h-[75vh] px-2 md:px-4 pb-10 pt-4">
      <slot />
    </div>
    <Footer />
  </main>
</template>
