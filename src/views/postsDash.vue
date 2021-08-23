<template>
  <div class="w-full h-full flex justify-start items-start flex-col">
    <h1 class="text-6xl font-bold px-10 py-5">Post Requests</h1>
    <div class="w-full h-full bg-gray-100 rounded-t-6xl">
      <div class="overflow-auto flex justify-start items-start flex-wrap px-10 py-20 gap-5">
        <div :key="p.pid" v-for="p in postsRequests" class="w-full relative flex-none">
          <div class="right-0 top-0 bottom-0 absolute flex justify-end items-center z-50 gap-2 pr-2">
            <div @click="decline(p.pid)" @click.prevent.stop class="btnTransform cursor-pointer w-10 h-10 bg-red-400 rounded-xl"></div>
            <div @click="approve(p.pid)" @click.prevent.stop class="btnTransform cursor-pointer w-10 h-10 bg-green-400 rounded-xl"></div>
          </div>
          <div class="flex flex-col order-2 xl:order-1 justify-center items-center xl:justify-start xl:w-7/12 w-full md:w-10/12 sm:space-y-10">
          <transition-group name="fade-y" appear>
            <post-card
              class="transform transition duration-300 flex-shrink-0"
              :key="p.pid"
              :post="p"
              :userData="usersMap?.get(p.owner)"
              @click="goToPost(p.pid)"
            />
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
  import {getPosts, makeUsersMap,} from '../js/dbActions'

  export default {
    name:"usersDash",
    components: {
      PostCard,
    },
    data() {
      return{
        postsRequests: [],
        usersMap: null,
      };
    },
    methods:{
        goToPost(pid) {
        this.$router.push({
          name: 'post',
          params: {
            pid: pid,
          },
        });
      },
      async decline(pid){
          console.log(pid);
        await this.fetchU();
      },
      async approve(pid){
        console.log("should approve"+pid);
        await this.fetchU();
      },
      async fetchU(){
        this.postsRequests = await getPosts({ approved: false });
      }
    },
    async mounted(){
      await this.fetchU();
      this.usersMap = await makeUsersMap(this.postsRequests, this.usersMap);
    }
  };
</script>

<style></style>
