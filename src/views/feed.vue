<template>
    <div class="w-full h-full transition-opacity duration-300 bg-gray-100 dark:bg-gray-900 flex justify-start items-start flex-col space-y-5 rounded-t-6xl shadow-3xl overflow-auto">
        <div class="text-4xl sm:text-6xl font-bold px-10 pt-5">Feed</div>
        <div class="w-full h-full">
            <div class="w-full h-full flex-col text-4xl">
                <div class="w-full sm:px-8 xl:px-0 flex flex-row justify-around items-start flex-wrap sm:gap-y-10 rounded-t-3xl overflow-hidden sm:py-5 sm:overflow-visible">
                    <transition-group v-if="userPosts.length > 0" name="fade-y" appear>
                        <post-card v-for="p of userPosts" :key="p.pid" class="transform transition duration-300 max-w-2xl" :post="p" :user-data="usersMap?.get(p.owner)" @click="goToPost(p.pid)" />
                    </transition-group>
                    <div v-else class="text-xl font-semibold select-none">Feels empty in here 😢</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getUser, getPosts, getFollowingListIds, makeUsersMap } from "../js/dbActions.js";
import { mapGetters } from "vuex";
import PostCard from "../components/PostCard";

export default {
  name:'UserPostsView',
  props:['uid'],
  components: {
    PostCard,
  },
  data(){
    return{
      userInfo: {
        priv: 0,
      },
      userPosts: [],
      followingList: [],
      usersMap: null,
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  watch: {
    $route: async function () {
      if (this.$route.name == "profile") {
        await this.init();
      }
    },
  },
  methods:{
    clearData() {
      this.followingList = [];
      this.userPosts = [];
      this.userInfo = {
        priv: 0,
      };
    },
    async init(){
      this.clearData();
      this.$nextTick(async () => {
        this.userInfo = await getUser(this.uid);
        this.followingList = await getFollowingListIds(this.uid);
        if (this.userInfo.priv >= 0)
          this.userPosts = await getPosts( { owner: { $in: this.followingList }, approved: true  });
          this.userPosts.length > 0 ? (this.usersMap = await makeUsersMap(this.userPosts, this.usersMap)) : null;
           
      });
    },
    goToPost(pid) {
      this.$router.push({ name: "post", params: { pid: pid } });
    },
  },
  async created() {
    // console.log(this.uid);
    this.init();
  },
};
</script>

<style></style>
