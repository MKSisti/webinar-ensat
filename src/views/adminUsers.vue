<template>
  <div class="w-full h-full flex justify-start items-start flex-col">
    <h1 class="text-4xl sm:text-6xl font-bold px-10 py-5">
      Host Requests
    </h1>
    <div class="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-t-6xl shadow-3xl overflow-auto">
      <loader v-if="loading" />
      <div
        v-else
        class="overflow-auto flex justify-start items-start flex-wrap px-10 py-20 gap-5"
      >
        <div
          v-if="usersRequests.length <= 0"
          class="text-xl font-semibold w-full p-5 text-center select-none"
        >
          No items to show.
        </div>
        <div
          v-for="u in usersRequests"
          v-else
          :key="u.uid"
          class="w-full relative flex-none"
        >
          <div class="right-0 top-0 bottom-0 absolute flex justify-end items-center z-50 gap-2 pr-2">
            <div
              :class="{'pointer-events-none': transactionInProgress[u.uid]}"
              class="btnTransform cursor-pointer w-10 h-10 bg-green-500 rounded-xl flex justify-center items-center flex-shrink-0 relative"
              @click="approve(u.uid)"
              @click.prevent.stop
            >
              <transition
                name="fade-y"
                appear
              >
                <i
                  v-if="!transactionInProgress[u.uid]"
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
              :class="{'pointer-events-none': transactionInProgress[u.uid]}"
              class="btnTransform cursor-pointer w-10 h-10 bg-red-500 rounded-xl flex justify-center items-center flex-shrink-0 relative"
              @click="decline(u.uid)"
              @click.prevent.stop
            >
              <transition
                name="fade-y"
                appear
              >
                <i
                  v-if="!transactionInProgress[u.uid]"
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
          <user-card
            class="z-30"
            :minimal="true"
            :user-info="u"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserCard from '../components/UserCard';
  import Loader from '../components/Loader';
  import { getUsersInWaitingRoom, confirmHost, denyHost } from '../js/dbActions';

  export default {
    name: 'UsersDash',
    components: {
      UserCard,
      Loader,
    },
    data() {
      return {
        usersRequests: [],
        text: '',
        loading: true,
        transactionInProgress: {},
      };
    },
    async mounted() {
      await this.fetchU();
      this.loading = false;
    },
    methods: {
      async decline(uid) {
        this.transactionInProgress[uid]= true;
        await denyHost(uid);
        await this.fetchU();
        this.$emit('success','red','User hosting request has been declined');
        this.transactionInProgress[uid]= false;
      },
      async approve(uid) {
        this.transactionInProgress[uid]= true;
        await confirmHost(uid);
        await this.fetchU();
        this.$emit('success','green','User hosting request has been approved');
        this.transactionInProgress[uid]= false;
      },
      async fetchU() {
        this.usersRequests = await getUsersInWaitingRoom();
      },
    },
  };
</script>

<style></style>
