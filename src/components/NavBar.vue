<template>
  <div class="px-5 sm:px-10 py-4 h-16 w-full bg-gray-100 dark:bg-gray-900 shadow-md flex items-center justify-between xl:rounded-b-4xl z-50">
    <div>
      <router-link to="/">
        <!-- <div>W</div> -->
        <div
          class="text-lg sm:text-xl font-bold flex justify-center items-center bg-red-200 dark:bg-red-400 btnRing rounded-2xl w-12 h-12"
          @click="profileMenu = false"
        >
          WE
        </div>
      </router-link>
    </div>

    <div class="flex justify-start items-center gap-4 ">
      <!-- //!actions for admin -->
      <div
        v-if="getPrivLevel > 1"
        :class="{'opacity-0 -translate-y-5 sm:translate-y-0 sm:opacity-100 pointer-events-none sm:pointer-events-auto delay-0':!profileMenu,'opacity-100 translate-y-0 pointer-events-auto delay-200':profileMenu}"
        class="flex absolute shadow-xl sm:relative right-5 top-40 mt-2 sm:mt-0 sm:right-0 sm:top-0 px-4 py-2 transition duration-300 sm:delay-0 transform  justify-start items-start flex-col sm:flex-row sm:justify-center sm:items-center  gap-2 sm:px-2 bg-gray-100 dark:bg-gray-900 rounded-2xl sm:shadow-sm z-50"
      >
        <h1 class="text-2xl font-bold select-none">
          Actions
        </h1>

        <div>
          <router-link to="/adminUsers">
            <!-- <div>W</div> -->
            <div
              class="flex justify-center items-center space-x-2 transform transition duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl"
              @click="profileMenu = false"
            >
              <div class="flex-grow-0 flex justify-start items-center overflow-hidden group duration-300 cursor-pointer px-2.5 sm:px-3 py-1.5 relative flex-shrink-0">
                <i
                  class="fa fa-gavel flex-shrink-0 flex items-center justify-center text-xl font-black transition transform duration-300 mt-px ml-px h-4 w-4"
                  aria-hidden="true"
                />
                <h1 class="text-lg font-semibold flex-shrink-0 transition-all delay-300 group-hover:delay-0 transform sm:group-hover:w-28 sm:w-0 overflow-hidden whitespace-nowrap duration-300 pl-3 sm:pl-0 sm:group-hover:pl-3 sm:opacity-0 sm:group-hover:opacity-100">
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
          <div class="flex justify-center items-center space-x-2 transform transition duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl">
            <div class="flex-grow-0 flex justify-start items-center overflow-hidden group duration-300 cursor-pointer px-2.5 sm:px-3 py-1.5 relative flex-shrink-0">
              <i
                class="fa fa-file flex-shrink-0 flex items-center justify-center text-xl font-black transition transform duration-300 mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 transition-all delay-300 group-hover:delay-0 transform sm:group-hover:w-28 sm:w-0 overflow-hidden whitespace-nowrap duration-300 pl-3 sm:pl-0 sm:group-hover:pl-2.5 sm:opacity-0 sm:group-hover:opacity-100">
                Write a post
              </h1>
            </div>
          </div>
        </div>
      </div>

      <!-- //!actions for host -->
      <div v-else-if="getPrivLevel > 0 && getPrivLevel <= 1">
        <div
          class="flex justify-center items-center"
          @click="goToCreate"
        >
          <!-- //!Create post button -->
          <div class="flex justify-center items-center space-x-2 transform transition duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl">
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

      <div class="flex-shrink-0">
        <!-- //!profile menu and thumbnail -->
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
              '-translate-y-4 opacity-0 pointer-events-none': !profileMenu,
              'translate-y-0 opacity-100 pointer-events-auto': profileMenu,
            }"
            class="absolute overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900 shadow-xl transform transition duration-300 right-0 top-14 flex justify-center items-start"
          >
            <div class="px-4 py-2 space-y-2 ">
              <router-link
                :to="'/profile/' + getUserInfo.uid"
                @click="profileMenu = false"
              >
                <div class="text-xl bg-gray-200 dark:bg-gray-800 rounded-lg px-6 py-1 w-full font-semibold btnTransform text-center">
                  <h1>Profile</h1>
                </div>
              </router-link>

              <div
                class="text-xl bg-red-400 rounded-lg px-6 py-1 w-full font-semibold btnTransform text-center cursor-pointer"
                @click="logOut"
              >
                <h1>Disconnect</h1>
              </div>
            </div>
          </div>
        </div>

        <!-- //!sign in btn -->
        <div v-else>
          <div
            class="cursor-pointer py-2 px-4 bg-red-100 dark:bg-red-400 rounded-xl btnRing"
            tabindex="-1"
            @click="logIn()"
          >
            Sign In
          </div>
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
    data() {
      return {
        profileMenu: false,
      };
    },
    computed: {
      ...mapGetters('user', [
        'getLoggedState', //usage : this.getLoggedState()
        'getUserInfo',
        'getPrivLevel',
      ]),
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
        this.profileMenu = false;
      },
      ...mapActions('user', ['updateToken']),
    },
  };
</script>
