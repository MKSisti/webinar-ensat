<template>
    <div v-if="userInfo.priv >= 1" class="w-full h-full transition duration-300 bg-gray-100 dark:bg-gray-900 flex justify-start items-start flex-col space-y-5 rounded-t-6xl shadow-3xl overflow-auto">
        <div class="text-4xl sm:text-6xl font-bold px-10 pt-5">Posts</div>
        <!-- //!Create post button -->
        <div v-if="uid == getUserInfo.uid" class="flex justify-center items-center space-x-2 px-10" @click="goToCreate">
            <div class="flex-grow-0 flex justify-start items-center bg-gray-200 dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden group duration-300 cursor-pointer btnRing px-4 py-1 space-x-3 relative flex-shrink-0">
                <i class="ri-file-add-fill flex-shrink-0 flex items-center justify-center text-2xl transition transform duration-300 group-hover:-translate-y-1 mt-px ml-px" aria-hidden="true" />
                <h1 class="text-xl font-semibold flex-shrink-0 transition transform group-hover:-translate-y-1 -mt-0.5 duration-300">Write a post</h1>
            </div>
        </div>

        <div class="w-full h-full">
            <div class="w-full h-full flex-col text-4xl">
                <div class="w-full sm:px-8 xl:px-0 flex flex-row justify-around items-start flex-wrap sm:gap-y-10 rounded-t-3xl overflow-hidden sm:py-5 sm:overflow-visible">
                    <transition-group v-if="userPosts.length > 0" name="fade-y" appear>
                        <post-card v-for="p of userPosts" :key="p.pid" class="transform transition duration-300 max-w-2xl" :post="p" :user-data="userInfo" @click="goToPost(p.pid)" />
                    </transition-group>
                    <div v-else class="text-xl font-semibold select-none">Feels empty in here 😢</div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="w-full h-full transition duration-300 bg-gray-100 dark:bg-gray-900 flex justify-start items-center flex-col rounded-t-6xl shadow-3xl overflow-auto">
        <div v-if="!awaitingApproval && userInfo.priv == 0" class="flex justify-start items-center flex-col h-full p-5 space-y-3">
            <h1 class="text-4xl font-bold">You don't have the necessary privilege to post</h1>
            <h2 class="text-xl font-semibold">please fill the necessary details to complete your account</h2>
            <div class="py-20 space-y-10">
                <base-input size="4" :model-value="univ" lazy="200" name="University" @update:modelValue="handleUniv" />
                <div class="flex justify-center items-center gap-x-2">
                    <div class="h-14 w-28 text-2xl font-semibold flex justify-center items-center rounded-2xl bg-gray-200 dark:bg-gray-800 pb-1">(+212)</div>
                    <base-input size="4" :model-value="number" lazy="200" name="Phone Number" :numeric="true" @update:modelValue="handleNumber" />
                </div>
                <div class="w-5/12 h-12 bg-red-100 dark:bg-red-400 rounded-2xl flex justify-center items-center cursor-pointer btnRing mx-auto" tabindex="-1" @click="submit">
                    <h1 class="text-2xl font-bold mb-1 transition duration-300 transform">Submit</h1>
                </div>
            </div>
        </div>
        <div v-else-if="awaitingApproval && userInfo.priv == 0" class="flex justify-center items-center flex-col h-full p-20 space-y-3">
            <h1 class="text-4xl font-bold text-center">We are currently processing your profile</h1>
            <h2 class="text-xl font-semibold">Please come back at a later date</h2>
        </div>
        <div v-if="userInfo.priv < 0" class="flex justify-center items-center flex-col h-full p-20 space-y-3">
            <h1 class="text-4xl font-bold text-center">You can no longer Post here. Contact an admin to learn more</h1>
        </div>
    </div>
</template>

<script>
import { getUser, requestHost, checkUserInwaitingRoom, getPosts } from "../js/dbActions.js";
import { mapActions, mapGetters } from "vuex";
import { BSON } from "realm-web";
import PostCard from "../components/PostCard";
import BaseInput from "../components/BaseInput";

export default {
  name:'UserPostsView',
  props:['uid'],
  components: {
    PostCard,
    BaseInput,
  },
  data(){
    return{
      editingProfile: false,
      univ: "",
      number: "",
      userInfo: {
        priv: 0,
      },
      userPosts: [],
      awaitingApproval: false,
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  watch: {
    $route: async function () {
      if (this.$route.path.includes("profile")) {
        await this.init();
      }
    },
  },
  methods:{
    clearData() {
      this.userPosts = [];
      this.editingProfile = false;
      this.univ = "";
      this.number = "";
      this.awaitingApproval = false;
    },
    async init(){
      this.clearData();
      this.$nextTick(async () => {
        this.userInfo = await getUser(this.uid);
        if (this.userInfo.priv >= 1)
            if (this.getUserInfo.email == this.userInfo.email) 
              this.userPosts = await getPosts({ owner: this.uid });
            else 
              this.userPosts = await getPosts({ owner: this.uid, approved: true });
        this.awaitingApproval = await checkUserInwaitingRoom(this.uid);
      });
    },
    goToCreate() {
      let token = BSON.ObjectID();
      this.updateToken(token);
      this.$router.push({ name: "post", params: { pid: token } });
    },
    goToPost(pid) {
      this.$router.push({ name: "post", params: { pid: pid } });
    },
    handleUniv(val) {
      this.univ = val;
    },
    handleNumber(val) {
      this.number = val;
    },
    submit() {
      requestHost(this.uid, this.univ, this.number);
      this.awaitingApproval = true;
    },
    ...mapActions("user", ["updateToken"]),
  },
  async mounted() {
    // console.log(this.uid);
   await this.init();
  },
};
</script>

<style></style>
