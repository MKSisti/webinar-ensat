<template>
  <div class="flex flex-col justify-start items-center space-y-10">
    <carousel />
    <div class="w-7/12 flex justify-between items-start space-x-10">
      <div class="flex flex-col justify-start items-center w-7/12 space-y-10">
        <post-card :key="n" v-for="n in 10" />
      </div>
      <search />
    </div>
  </div>
</template>

<script>
import Carousel from "../components/Carousel";
import PostCard from "../components/PostCard";
import Search from "../components/Search";

export default {
  name: "App",
  components: {
    Carousel,
    PostCard,
    Search
  }
};
</script>

<style></style>
