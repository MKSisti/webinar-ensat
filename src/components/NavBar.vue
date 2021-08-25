<template>
  <div class="px-10 py-4 h-16 w-full bg-gray-100 shadow-md flex items-center justify-start xl:rounded-b-4xl gap-4">
    <div class="flex-grow">
      <router-link to="/">
        <!-- <div>W</div> -->
        <div class="text-xl font-semibold">
          Webinar Ensat
        </div>
      </router-link>
    </div>

    <!-- //!actions -->
    <div
      v-if="getPrivLevel > 1"
      class="flex justify-center items-center gap-2 px-2 py-1 bg-gray-100 rounded-2xl shadow-sm"
    >
      <h1 class="text-2xl font-bold select-none">
        Actions
      </h1>

      <div>
        <router-link to="/adminUsers">
          <!-- <div>W</div> -->
          <div class="flex justify-center items-center space-x-2 transform transition duration-300 bg-gray-200 bg-opacity-70 rounded-xl">
            <div class="flex-grow-0 flex justify-start items-center overflow-hidden group duration-300 cursor-pointer px-3 py-1.5 relative flex-shrink-0">
              <i
                class="fa fa-gavel flex-shrink-0 flex items-center justify-center text-xl font-black transition transform duration-300 mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 transition-all delay-300 group-hover:delay-0 transform group-hover:w-28 w-0 overflow-hidden whitespace-nowrap duration-300 group-hover:pl-3 opacity-0 group-hover:opacity-100">
                Admin dash
              </h1>
            </div>
          </div>
        </router-link>
      </div>

      <!-- //!Create post button -->
      <div
        class="flex justify-center items-center"
        @click="goToCreate"
      >
        <div class="flex justify-center items-center space-x-2 transform transition duration-300 bg-gray-200 bg-opacity-70 rounded-xl">
          <div class="flex-grow-0 flex justify-start items-center overflow-hidden group duration-300 cursor-pointer px-3 py-1.5 relative flex-shrink-0">
            <i
              class="fa fa-file flex-shrink-0 flex items-center justify-center text-xl font-black transition transform duration-300 mt-px ml-px h-4 w-4"
              aria-hidden="true"
            />
            <h1 class="text-lg font-semibold flex-shrink-0 transition-all delay-300 group-hover:delay-0 transform group-hover:w-28 w-0 overflow-hidden whitespace-nowrap duration-300 group-hover:pl-2.5 opacity-0 group-hover:opacity-100">
              Write a post
            </h1>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="getPrivLevel > 0 && getPrivLevel <= 1">
      <div
        class="flex justify-center items-center"
        @click="goToCreate"
      >
        <!-- //!Create post button -->
        <div class="flex justify-center items-center space-x-2 transform transition duration-300 bg-gray-200 bg-opacity-70 rounded-xl">
          <div class="flex-grow-0 flex justify-start items-center overflow-hidden group duration-300 cursor-pointer px-3 py-1.5 relative flex-shrink-0">
            <i
              class="fa fa-file flex-shrink-0 flex items-center justify-center text-xl font-black transition transform duration-300 mt-px ml-px h-4 w-4"
              aria-hidden="true"
            />
            <h1 class="text-lg font-semibold flex-shrink-0 transition-all delay-300 group-hover:delay-0 transform group-hover:w-28 w-0 overflow-hidden whitespace-nowrap duration-300 group-hover:pl-2.5 opacity-0 group-hover:opacity-100">
              Write a post
            </h1>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div
        v-if="getLoggedState"
        class="relative"
      >
        <img
          class="rounded-full ring-0 ring-red-300 w-12 h-12 cursor-pointer"
          :src="getUserInfo.img"
          :alt="getUserInfo.userName"
          @click="profileMenu = !profileMenu"
        >

        <div
          ref="profileMenu"
          :class="{
            'h-0 opacity-20': !profileMenu,
            'h-24 opacity-100': profileMenu,
          }"
          class="absolute overflow-hidden rounded-2xl bg-gray-100 shadow-2xl transition-all duration-300 right-0 top-14 flex justify-center items-start"
        >
          <div class="px-4 py-2 space-y-2">
            <router-link
              :to="'/profile/' + getUserInfo.uid"
              @click="profileMenu = false"
            >
              <div class="text-xl bg-gray-200 rounded-lg px-8 py-1 w-full font-semibold btnTransform text-center">
                <h1>Profile</h1>
              </div>
            </router-link>

            <div
              class="text-xl bg-red-400 rounded-lg px-8 py-1 w-full font-semibold btnTransform text-center cursor-pointer"
              @click="logOut"
            >
              <h1>Disconnect</h1>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          class="cursor-pointer py-2 px-4 bg-red-100 rounded-xl btnRing"
          tabindex="-1"
          @click="logIn()"
        >
          Sign In
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { BSON } from 'realm-web';
  import { mapGetters, mapActions } from 'vuex';
  import { auth, provider } from '../firebase';

  export default {
    name: 'NavBar',
    computed: {
      ...mapGetters('user', [
        'getLoggedState', //usage : this.getLoggedState()
        'getUserInfo',
        'getPrivLevel',
      ]),
    },
    data() {
      return {
        profileMenu: false,
      };
    },
    methods: {
      async logIn() {
        try {
          await auth.signInWithPopup(provider);
        } catch (error) {
          console.error(error);
        }
      },
      async logOut() {
        try {
          await auth.signOut();
        } catch (error) {
          console.error(error);
        } finally {
          this.profileMenu = false;
          this.$router.push({ name: 'home' });
        }
      },
      goToCreate() {
        let token = BSON.ObjectID();
        this.updateToken(token);
        this.$router.push({ name: 'post', params: { pid: token } });
      },
      ...mapActions('user', ['updateToken']),
    },
  };
</script>
