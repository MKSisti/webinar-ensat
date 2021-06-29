<template>
  <div ref="home" class="flex flex-col justify-start items-center sm:space-y-10 xl:pt-10">
    <carousel />
    <div
      class="w-full xl:w-7/12 sm:px-8 xl:px-0 flex flex-col xl:flex-row justify-start items-center xl:justify-between xl:items-start xl:space-x-10"
    >
      <div
        class="flex flex-col order-2 xl:order-1 justify-center items-center xl:justify-start xl:w-7/12 w-full md:w-10/12 sm:space-y-10 pb-8"
      >
        <post-card :key="n" v-for="n in offsetPosts" />
      </div>
      <search
        class="w-full border-b-2 border-gray-200 border-opacity-70 bg-gray-50 md:bg-gray-100 md:8/12 sm:mb-10 xl:w-5/12 md:w-7/12 order-1 xl:order-2 xl:top-10 xl:sticky"
      />
    </div>
  </div>
</template>

<script>
import Carousel from "../components/Carousel";
import PostCard from "../components/PostCard";
import Search from "../components/Search";
import {debounce} from '../utils'

export default {
  name: "App",
  data() {
    return {
      offset: 0,
      postsToShow: 5,
      posts: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ]
    };
  },
  methods: {},
  computed: {
    offsetPosts() {
      return [...this.posts].splice(
        0,
        this.postsToShow + this.offset
      );
    }
  },
  mounted() {
    console.log("mounted");

    let debScrollBottom = debounce(() => {
       console.log(this.$refs.home.scrollHeight - this.$refs.home.scrollTop === this.$refs.home.clientHeight);
       this.offset = Math.min(this.offset + this.postsToShow,this.posts.length - 1 - this.postsToShow);
       console.log(this.offset);
    },200); 

    this.$refs.home.addEventListener("scroll", debScrollBottom, false);
  },
  components: {
    Carousel,
    PostCard,
    Search
  }
};
</script>

<style></style>
