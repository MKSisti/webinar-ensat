<template>
  <div ref="home" class="flex flex-col justify-start items-center sm:space-y-10 xl:pt-10">
    <carousel />
    <div
      class="w-full xl:w-7/12 sm:px-8 xl:px-0 flex flex-col xl:flex-row justify-start items-center xl:justify-between xl:items-start xl:space-x-10"
    >
      <div
        class="flex flex-col order-2 xl:order-1 justify-center items-center xl:justify-start xl:w-7/12 w-full md:w-10/12 sm:space-y-10 pb-8"
      >
        <post-card :key="p.hosting_date" v-for="p of posts" :post="p" />
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
import { debounce } from "../utils";
// import {createPost} from '../js/firebaseActions'
import { getInitialPosts, getExtraPosts} from "../js/firebaseActions";

export default {
  name: "App",
  data() {
    return {
      postsToShow: 5,
      posts: [],
    };
  },
  methods: {},
  computed: {},
  async mounted() {
    console.log("mounted");
    this.posts = await getInitialPosts();
    // for (const p of this.posts) {
    //   getUser(p.uid);
    // }
    // setInterval(async ()=>{
    //   var tmLoc = new Date();
    // //The offset is in minutes -- convert it to ms
    //   let t = tmLoc.getTime() + tmLoc.getTimezoneOffset() * 60000;
    //   await createPost({
    //     uid: "fkhvomoGmeho4I7dQEleEkN5ika2",
    //     hosting_date:  t,
    //     content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum repellendus, quia mollitia reprehenderit sint soluta? Perspiciatis cupiditate inventore recusandae beatae, commodi impedit temporibus quas repellat ducimus, earum fugiat deleniti quaerat?"
    //   })
    // },2000);
    let debScrollBottom = debounce(async () => {
      if (
        this.$refs.home.scrollHeight - this.$refs.home.scrollTop ===
        this.$refs.home.clientHeight
      ) {
        let extra = await getExtraPosts(this.posts[this.posts.length - 1].hosting_date);
        if (extra) this.posts.push(...extra);
        // console.log(timeConverter(this.posts[this.posts.length -1].hosting_date));
      }
    }, 200);

    this.$refs.home.addEventListener("scroll", debScrollBottom, false);
  },
  components: {
    Carousel,
    PostCard,
    Search,
  },
};
</script>

<style></style>
