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
        v-if="getPrivLevel > 0"
        @click="goToCreate"
        class="flex justify-center items-center space-x-2 transform transition duration-300 bg-gray-200 bg-opacity-70 rounded-xl"
      >
        <div
          class="flex-grow-0 flex justify-start items-center overflow-hidden group duration-300 cursor-pointer px-3.5 py-2 relative flex-shrink-0"
        >
          <i
            class="fa fa-file-o flex-shrink-0 flex items-center justify-center text-2xl font-black transition transform duration-300 mt-px ml-px"
            aria-hidden="true"
          ></i>
          <h1
            class="text-xl font-semibold flex-shrink-0 transition-all transform group-hover:w-32 w-0 overflow-hidden whitespace-nowrap duration-300 group-hover:pl-4"
          >
            Write a post
          </h1>
        </div>
      </div>
    </div>
    <div>
      <div class="relative" v-if="getLoggedState">
        <img
          @click="profileMenu =!profileMenu"
          class="rounded-full ring-0 ring-red-300 w-12 h-12 cursor-pointer"
          :src="getUserInfo.img"
          :alt="getUserInfo.userName"
        />


        <div :class="{'h-0 opacity-20': !profileMenu,'h-24 opacity-100': profileMenu}" ref="profileMenu" class="absolute overflow-hidden rounded-2xl bg-gray-100 shadow-2xl transition-all duration-300 right-0 top-14 flex justify-center items-start">
          <div class="px-4 py-2 space-y-2">
          <router-link @click="profileMenu = false" :to="'/profile/' + getUserInfo.uid">
            <div class="text-xl bg-gray-200 rounded-lg px-8 py-1 w-full font-semibold btnTransform text-center"><h1>Profile</h1></div>
          </router-link>

          <div @click="profileMenu = false" class="text-xl bg-red-400 rounded-lg px-8 py-1 w-full font-semibold btnTransform text-center cursor-pointer"><h1>Disconnect</h1></div>
          </div>
        </div>

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
      "getUserInfo",
      "getPrivLevel"
    ])
  },
  data(){
    return{
      profileMenu: false, 
    }
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
