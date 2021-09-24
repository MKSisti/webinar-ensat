<template>
  <div
    :class="{ 'animate-pulse': loading }"
    class="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 xl:rounded-6xl xl:w-10/12 2xl:w-4/6 w-full rounded-none overflow-hidden relative select-none aspect-w-2 aspect-h-1 xl:aspect-w-3 2xl:aspect-w-4 shadow-xl"
    @mouseenter="stopInterval"
    @mouseleave="startInterval"
  >
    <div class="w-full h-full z-40 pointer-events-none flex justify-center items-start absolute space-x-3 px-4 py-4">
      <span
        v-for="n in posts.length"
        :key="n"
        class="h-2 w-2 rounded-full bg-gray-100 dark:bg-gray-900 opacity-50 transition duration-300"
        :class="{ 'opacity-100': current == n - 1 }"
      />
    </div>
    <!-- controls -->
    <div class="w-full h-full z-40 pointer-events-none flex justify-between items-center absolute">
      <div
        class="w-2/12 h-full flex justify-start items-center px-4 font-bold pointer-events-auto group cursor-pointer"
        @click="goToPrev()"
      >
        <span
          class="h-6 w-6 md:h-8 md:w-8 bg-gray-100 dark:bg-gray-900 shadow-lg flex items-center justify-center rounded-lg transform opacity-50 group-hover:translate-x-2 group-hover:scale-125 group-hover:opacity-100 transition duration-300"
        ><i
          class="ri-arrow-left-s-line mr-px text-sm mg:text-lg"
          aria-hidden="true"
        />
        </span>
      </div>
      <div
        class="w-2/12 h-full flex justify-end items-center px-4 font-bold pointer-events-auto group cursor-pointer"
        @click="goToNext()"
      >
        <span
          class="h-6 w-6 md:h-8 md:w-8 bg-gray-100 dark:bg-gray-900 shadow-lg flex items-center justify-center rounded-lg transform opacity-50 group-hover:-translate-x-2 group-hover:scale-125 group-hover:opacity-100 transition duration-300"
        ><i
          class="ri-arrow-right-s-line ml-px text-sm mg:text-lg"
          aria-hidden="true"
        /></span>
      </div>
    </div>

    <!-- slide container -->
    <transition
      :name=" dir > 0 ? 'fade-left' : 'fade-right'"
      mode="in-out"
      appear
    >
      <div
        :key="posts[current]?.pid"
        :style="currentImg"
        class="w-full h-full bg-cover absolute bg-center transform scale-105 transition duration-300 bg-no-repeat"
      />
    </transition>
    <div class="w-full h-full flex justify-center items-center">
      <div
        class="h-12 md:h-16 left-0 bottom-0 absolute w-full group cursor-pointer focus:h-16 md:focus:h-20 transition-all duration-300"
        tabindex="0"
      >
        <!-- bottom fade to white -->
        <div
          :class="{ 'animate-pulse': loading }"
          class="absolute left-0 bottom-0 w-full h-full bg-gray-50 dark:bg-gray-900 pointer-events-none opacity-40 group-focus:opacity-90 transition duration-300"
        />

        <!-- bottom user/article info -->
        <transition
          name="fade-y"
          mode="out-in"
          appear
        >
          <div
            v-if="!loading"
            :key="posts[current]?.pid + 'info'"
            class="absolute left-0 transition duration-300 bottom-0 w-full h-full px-2 xl:px-8 flex justify-start items-center z-50 opacity-80 group-focus:opacity-100"
          >
            <span class="rounded-full bg-red-400 h-12 w-12 md:h-16 md:w-16 transform scale-75 group-focus:scale-100 transition duration-300 flex-none overflow-hidden">
              <img
                :src="user?.img"
                alt=""
              >
            </span>
            <div class="flex flex-col justify-center items-start pl-4 w-full group-focus:pointer-events-auto pointer-events-none">
              <h1
                :key="posts[current]?.title + 'title'"
                class="font-bold opacity-100 cursor-pointer hover:underline text-xl md:text-2xl truncate w-8/12 transition duration-300 transform translate-y-3 -translate-x-3 group-focus:translate-y-0 group-focus:translate-x-0 z-50"
                @click="goToPost(posts[current]?.pid)"
              >
                {{ posts[current]?.title }}
              </h1>
              <h2
                :key="user?.uid + 'user'"
                class="capitalize hover:underline cursor-pointer text-base md:text-lg transition duration-300 opacity-0 group-focus:opacity-100 z-20"
                @click="goToUser(user?.uid)"
              >
                {{ user?.userName }}
              </h2>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Carousel',
    props: {
      loop: Boolean,
      posts: Array,
      users: Map,
      posters: Object,
      loading: Boolean,
    },
    data() {
      return {
        current: 0,
        dir: 1
      };
    },
    computed: {
      currentImg() {
        return `background-image: url(${this.posters[this.posts[this.current]?.pid]||"/img/icons/errorCover.jpg"})`;
      },
      user() {
        return this.users?.get(this.posts[this.current]?.owner);
      },
    },
    mounted() {
      this.startInterval();
    },
    methods: {
      goToPost(pid) {
        this.$router.push({
          name: 'post',
          params: { pid },
        });
      },
      goToUser(uid) {
        this.$router.push({
          name: 'profile',
          params: { uid },
        });
      },
      goToNext() {
        this.dir = 1;
        this.current = (this.current + 1) % this.posts.length;
      },
      goToPrev() {
        this.dir = -1;
        this.current = (this.current - 1 + this.posts.length) % this.posts.length;
      },
      stopInterval() {
        if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      },
      startInterval() {
        this.stopInterval();
        this.autoPlayInterval = setInterval(this.goToNext, 6000);
      },
    }
  };
</script>

<style>

  .fade-left-enter-from {
    transform: translateX(20px) scale(105%);
    opacity: 0;
  }

  .fade-left-leave-to {
    transform: translateX(-20px) scale(105%);
    /* opacity: 0; */
  }

  .fade-right-enter-from {
    transform: translateX(-20px) scale(105%);
    opacity: 0;
  }

  .fade-right-leave-to {
    transform: translateX(20px) scale(105%);
    /* opacity: 0; */
  }

</style>
