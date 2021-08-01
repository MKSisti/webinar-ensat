<template>
  <div
    class="px-10 py-4 h-16 w-full bg-gray-100 shadow-md flex items-center justify-between xl:rounded-b-4xl"
  >
    <div>
      <router-link to="/">
        <!-- <div>W</div> -->
        <div class="text-xl font-semibold">Webinar Ensat</div>
      </router-link>
    </div>
    <div class="flex justify-center items-center gap-5 text-xl font-bold">
      <!-- //!Create post button -->
      <div
        @click="goToCreate"
        class="flex justify-center items-center space-x-2 transform transition duration-300"
      >
        <div
          class="flex-grow-0 flex justify-start items-center overflow-hidden group duration-300 cursor-pointer px-4 py-3 space-x-3 relative flex-shrink-0"
        >
          <i
            class="fa fa-file-o flex-shrink-0 flex items-center justify-center text-2xl font-black transition transform duration-300 mt-px ml-px"
            aria-hidden="true"
          ></i>
          <h1
            class="text-xl font-semibold flex-shrink-0 transition-all transform group-hover:w-36 w-0 overflow-hidden whitespace-nowrap duration-300 pl-1"
          >
            Write a post
          </h1>
        </div>
      </div>
    </div>
    <div>
      <div v-if="getLoggedState">
        <router-link :to="'/profile/' + getUserInfo.uid">
          <img
            class="rounded-full ring-0 ring-red-300 w-12 h-12"
            :src="getUserInfo.img"
            :alt="getUserInfo.userName"
          />
        </router-link>
      </div>
      <div v-else>
        <div
          @click="logIn()"
          class="cursor-pointer py-2 px-4 bg-red-100 rounded-xl btnRing"
          tabindex="-1"
        >
          Sign In
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { auth, provider, posts } from "../firebase";

export default {
  name: "NavBar",
  computed: {
    ...mapGetters("user", [
      "getLoggedState", //usage : this.getLoggedState()
      "getUserInfo"
    ])
  },
  methods: {
    async logIn() {
      try {
        await auth.signInWithPopup(provider);
      } catch (error) {
        console.error(error);
      }
    },
    goToCreate() {
      this.$router.push({ name: "post", params: { pid: posts.push().key } });
    }
  }
};
</script>
