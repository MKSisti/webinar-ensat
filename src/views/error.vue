<template>
  <div class="w-full h-full flex justify-center items-center flex-col gap-5">
    <img
      style="max-width:192px;"
      src="/img/icons/icon_192x192.png"
      alt=""
      class="filter dark:invert"
    >
    <h1 class="text-8xl sm:text-9xl font-bold">
      Error
    </h1>
    <h4 class="text-lg sm:text-2xl text-red-400 max-w-full line-clamp-3 px-4 sm:px-12">
      {{ err }}
    </h4>
    <router-link :to="'/'">
      <div class="flex justify-center items-center">
        <div class="btnTransformSm transition-transform duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl w-44">
          <div class="w-full h-full flex justify-center items-center overflow-hidden cursor-pointer px-2 py-1.5 relative flex-shrink-0 gap-2">
            <h1 class="text-lg font-semibold">
              Go back to safety
            </h1>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props:['err']
}
</script>

<style>

</style>