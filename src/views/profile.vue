<template>
  <transition name="fade-y" appear>
    <div class="w-full h-full -mt-10 pt-10 transition duration-300">
      <div
        class="w-full h-full flex justify-start items-start flex-col space-y-10"
      >
        <!-- //TODO user card needs to be a component-->
        <div class="flex justify-center items-center m-10 mb-0">
          <user-card :userInfo="userInfo" :editable="true" />
        </div>

        <div
          class="w-full h-full bg-gray-100 flex justify-start items-start flex-col px-10 space-y-5 rounded-t-6xl shadow-2xl ring-red-300 ring-2 ring-opacity-50"
        >
          <div class="text-7xl font-bold">
            Posts
          </div>
          <!-- //!Create post button -->
          <div
            @click="goToCreate"
            class="flex justify-center items-center space-x-2"
          >
            <div
              class="flex-grow-0 flex justify-start items-center bg-gray-100 rounded-2xl shadow-xl overflow-hidden group duration-300 cursor-pointer btnRing px-4 py-3 space-x-3 relative flex-shrink-0"
            >
              <i
                class="fa fa-file-o flex-shrink-0 flex items-center justify-center text-3xl transition transform duration-300 group-hover:-translate-y-1 mt-px ml-px"
                aria-hidden="true"
              ></i>
              <h1
                class="text-2xl font-semibold flex-shrink-0 transition transform group-hover:-translate-y-1 -mt-0.5 duration-300 pl-1"
              >
                Write a post
              </h1>
            </div>
          </div>

          <div class="w-full h-full">
            <div
              class="w-full h-full flex items-center justify-center flex-col text-4xl text-gray-500"
              v-if="'empty'"
            >
              <div
                class="text-red-50 flex items-center justify-start bg-red-400 px-2 py-1 rounded-2xl shadow-xl mb-8 transition transform hover:-translate-y-1 cursor-pointer duration-300"
              >
                <i
                  class="fa fa-info ring ring-red-50 rounded-full w-5 h-5 text-base flex items-center justify-center mr-2"
                ></i>
                <div
                  class="font-bold text-lg flex items-start justify-center flex-col"
                >
                  You don't yet meet the requirements to post
                  <h1 class="font-semibold text-sm -mt-1">
                    click here button to fill the necessary info
                  </h1>
                </div>
              </div>

              Feels empty in here 😢
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { getUser } from "../js/firebaseActions.js";
import UserCard from "../components/UserCard";
import { posts } from "../firebase";

export default {
  name: "profile",
  props: ["uid"],
  components: {
    UserCard
    // BaseInput
  },
  data() {
    return {
      userInfo: {},
      becomingHost: false,
      editingProfile: false
    };
  },
  methods: {
    goToCreate() {
      this.$router.push({ name: "post", params: { pid: posts.push().key } });
    }
  },
  async created() {
    this.$nextTick(async () => {
      this.userInfo = await getUser(this.uid);
    });
  }
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
