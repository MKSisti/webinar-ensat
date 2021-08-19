<template>
  <div class="w-full h-full flex justify-start items-start flex-col">
    <h1 class="text-6xl font-bold px-10 py-5">Users</h1>
    <div class="w-full h-full bg-gray-100 rounded-t-6xl">
      <div class="overflow-auto flex justify-start items-start flex-wrap px-10 py-20 gap-5">
        <div :key="n" v-for="n in [1, 2, 3, 4]" class="max-w-xl w-full relative flex-none">
          <div class="right-0 top-0 bottom-0 absolute flex justify-end items-center z-50 gap-2 pr-2">
            <div @click.prevent.stop class="btnTransform cursor-pointer w-10 h-10 bg-red-400 rounded-xl"></div>
          </div>
          <user-card class="z-30" :minimal="true" :userInfo="{ userName: 'poopoo', email: 'pepee@gmail.poop', priv: 1 }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserCard from '../components/UserCard';
  export default {
    components: {
      UserCard,
    },
  };
</script>

<style></style>
