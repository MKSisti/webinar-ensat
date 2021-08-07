<template>
  <transition name="fade-y" appear>
    <div
      ref="home"
      class="flex flex-col justify-start items-center sm:space-y-10 xl:pt-10 transition duration-300"
    >
      <carousel />
      <div
        class="w-full xl:w-7/12 sm:px-8 xl:px-0 flex flex-col xl:flex-row justify-start items-center xl:justify-between xl:items-start xl:space-x-10"
      >
        <loader v-if="loading" />
        <div
          v-else
          class="flex flex-col order-2 xl:order-1 justify-center items-center xl:justify-start xl:w-7/12 w-full md:w-10/12 sm:space-y-10 pb-8"
        >
          <transition-group name="fade-y" appear>
            <post-card
              class="transform transition duration-300"
              :key="p.pid"
              v-for="p of posts"
              :post="p"
              :userData="usersMap.get(p.owner)"
              @click="goToPost(p.pid)"
            />
          </transition-group>
        </div>
        <search
          class="w-full border-b-2 border-gray-200 border-opacity-70 bg-gray-50 md:bg-gray-100 md:8/12 sm:mb-10 xl:w-5/12 md:w-7/12 order-1 xl:order-2 xl:top-10 xl:sticky"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import Carousel from "../components/Carousel";
import PostCard from "../components/PostCard";
import Search from "../components/Search";
import Loader from "../components/Loader";

import { debounce } from "../utils";
// import {createPost} from '../js/firebaseActions'
import {
  getInitialPosts,
  getExtraPosts,
  makeUsersMap
} from "../js/firebaseActions";

export default {
  name: "App",
  data() {
    return {
      loading: true,
      postsToShow: 3 ,
      posts: [],
      usersMap: null
    };
  },
  methods: {
    goToPost(pid) {
      this.$router.push({ name: "post", params: { pid: pid } });
    },
  },
  computed: {},
  async mounted() {
    this.posts = await getInitialPosts(this.postsToShow);
    this.usersMap = await makeUsersMap(this.posts, this.usersMap);
    this.loading = false;
    let debScrollBottom = debounce(async () => {
      if (
        this.$refs.home?.scrollHeight && this.$refs.home?.scrollHeight - this.$refs.home?.scrollTop === this.$refs.home?.clientHeight ) {
        let extra =  this.posts.length > 0 ? await getExtraPosts(this.postsToShow, this.posts[this.posts.length - 1].hosting_date ) : null;
        if (extra) {
          await this.posts.push(...extra);
          this.usersMap = await makeUsersMap(extra, this.usersMap);
        }
        // console.log(timeConverter(this.posts[this.posts.length -1].hosting_date));
      }
    }, 200);

    this.$refs.home.addEventListener("scroll", debScrollBottom, false);
  },
  components: {
    Carousel,
    PostCard,
    Search,
    Loader
  }
};
</script>

<style></style>
