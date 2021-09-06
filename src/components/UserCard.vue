<template>
  <div
    :class="{ userCardMin: minimal || userInfo.priv < 1 }"
    class="h-28 sm:h-32 w-full transition-all duration-300"
  >
    <div class="w-full h-full relative shadow-xl rounded-3xl">
      <transition
        name="fade-y"
        appear
      >
        <div
          v-if="(getUserInfo.uid != userInfo.uid) && getUserInfo.uid"
          :key="following(userInfo.uid)"
          class="absolute top-0 right-0 transform transition duration-300 -translate-y-2/3 z-50 group cursor-pointer select-none"
          @click.prevent.stop
        >
          <div
            class="relative mx-6 px-1 transition-all duration-300 flex items-center justify-start bg-gray-200 dark:bg-gray-800 shadow-sm gap-1 rounded-lg text-sm sm:text-base btnRing"
          >
            <i
              v-if="!following(userInfo.uid)"
              class="ri-user-follow-fill flex justify-center items-center flex-shrink-0"
              aria-hidden="true"
            />
            <i
              v-else
              class="ri-user-unfollow-fill flex justify-center items-center flex-shrink-0"
              aria-hidden="true"
            />
            <h3
              v-if="!following(userInfo.uid)"
              class="max-w-full truncate flex-shrink-0 cursor-pointer"
              @click="followUser"
            >
              Follow
            </h3>
            <h3
              v-else
              class="max-w-full truncate flex-shrink-0 cursor-pointer"
              @click="unfollowUser"
            >
              Unfollow
            </h3>
          </div>
        </div>
      </transition>
      

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
      <transition
        name="fade"
        appear
      >
        <div
          v-if="!minimal && userInfo.priv > 0 "
          class="secondaryInfo transform transition duration-300 w-full h-28 pt-20 sm:h-32 sm:pt-24 bg-gray-200 dark:bg-gray-800 absolute z-0 rounded-3xl"
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
      </transition>
    </div>
  </div>
</template>

<script>
  import { getAbbreviation } from '../utils';
  import { follow, unfollow } from '../js/dbActions';
  import { mapGetters, mapActions } from 'vuex';

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
        return `bg-${this.colors[this.userInfo.priv]}-500` || '';
      },
    },
    computed: {
      ...mapGetters('user', ['getUserInfo','following']),
    },
    methods: {
      ...mapActions('user', ['addFollow','removeFollow']),
      getAbbreviation,
      async followUser(){
        follow(this.getUserInfo.uid, this.getUserInfo.email, this.userInfo.uid, this.userInfo.email);
        this.addFollow( { uid : this.userInfo.uid, email : this.userInfo.email});
      },
      async unfollowUser(){
        this.removeFollow ( this.userInfo.uid );
        unfollow(this.getUserInfo.uid, this.userInfo.uid);
      }
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
