<template>
  <div class="w-full flex justify-start items-start bg-yellow-300 -mt-10 pt-10">
    <div
      class="h-44 w-1/2 bg-gradient-to-bl from-red-300 to-red-400 -mt-10 pt-10 px-24 rounded-br-6xl flex-none"
    >
      <div class="flex justify-start items-start h-full">
        <div class="flex justify-center items-center h-full rounded-full ">
          <img :src="userInfo.img" alt="Avatar" class="rounded-full w-full" />
        </div>
        <div class="pl-4 flex flex-col justify-end items-start h-full pb-4 w-full">
          <div class="flex justify-start items-start w-full">
            <h1 class="text-4xl font-bold truncate max-w-full">{{ userInfo?.userName }}</h1>
            <h4
              class="ml-2 px-1 py-px text-xs bg-yellow-300 rounded-md font-semibold select-none"
            >
              Verified
            </h4>
          </div>
          <h2 class="text-2xl font-semibold">{{ userInfo.email }}</h2>
          <h3 class="text-xl">very famous university</h3>
        </div>
      </div>
    </div>
    <div class="w-full pt-8">
    <div class="w-full flex justify-end items-center px-8 space-x-4">
      <div
        class="bg-gray-100 py-3 px-4 rounded-2xl cursor-pointer shadow-xl btnTransform btnRing"
        tabindex="-1"
      >
        <h1 class="text-xl font-semibold">Edit</h1>
      </div>
      <div
        class="bg-gray-100 py-3 px-4 rounded-2xl text-xl font-semibold cursor-pointer shadow-xl btnTransform btnRing"
        tabindex="-1"
      >
        <h1 class="text-xl font-semibold">Become a host</h1>
      </div>
    </div>
  </div>
  </div>
  
</template>

<script>
import { getUser } from "../js/firebaseActions.js";

export default {
  name: "profile",
  props: ["uid"],
  data() {
    return {
      userInfo: {}
    };
  },
  async created() {
    this.$nextTick(async () => {
      this.userInfo = await getUser(this.uid);
    });
  }
};
</script>

<style></style>
