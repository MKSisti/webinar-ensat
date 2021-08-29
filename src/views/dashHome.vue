<template>
  <div class="w-full h-full flex justify-start items-start flex-col">
    <div class="px-4 py-3 bg-gray-100 shadow-md flex items-center justify-between rounded-2xl gap-4 font-semibold text-xl mx-auto mt-5">
      <h1 class="text-2xl font-bold select-none">
        Dashboard
      </h1>

      <router-link
        to="/adminUsers"
      >
        <div class="flex justify-center items-center">
          <div class="flex justify-center items-center space-x-2 transform transition duration-300 bg-gray-200 bg-opacity-70 rounded-xl">
            <div class="flex-grow-0 flex justify-start items-center overflow-hidden group duration-300 cursor-pointer px-3 py-1.5 relative flex-shrink-0">
              <i
                class="fa fa-file flex-shrink-0 flex items-center justify-center text-xl font-black transition transform duration-300 mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 transition-all delay-300 group-hover:delay-0 transform group-hover:w-32 w-0 overflow-hidden whitespace-nowrap duration-300 group-hover:pl-3 opacity-0 group-hover:opacity-100">
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
          <div class="flex justify-center items-center space-x-2 transform transition duration-300 bg-gray-200 bg-opacity-70 rounded-xl">
            <div class="flex-grow-0 flex justify-start items-center overflow-hidden group duration-300 cursor-pointer px-3 py-1.5 relative flex-shrink-0">
              <i
                class="fa fa-file flex-shrink-0 flex items-center justify-center text-xl font-black transition transform duration-300 mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 transition-all delay-300 group-hover:delay-0 transform group-hover:w-32 w-0 overflow-hidden whitespace-nowrap duration-300 group-hover:pl-3 opacity-0 group-hover:opacity-100">
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
          <div class="flex justify-center items-center space-x-2 transform transition duration-300 bg-gray-200 bg-opacity-70 rounded-xl">
            <div class="flex-grow-0 flex justify-start items-center overflow-hidden group duration-300 cursor-pointer px-3 py-1.5 relative flex-shrink-0">
              <i
                class="fa fa-file flex-shrink-0 flex items-center justify-center text-xl font-black transition transform duration-300 mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 transition-all delay-300 group-hover:delay-0 transform group-hover:w-32 w-0 overflow-hidden whitespace-nowrap duration-300 group-hover:pl-2 opacity-0 group-hover:opacity-100">
                User privileges
              </h1>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div class="w-full h-full relative">
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
