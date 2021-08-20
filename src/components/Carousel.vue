<template>
  <div
    @mouseenter="stopInterval"
    @mouseleave="startInterval"
    class="bg-gradient-to-br from-gray-100 to-gray-200 xl:rounded-6xl xl:w-10/12 2xl:w-4/6 w-full rounded-none overflow-hidden relative select-none aspect-w-2 aspect-h-1 xl:aspect-w-3 2xl:aspect-w-4 shadow-xl"
  >
    <div class="w-full h-full z-40 pointer-events-none flex justify-center items-start absolute space-x-3 px-4 py-4">
      <span
        class="h-2 w-2 rounded-full bg-gray-100 opacity-50 transition duration-300"
        :class="{ 'opacity-100': current == n - 1 }"
        :key="n"
        v-for="n in posts.length"
      >
      </span>
    </div>
    <!-- controls -->
    <div class="w-full h-full z-40 pointer-events-none flex justify-between items-center absolute">
      <div @click="goToPrev()" class="w-2/12 h-full flex justify-start items-center px-4 font-bold pointer-events-auto group cursor-pointer">
        <span
          class="h-8 w-8 bg-gray-100 shadow-lg flex items-center justify-center rounded-lg transform opacity-50 group-hover:translate-x-2 group-hover:scale-125 group-hover:opacity-100 transition duration-300"
          ><i class="fa fa-chevron-left mr-px" aria-hidden="true"></i>
        </span>
      </div>
      <div @click="goToNext()" class="w-2/12 h-full flex justify-end items-center px-4 font-bold pointer-events-auto group cursor-pointer">
        <span
          class="h-8 w-8 bg-gray-100 shadow-lg flex items-center justify-center rounded-lg transform opacity-50 group-hover:-translate-x-2 group-hover:scale-125 group-hover:opacity-100 transition duration-300"
          ><i class="fa fa-chevron-right ml-px" aria-hidden="true"></i
        ></span>
      </div>
    </div>

    <!-- slide container -->
    <transition name="fade" appear>
      <div :key="posts[current]?.pid"
        :style="currentImg"
       class="w-full h-full bg-cover absolute flex justify-center items-center bg-center transition duration-300 bg-no-repeat">
        <!-- <div class="w-full h-full absolute">
          <img :src="posters[this.current]" class="h-full w-auto" alt="" />
        </div> -->

        <div class="h-16 md:h-20 left-0 bottom-0 absolute w-full group hover:h-20 md:hover:h-28 transition-all duration-300">
          <!-- bottom fade to white -->
          <div class="absolute left-0 bottom-0 w-full h-full bg-gray-50 opacity-40 group-hover:opacity-90 transition duration-300"></div>

          <!-- bottom user/article info -->
          <div class="absolute left-0 bottom-0 w-full h-full px-2 md:px-8 flex justify-start items-center z-50 opacity-80 group-hover:opacity-100">
            <span
              class="rounded-full bg-yellow-400 h-16 w-16 md:h-20 md:w-20 pointer-events-auto transform scale-75 group-hover:scale-100 transition duration-300 flex-none overflow-hidden"
            >
              <img :src="user?.img" alt="" />
            </span>
            <div class="flex flex-col justify-center items-start pl-4 pointer-events-auto w-full">
              <h1
                :key="posts[current]?.title + 'title'"
                @click="goToPost(posts[current]?.pid)"
                class="font-bold opacity-100 cursor-pointer pb-1 hover:underline text-2xl md:text-3xl truncate w-8/12 transition duration-300 transform translate-y-3 -translate-x-3 group-hover:translate-y-0 group-hover:translate-x-0 z-50"
              >
                {{ posts[current]?.title }}
              </h1>
              <router-link @click.prevent.stop :to="'/profile/' + user?.uid">
                <h2
                  :key="user?.uid + 'user'"
                  class="capitalize hover:underline cursor-pointer text-xl md:text-2xl text-gray-900 transition duration-300 opacity-0 group-hover:opacity-100 z-20"
                >
                  {{ user?.userName }}
                </h2>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'Carousel',
    computed: {
      currentImg() {
        return `background-image: url(${this.posters[this.posts[this.current]?.pid]})`;
      },
      user() {
        return this.users?.get(this.posts[this.current].owner);
      },
    },
    data() {
      return {
        current: 0,
      };
    },
    methods: {
      goToPost(pid) {
        console.log('trying to show post');
        this.$router.push({
          name: 'post',
          params: {
            pid: pid,
          },
        });
      },
      goToNext() {
        this.current = (this.current + 1) % this.posts.length;
        // console.log(this.current);
      },
      goToPrev() {
        this.current = (this.current - 1 + this.posts.length) % this.posts.length;
        // console.log(this.current);
      },
      stopInterval() {
        if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      },
      startInterval() {
        this.stopInterval();
        this.autoPlayInterval = setInterval(this.goToNext, 6000);
      },
    },
    mounted() {
      this.startInterval();
    },
    props: {
      loop: Boolean,
      posts: Array,
      users: Map,
      posters: Object,
    },
  };
</script>

<style></style>
