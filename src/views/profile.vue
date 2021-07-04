<template>
  <div
    class="flex justify-start items-start flex-col h-full w-full overflow-hidden"
  >
    <div
      :class="{ 'h-screen': becomingHost }"
      class="h-48 -mt-10 w-full flex justify-start items-start bg-gradient-to-bl from-yellow-300 to-yellow-400 z-0 transition-all duration-500"
    >
      <div
        class="overflow-hidden h-48 w-9/12 bg-gradient-to-bl from-red-300 to-red-400 flex justify-start items-start rounded-br-4xl flex-row flex-nowrap pt-10"
      >
        <div
          class="h-full w-full px-24 flex-shrink-0 flex justify-start items-center flex-row flex-nowrap"
        >
          <div class="flex justify-center items-center h-full flex-shrink-0">
            <img
              :src="userInfo.img"
              alt="Avatar"
              class="rounded-full flex-shrink-0 w-full"
            />
          </div>
          <div
            class="pl-4 flex flex-col justify-center items-start h-full w-full"
          >
            <div class="flex justify-start items-start w-full pr-24">
              <h1
                class="text-4xl font-bold whitespace-nowrap max-w-full truncate"
              >
                {{ userInfo?.userName }}
              </h1>
              <h4
                class="ml-2 px-1 py-px text-xs bg-yellow-300 rounded-md font-semibold select-none"
              >
                {{ tags[userInfo?.priv] }}
              </h4>
            </div>
            <h1 class="text-2xl font-semibold max-w-full truncate">
              {{ userInfo?.email }}
            </h1>
            <!-- <h1 class="text-4xl font-bold">{{ userInfo?.userName }}</h1> -->
          </div>
        </div>
      </div>
      <div class="w-3/12 px-24 pt-10 h-48 flex justify-start items-center">
        <div class="w-full flex justify-center items-center space-x-4">
          <div
            class="bg-gray-100 py-3 px-4 rounded-2xl cursor-pointer shadow-xl btnTransform btnRing"
            tabindex="-1"
          >
            <h1 class="text-xl font-semibold">Edit</h1>
          </div>
          <div
            @click="becomingHost = !becomingHost"
            class="bg-gray-100 py-3 px-4 rounded-2xl text-xl font-semibold cursor-pointer shadow-xl btnTransform btnRing"
            tabindex="-1"
          >
            <h1 class="text-xl font-semibold">Become a host</h1>
          </div>
        </div>
      </div>
    </div>
    <transition name="squash-y" appear>
      <div
        v-if="becomingHost"
        class="w-full h-full z-0 pt-48 absolute transform transition-all duration-500 overflow-hidden pointer-events-none"
      >
        <div
          class="relative w-full h-full flex items-center justify-start flex-col pointer-events-auto"
        >
          <!-- <div class="w-4 h-4 bg-gray-200 shadow-lg"></div> -->
          <p class="font-semibold text-6xl w-5/12 text-center pb-24 z-20 flex-shrink-0">
            Fill out the info bellow to become a
            <span class="text-red-400 font-bold">Host</span>
          </p>
          <div
            class="w-4/12 flex items-center justify-center flex-col space-y-12 z-20 flex-shrink-0"
          >
            <base-input name="University" size="4" />
            <base-input name="Phone" size="4" />
          </div>
          <div
            class="w-36 h-12  rounded-2xl flex justify-center items-center cursor-pointer btnRing mt-10 group relative z-0 flex-shrink-0"
            tabindex="-1"
          >
            <div
              class="w-full h-full rounded-2xl bg-red-100 z-20 absolute"
            ></div>
            <div
              class="w-full h-full rounded-full group-hover:h-screen group-hover:w-screen group-hover:rounded-none bg-gray-50 absolute transition-all duration-300 pointer-events-none z-0"
            ></div>
            <h1
              class="text-2xl font-bold mb-1 transition duration-300 transform z-30"
            >
              Apply
            </h1>
          </div>
          <p class="font-semibold text-base w-4/12 text-center px-4 py-3 z-20 rounded-3xl bg-gray-100 shadow-lg mt-6 flex-shrink-0">
            [Warn] Going through Host submitions is handled via a manual process, please allow some time before being able to post your webinars
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getUser } from "../js/firebaseActions.js";
import BaseInput from "../components/BaseInput";

export default {
  name: "profile",
  props: ["uid"],
  data() {
    return {
      userInfo: {},
      tags: ["user", "host", "admin"],
      colors: ["yellow", "green?", "white"],
      becomingHost: false
    };
  },
  computed: {
    tag() {
      return this.userInfo?.p ? this.tags[this.userInfo.priv] : "";
    }
  },
  async created() {
    this.$nextTick(async () => {
      this.userInfo = await getUser(this.uid);
    });
  },
  components: {
    BaseInput
  }
};
</script>

<style></style>
