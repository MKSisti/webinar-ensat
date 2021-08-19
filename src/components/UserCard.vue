<template>
  <div :class="{ userCardMin: minimal || userInfo.priv < 1 }" class="h-36 w-full">
    <div class="w-full h-full relative shadow-2xl overflow-hidden rounded-3xl">
      <div v-if="editable" class="absolute top-0 right-0 z-50 group cursor-pointer">
        <div
          class="relative w-12 h-7 group-hover:w-20 bg-gray-200 hover:bg-red-200 rounded-bl-3xl transition-all duration-300 flex items-center justify-start px-2"
        >
          <i class="fa fa-edit flex justify-center items-center w-8 h-8 flex-shrink-0" aria-hidden="true"></i>
          <h1 class="opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-0 translate-x-4 h-full mt-px font-semibold">
            Edit
          </h1>
        </div>
      </div>

      <div class="mainInfo w-full h-28 bg-gray-100 z-10 absolute flex justify-start items-center rounded-3xl shadow-sm">
        <div class="h-full flex justify-center items-center px-4">
          <img :class="{'animate-pulse bg-red-200': loadingImg}" @load="loadingImg = false" :src="userInfo.img" alt="avatar" class="rounded-full w-full" />
        </div>
        <div class="flex justify-center items-start flex-col">
          <h1 class="text-3xl font-bold flex justify-start items-start">
            {{ userInfo.userName }}
            <h4 v-if="tag != ''" :class="color" class="text-xs ml-1 px-1 py-px rounded-md font-semibold">
              {{ tag }}
            </h4>
          </h1>
          <h2 class="text-xl font-semibold">{{ userInfo.email }}</h2>
        </div>
      </div>
      <div v-if="!minimal" class="secondaryInfo w-full h-36 pt-28 bg-gray-200 absolute z-0">
        <div class="w-full flex justify-around items-center py-1">
          <h3 class="font-semibold max-w-full truncate flex-shrink-0 text-base">
            {{ getAbbreviation('ecole national des science applique tanger') }}
          </h3>
          <h3 class="max-w-full truncate flex-shrink-0 text-base font-normal">
            +(212)655554244
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
        loadingImg:true,
      };
    },
    computed: {
      tag() {
        return this.tags[this.userInfo.priv] || '';
      },
      color() {
        return `bg-${this.colors[this.userInfo.priv]}-200` || '';
      },
    },
    methods: {
      getAbbreviation,
    }
  };
</script>

<style lang="scss" scoped>
  .userCardMin {
    @apply h-16;

    .mainInfo {
      @apply h-16;

      img {
        @apply h-14;
      }

      h1 {
        @apply text-xl;
      }

      h2 {
        @apply text-lg;
      }
    }
  }
</style>
