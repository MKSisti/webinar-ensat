<template>
  <div class="w-full h-full">
    <div
      ref="container"
      class="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-t-6xl shadow-3xl overflow-auto"
    >
      <div v-if="loading">
        <loader class="pb-4 pt-4" />
      </div>
      <div
        v-else
        class="w-full flex justify-start items-start flex-col space-y-5 overflow-visible"
      >
        <div class="text-4xl sm:text-6xl font-bold px-10 pt-5">
          Feed
        </div>
        <div class="w-full h-full">
          <div class="w-full h-full flex-col text-4xl">
            <div class="w-full sm:px-8 xl:px-0 flex flex-row justify-around items-start flex-wrap sm:gap-y-10 rounded-t-3xl overflow-hidden sm:pt-5 sm:overflow-visible">
              <transition-group
                v-if="feed.length > 0"
                name="fade-y"
                appear
              >
                <post-card
                  v-for="p of feed"
                  :key="p.pid"
                  class="transform transition duration-300 max-w-2xl"
                  :post="p"
                  :user-data="usersMap?.get(p.owner)"
                  @click="goToPost(p.pid)"
                />
                <loader
                  v-if="!loading && extraPosts"
                  class="-mt-5 pb-5"
                />
          
                <div
                  v-else-if="!loading && !extraPosts"
                  class="h-20 w-full flex justify-center items-center -mt-5 pb-5"
                >
                  <i
                    class="ri-arrow-up-s-line transform transition duration-300 text-4xl"
                    aria-hidden="true"
                  />
                </div>
              </transition-group>
              <div
                v-else
                class="text-xl font-semibold select-none"
              >
                Feels empty in here 😢
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, getPosts, getFollowingListIds, makeUsersMap } from "../js/dbActions.js";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import { debounce } from "../utils";

export default {
  name: "Feed",
  components: {
    PostCard,
    Loader,
  },
  props: ["uid"],
  data() {
    return {
      feed: [],
      followingList: [],
      usersMap: null,
      loading: true,
      postsToshow: 3,
      extraPosts:false,
    };
  },
  watch: {
    $route: async function () {
      if (this.$route.name == "profile") {
        await this.init();
      }
    },
  },
  async mounted() {
    // console.log(this.uid);
    await this.init();
  },
  methods: {
    clearData() {
      this.followingList = [];
      this.feed = [];
    },
    async init() {
      this.loading = true;
      this.clearData();
      this.$nextTick(async () => {
        this.userInfo = await getUser(this.uid);
        this.followingList = await getFollowingListIds(this.uid);
        this.feed = await getPosts({ owner: { $in: this.followingList }, approved: true }, { creation_date: -1 }, this.postsToshow, null);
        this.feed = this.feed.concat(this.feed);
        this.feed.length > 0 ? (this.usersMap = await makeUsersMap(this.feed, this.usersMap)) : null;
        this.loading = false;

        let debScrollBottom = debounce(async () => {
          if(this.$refs.container?.scrollTop > 100) this.$emit('overScroll');
          else this.$emit('underScroll');

          if (!this.loading)
            if (this.$refs.container?.scrollHeight && this.$refs.container?.scrollHeight - this.$refs.container?.scrollTop <= this.$refs.container?.clientHeight) {
              this.extraPosts = true;
              let extra = await getPosts({ owner: { $in: this.followingList }, approved: true }, { creation_date: -1 }, this.postsToshow, this.feed[this.feed.length - 1]);
              if (extra.length > 0) {
                this.feed.push(...extra);
                this.usersMap = await makeUsersMap(extra, this.usersMap);
              } else {
                setTimeout(() => (this.extraPosts = false), 1000);
              }
            }
        }, 100);
        this.$refs.container.addEventListener("scroll", debScrollBottom, false);
      });
    },
    goToPost(pid) {
      this.$router.push({ name: "post", params: { pid: pid } });
    },
  },
};
</script>

<style></style>
