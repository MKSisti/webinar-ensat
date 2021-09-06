<template>
  <div
    class="w-full h-full transition duration-300"
  >
    <div class="w-full h-full flex justify-start items-start flex-col space-y-10">
      <div class="flex w-full sm:w-10/12 sm:max-w-xl justify-center items-center sm:px-10 px-5 sm:pt-10 pt-5 mb-0">
        <user-card :user-info="userInfo" />
      </div>
      <div
        v-if="uid == getUserInfo.uid"
        class="px-4 py-3 bg-gray-100 dark:bg-gray-900 shadow-md flex-col md:flex-row flex items-start md:items-center justify-between rounded-2xl gap-4 font-semibold text-xl mx-auto mt-5 select-none"
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
      <div class="w-full h-full relative select-auto">
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
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo", "getFollowers", "getFollowing"]),
  },
  watch: {
    $route: async function () {
      if (this.$route.name == "profile") await this.init();
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
