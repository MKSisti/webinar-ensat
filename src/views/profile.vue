<template>
  <div class="h-80 bg-gradient-to-bl from-red-300 to-red-400 -mt-10 pt-10 px-8">
    <div class="flex justify-start items-start h-full">
      <div
        class="bg-gradient-to-br from-yellow-400 to-yellow-500 w-64 h-64 rounded-full mt-24"
      ></div>
      <div class="pl-4 flex flex-col justify-end items-start h-full pb-4">
          <div class="flex justify-start items-start">
              <h1 class="text-7xl font-bold">User</h1>
              <h4 class="ml-2 px-1 py-px text-xs bg-yellow-300 rounded-md font-semibold select-none">Verified</h4>
          </div>
          <h2 class="text-4xl font-semibold">Email@provider.com</h2>
          <h3 class="text-2xl">very famous university</h3>
      </div>
    </div>
  </div>
  <div class="w-full pt-8">
      <div class="w-full flex justify-end items-center px-8 space-x-4">
          <div class="bg-gray-100 py-3 px-4 rounded-2xl cursor-pointer shadow-xl btnTransform btnRing" tabindex="-1">
              <h1 class="text-xl font-semibold">Edit</h1>
          </div>
          <div class="bg-gray-100 py-3 px-4 rounded-2xl text-xl font-semibold cursor-pointer shadow-xl btnTransform btnRing" tabindex="-1">
              <h1 class="text-xl font-semibold">Become a host</h1>
          </div>
      </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
