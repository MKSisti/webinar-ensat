<template>
  <div class="w-full h-full flex justify-start items-start flex-col overflow-auto">
    <h1 class="text-4xl sm:text-6xl font-bold px-10 py-5">
      Post Requests
    </h1>
    <div class="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-t-6xl shadow-3xl overflow-auto">
      <loader v-if="loading" />
      <div
        v-else
        class="overflow-auto flex justify-start items-start flex-wrap px-0 sm:px-10 pt-5 sm:pb-20 gap-10 sm:gap-5"
      >
        <div
          v-for="p in postsRequests"
          :key="p.pid"
          class="w-full relative flex-none"
        >
          <div class="w-full px-0 sm:px-8 xl:px-10 2xl:px-12 flex flex-col justify-start items-center">
            <transition-group
              name="fade-y"
              appear
            >
              <div
                :key="p.pid"
                class="w-full relative transform transition duration-300 flex justify-center items-center flex-col gap-2"
              >
                <post-card
                  :key="p.pid"
                  :post="p"
                  :user-data="usersMap?.get(p.owner)"
                  :no-poster="true"
                  :no-hover="true"
                  :no-dates="true"
                  @click="goToPost(p.pid)"
                />
                <div class="right-0 top-0 bottom-0 sm:absolute flex sm:justify-end justify-center items-center z-50 gap-2 sm:pr-4">
                  <div
                    class="btnTransform cursor-pointer w-10 h-10 bg-green-400 rounded-xl flex justify-center items-center"
                    @click="approve(p.pid)"
                    @click.prevent.stop
                  >
                    <i
                      class="fa fa-check text-xl h-0 w-0 flex justify-center items-center"
                      aria-hidden="true"
                    />
                  </div>
                  <div
                    class="btnTransform cursor-pointer w-10 h-10 bg-red-400 rounded-xl flex justify-center items-center"
                    @click="decline(p.pid, p.owner)"
                    @click.prevent.stop
                  >
                    <i
                      class="fa fa-times text-xl h-0 w-0 flex justify-center items-center"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  //   import UserCard from '../components/UserCard';
  import PostCard from '../components/PostCard.vue';
  import Loader from '../components/Loader';
  import { getPosts, makeUsersMap, denyPost, confirmPost } from '../js/dbActions';

  export default {
    name: 'UsersDash',
    components: {
      PostCard,
      Loader,
    },
    data() {
      return {
        postsRequests: [],
        usersMap: null,
        loading: true,
      };
    },
    async mounted() {
      await this.fetchU();
      this.usersMap = await makeUsersMap(this.postsRequests, this.usersMap);
      this.loading = false;
    },
    methods: {
      goToPost(pid) {
        this.$router.push({
          name: 'post',
          params: {
            pid: pid,
          },
        });
      },
      async decline(pid, uid) {
        await denyPost(pid, uid);
        await this.fetchU();
      },
      async approve(pid) {
        await confirmPost(pid);
        await this.fetchU();
      },
      async fetchU() {
        this.postsRequests = await getPosts({ approved: false });
      },
    },
  };
</script>

<style></style>
