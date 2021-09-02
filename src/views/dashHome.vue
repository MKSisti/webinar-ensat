<template>
  <div class="w-full h-full flex justify-start items-start flex-col">
    <div class="px-4 py-3 bg-gray-100 dark:bg-gray-900 shadow-md flex-col md:flex-row flex items-start md:items-center justify-between rounded-2xl gap-4 font-semibold text-xl mx-auto mt-5 select-none">
      <h1 class="text-2xl font-bold">
        Dashboard
      </h1>

      <router-link
        to="/adminUsers"
      >
        <div class="flex justify-center items-center">
          <div class="btnTransformSm transform transition duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl w-44">
            <div class="w-full flex justify-around items-center overflow-hidden cursor-pointer px-2 py-1.5 relative flex-shrink-0 gap-2">
              <i
                class="ri-user-follow-fill font-thin flex-shrink-0 flex items-center justify-center text-xl mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 whitespace-nowrap duration-300">
                Host Requests
              </h1>
            </div>
          </div>
        </div>
      </router-link>

      <router-link
        to="/adminUsers/postsDash"
      >
        <div class="flex justify-center items-center">
          <div class="btnTransformSm transform transition duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl w-44">
            <div class="w-full flex justify-around items-center overflow-hidden cursor-pointer px-2 py-1.5 relative flex-shrink-0 gap-2">
              <i
                class="ri-file-settings-fill font-thin flex-shrink-0 flex items-center justify-center text-xl mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 whitespace-nowrap duration-300">
                Post Requests
              </h1>
            </div>
          </div>
        </div>
      </router-link>
      <router-link
        to="/adminUsers/changePriv"
      >
        <div class="flex justify-center items-center">
          <div class="btnTransformSm transform transition duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl w-44">
            <div class="w-full flex justify-around items-center overflow-hidden cursor-pointer px-2 py-1.5 relative flex-shrink-0 gap-2">
              <i
                class="ri-user-settings-fill font-thin flex-shrink-0 flex items-center justify-center text-xl mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 whitespace-nowrap duration-300">
                User information
              </h1>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div class="w-full h-full relative select-auto">
      <router-view
        v-slot="{ Component }"
        class="w-full max-h-full absolute"
      >
        <transition
          name="fade-y"
          appear
          mode="out-in"
        >
          <component
            :is="Component"
            class="w-full max-h-full transition duration-300"
          />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DashBoard',
  };
</script>

<style></style>
