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
          v-for="u in usersRequests"
          :key="u.uid"
          class="w-full relative flex-none"
        >
          <div class="right-0 top-0 bottom-0 absolute flex justify-end items-center z-50 gap-2 pr-2">
            <div
              class="btnTransform cursor-pointer w-10 h-10 bg-green-400 rounded-xl flex justify-center items-center"
              @click="approve(u.uid)"
              @click.prevent.stop
            >
              <i
                class="fa fa-check text-xl h-0 w-0 flex justify-center items-center"
                aria-hidden="true"
              />
            </div>
            <div
              class="btnTransform cursor-pointer w-10 h-10 bg-red-400 rounded-xl flex justify-center items-center"
              @click="decline(u.uid)"
              @click.prevent.stop
            >
              <i
                class="fa fa-times text-xl h-0 w-0 flex justify-center items-center"
                aria-hidden="true"
              />
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
      };
    },
    async mounted() {
      await this.fetchU();
      this.loading = false;
    },
    methods: {
      async decline(uid) {
        await denyHost(uid);
        await this.fetchU();
      },
      async approve(uid) {
        await confirmHost(uid);
        await this.fetchU();
      },
      async fetchU() {
        this.usersRequests = await getUsersInWaitingRoom();
      },
    },
  };
</script>

<style></style>
