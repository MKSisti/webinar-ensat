<template>
  <div
    class="flex flex-col justify-start items-center h-full w-full space-y-10"
  >
    <div
      class="h-12 w-full bg-gray-100 shadow-md flex items-center justify-between"
    >
      <div>
        <div>W</div>
        <div>Webinar Ensat</div>
      </div>
      <div class="flex">
        <div>HOME</div>
        <div>ABOUT</div>
        <div>CONTACT US</div>
      </div>
      <div>Profile</div>
    </div>
    <carousel />
    <div class="w-7/12 flex justify-between items-start space-x-10">
      <div class="flex flex-col justify-start items-center w-7/12 space-y-10">
        <post-card :key="n" v-for="n in 10" />
      </div>
      <div class="w-5/12">
        <search />
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from "./components/Carousel";
import PostCard from "./components/PostCard";
import Search from "./components/Search";

export default {
  name: "App",
  components: {
    Carousel,
    PostCard,
    Search
  }
};
</script>

<style>
/* ./src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body,
#app {
  @apply bg-gray-50;
}
</style>
