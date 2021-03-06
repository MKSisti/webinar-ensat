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
          v-if="postsRequests.length <= 0"
          class="text-xl font-semibold w-full p-5 text-center select-none"
        >
          No items to show.
        </div>
        <div
          v-for="p in postsRequests"
          v-else
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
                    :class="{'pointer-events-none': transactionInProgress[p.pid]}"
                    class="btnTransform cursor-pointer w-10 h-10 bg-green-500 rounded-xl flex justify-center items-center flex-shrink-0 relative"
                    @click="approve(p.pid, p.owner, p.title)"
                    @click.prevent.stop
                  >
                    <transition
                      name="fade-y"
                      appear
                    >
                      <i
                        v-if="!transactionInProgress[p.pid]"
                        class="ri-check-fill absolute text-xl h-0 w-0 flex justify-center items-center transform transition duration-300"
                        aria-hidden="true"
                      />
                      <div
                        v-else
                        class="w-4 h-4 absolute bg-gray-50 rounded-full transform transition duration-300 animate-ping"
                      />
                    </transition>
                  </div>
                  <div
                    :class="{'pointer-events-none': transactionInProgress[p.pid]}"
                    class="btnTransform cursor-pointer w-10 h-10 bg-red-500 rounded-xl flex justify-center items-center flex-shrink-0 relative"
                    @click="decline(p.pid, p.owner)"
                    @click.prevent.stop
                  >
                    <transition
                      name="fade-y"
                      appear
                    >
                      <i
                        v-if="!transactionInProgress[p.pid]"
                        class="ri-close-fill absolute text-xl h-0 w-0 flex justify-center items-center transform transition duration-300"
                        aria-hidden="true"
                      />
                      <div
                        v-else
                        class="w-4 h-4 absolute bg-gray-50 rounded-full transform transition duration-300 animate-ping"
                      />
                    </transition>
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
        transactionInProgress:{},
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
        this.transactionInProgress[pid] = true;
        await denyPost(pid, uid);
        await this.fetchU();
        this.$emit('success','red','Post has been declined');
        this.transactionInProgress[pid] = false;
      },
      async approve(pid, uid, title) {
        this.transactionInProgress[pid] = true;
        await confirmPost(pid, uid, title);
        await this.fetchU();
        this.$emit('success','green','Post has been approved');
        this.transactionInProgress[pid] = false;
      },
      async fetchU() {
        this.postsRequests = await getPosts({ approved: false });
      },
    },
  };
</script>

<style></style>
