<template>
  <div class="w-full h-full flex justify-start items-start flex-col">
    <h1 class="text-6xl font-bold px-10 py-5">Host Requests</h1>
    <div class="w-full h-full bg-gray-100 rounded-t-6xl">
      <div class="overflow-auto flex justify-start items-start flex-wrap px-10 py-20 gap-5">
        <div :key="u.uid" v-for="u in usersRequests" class="w-full relative flex-none">
          <div class="right-0 top-0 bottom-0 absolute flex justify-end items-center z-50 gap-2 pr-2">
            <div @click="decline(u.uid)" @click.prevent.stop class="btnTransform cursor-pointer w-10 h-10 bg-red-400 rounded-xl"></div>
            <div @click="approve(u.uid)" @click.prevent.stop class="btnTransform cursor-pointer w-10 h-10 bg-green-400 rounded-xl"></div>
          </div>
          <user-card class="z-30" :minimal="true" :userInfo="u" />
        </div>
      </div>
    </div>
    <h1 class="text-6xl font-bold px-10 py-5">Block Users</h1>
    <search
          @apply="searchForUsers"
          :text="text||''"
          class="w-full bg-gray-50 md:bg-gray-100 md:8/12 sm:mb-10 xl:w-5/12 md:w-7/12 order-1 xl:order-2 xl:top-10 xl:sticky border-0 border-b-2 border-gray-200 border-opacity-70 sm:border-b-0"
        />
    <div class="w-full h-full bg-gray-100 rounded-t-6xl">
      <div class="overflow-auto flex justify-start items-start flex-wrap px-10 py-20 gap-5">
        <div :key="u.uid" v-for="u in usersList" class="w-full relative flex-none">
          <div class="right-0 top-0 bottom-0 absolute flex justify-end items-center z-50 gap-2 pr-2">
            <div @click="block(u.uid)" @click.prevent.stop class="btnTransform cursor-pointer w-10 h-10 bg-red-400 rounded-xl"></div>
          </div>
          <user-card class="z-30" :minimal="true" :userInfo="u" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserCard from '../components/UserCard';
  import Search from '../components/Search';
  import {getUsersInWaitingRoom, getUsersFromSearch, confirmHost, denyHost, blockUser} from '../js/dbActions'

  export default {
    name:"usersDash",
    components: {
      UserCard,
      Search,
    },
    data() {
      return{
        usersRequests: [],
        usersList: [],
        text:'',
      };
    },
    methods:{
      async searchForUsers(t){
        this.text = t;
        this.usersList = await getUsersFromSearch(t);
      },
      async block(uid){
        blockUser(uid)
      },
      async decline(uid){
        await denyHost(uid);
        await this.fetchU();
      },
      async approve(uid){
        await confirmHost(uid);
        await this.fetchU();
      },
      async fetchU(){
        this.usersRequests = await getUsersInWaitingRoom();
      }
    },
    async mounted(){
      await this.fetchU();
    }
  };
</script>

<style></style>
