<template>
  <div
    class="w-full h-full transition duration-300"
  >
    <div class="w-full h-full flex justify-start items-start flex-col">
      <div class="flex w-full sm:w-10/12 sm:max-w-xl justify-center items-center sm:px-10 px-5 sm:pt-10 pt-5 mb-0">
        <user-card :user-info="userInfo" :minimal="overScroll"/>
      </div>
      <div
        v-if="uid == getUserInfo.uid"
        :class="{'max-h-0 py-0 m-0': overScroll,'max-h-44 py-3 mt-5': !overScroll}"
        class="px-4 bg-gray-100 dark:bg-gray-900 shadow-md flex-col md:flex-row flex items-start md:items-center justify-between rounded-2xl gap-4 font-semibold text-xl mx-auto select-none flex-shrink-0 overflow-hidden transition-all duration-300"
      >
        <router-link :to="'/profile/' + getUserInfo.uid">
          <div class="flex justify-center items-center">
            <div class="btnTransformSm transition-transform duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl w-44">
              <div class="w-full h-full flex justify-center items-center overflow-hidden cursor-pointer px-2 py-1.5 relative flex-shrink-0 gap-2">
                <h1 class="text-lg font-semibold">
                  Posts
                </h1>
              </div>
            </div>
          </div>
        </router-link>
        <router-link :to="{ name: 'feed' }">
          <div class="flex justify-center items-center">
            <div class="btnTransformSm transition-transform duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl w-44">
              <div class="w-full h-full flex justify-center items-center overflow-hidden cursor-pointer px-2 py-1.5 relative flex-shrink-0 gap-2">
                <h1 class="text-lg font-semibold">
                  Feed
                </h1>
              </div>
            </div>
          </div>
        </router-link>
      </div>
      <div class="w-full h-full relative select-auto mt-5">
        <router-view
          v-slot="{ Component }"
          class="w-full max-h-full absolute"
        >
          <transition
            name="fade-y"
            mode="out-in"
            appear
          >
            <component
              :is="Component"
              @overScroll="overScroll = true"
              @underScroll="overScroll = false"
              class="w-full max-h-full"
            />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser } from "../js/dbActions.js";
import UserCard from "../components/UserCard";
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  components: {
    UserCard,
  },
  props: ["uid"],
  data() {
    return {
      userInfo: {
        priv: 0,
      },
      becomingHost: false,
      editingProfile: false,
      overScroll:false,
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo", "getFollowers", "getFollowing"]),
  },
  watch: {
    $route: async function () {
      if (this.$route.path.includes("profile")) {
        await this.init();
      }
    },
  },
  async mounted() {
    await this.init();
  },
  methods: {
    clearData() {
      // this.userInfo = {};
      this.becomingHost = false;
      this.editingProfile = false;
      // this.awaitingApproval = false;
    },
    async init() {
      this.clearData();
      this.$nextTick(async () => {
        this.userInfo = await getUser(this.uid);
        if(!this.userInfo.email || !this.userInfo.userName) this.$router.push({ name: "error", params: { err: 'User doesn\'t exist' } });
      });
    },

    goToPost(pid) {
      this.$router.push({ name: "post", params: { pid: pid } });
    },
  },
};
</script>

<style scoped>
.btnRing {
  @apply ring-0 ring-red-300 ring-opacity-0 transition-all duration-300;
}

.btnRing:hover {
  @apply ring-2 ring-opacity-100;
}
</style>
