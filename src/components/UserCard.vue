<template>
  <div
    :class="{ userCardMin: minimal || userInfo.priv < 1 }"
    class="h-28 sm:h-32 w-full"
  >
    <div class="w-full h-full relative shadow-xl overflow-hidden rounded-3xl">
      <!-- <div
        v-if="editable"
        class="absolute top-0 right-0 z-50 group cursor-pointer"
      >
        <div class="relative w-12 h-7 group-hover:w-20 bg-gray-200 dark:bg-gray-800 hover:bg-red-200 rounded-bl-3xl transition-all duration-300 flex items-center justify-start px-2">
          <i
            class="fa fa-edit flex justify-center items-center w-8 h-8 flex-shrink-0"
            aria-hidden="true"
          />
          <h1 class="opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-0 translate-x-4 h-full mt-px font-semibold">
            Edit
          </h1>
        </div>
      </div> -->

      <div class="mainInfo w-full h-20 sm:h-24 bg-gray-100 dark:bg-gray-900 z-10 absolute flex justify-start items-center rounded-3xl shadow-sm">
        <div class="h-full flex justify-center items-center px-2 sm:px-4 flex-shrink-0">
          <img
            :class="{ 'animate-pulse bg-red-200': loadingImg}"
            :src="userInfo.img"
            alt="avatar"
            class="rounded-full  flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20"
            @load="loadingImg = false"
          >
        </div>
        <div class="flex justify-center items-start flex-col w-full -space-y-1">
          <div class="flex justify-start items-start w-full pr-24">
            <h1 class="text-xl sm:text-3xl font-bold truncate">
              {{ userInfo.userName }}
            </h1>
            <h4
              v-if="tag != ''"
              :class="color"
              class="text-xs ml-1 px-1 py-px rounded-md font-semibold truncate"
            >
              {{ tag }}
            </h4>
          </div>
          <h2 class="text-base sm:text-xl font-semibold w-full truncate pr-24">
            {{ userInfo.email }}
          </h2>
        </div>
      </div>
      <div
        v-if="!minimal && userInfo.priv > 0 "
        class="secondaryInfo w-full h-28 pt-20 sm:h-32 sm:pt-24 bg-gray-200 dark:bg-gray-800 absolute z-0"
      >
        <div class="w-full flex justify-around items-center py-1">
          <h3 class="font-semibold max-w-full truncate flex-shrink-0 text-base">
            {{ getAbbreviation(userInfo.uni) }}
          </h3>
          <h3 class="max-w-full truncate flex-shrink-0 text-base font-normal">
            {{ userInfo.number }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getAbbreviation } from '../utils';

  export default {
    name: 'UserCard',
    props: {
      userInfo: Object,
      editable: Boolean,
      minimal: Boolean,
    },
    data() {
      return {
        tags: ['User', 'Host', 'Admin'],
        colors: ['yellow', 'red', 'green'],
        loadingImg: true,
      };
    },
    computed: {
      tag() {
        return this.tags[this.userInfo.priv] || '';
      },
      color() {
        return `bg-${this.colors[this.userInfo.priv]}-200 dark:bg-${this.colors[this.userInfo.priv]}-600` || '';
      },
    },
    methods: {
      getAbbreviation,
    },
  };
</script>

<style lang="scss" scoped>
  .userCardMin {
    @apply h-16;
    
    
    .mainInfo {
      @apply h-16;

      img{
        @apply h-14 w-14;
      }

      h1{
        @apply text-lg sm:text-xl;
      }

      h2{
        @apply text-base sm:text-lg;
      }
    }
  }
</style>
