<template>
  <div
    :class="{
      'group sm:hover:-translate-y-2 sm:hover:scale-105': !noHover,
      'pb-6': !noPoster,
      'max-h-20 justify-center': noPoster,
      'opacity-80': !eventUpcoming
    }"
    class="postCard transform transition duration-300 cursor-pointer rounded-none sm:rounded-4xl relative w-full sm:shadow-2xl flex flex-col items-center overflow-hidden border-0 border-b-2 border-gray-200 border-opacity-70 sm:border-b-0"
  > 
    <!-- //!creation date -->
    <div
      v-if="!noDates"
      class="absolute text-black font-semibold top-0 right-0 px-5 py-1 sm:py-2 text-xs transform opacity-100 group-hover:opacity-20 group-hover:-translate-y-2 transition duration-300 text-opacity-60 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-bl-4xl"
    >
      Posted {{ createdDate.date + ' ' + createdDate.time }}
    </div>
    <div class="w-full transform group-hover:-translate-y-2 group-hover:scale-105 sm:group-hover:-translate-y-0 sm:group-hover:scale-100 transition duration-300 flex-shrink-0">
      <!-- //!user data -->
      <div 
        class="pt-6 pb-4 w-full px-8 flex justify-start items-center"
      >
        <div class="rounded-full h-14 w-14 sm:h-16 sm:w-16 pointer-events-auto transition duration-300 flex-shrink-0 overflow-hidden object-contain flex justify-center items-center">
          <img
            v-if="userData"
            :src="userData.img"
            :alt="userData.userName"
          >
          <div
            v-else
            class="w-full h-full bg-gray-300 dark:bg-gray-700 animate-pulse"
          />
        </div>
        <div class="flex flex-col justify-center items-start h-full px-3 w-full gap-y-2">
          <h1
            v-if="userData"
            class="text-lg sm:text-2xl font-bold max-w-full truncate pr-8 sm:pr-36 flex-shrink-0"
          >
            {{ post.title }}
          </h1>
          <div
            v-else
            class="w-full h-6 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"
          />
          <router-link
            :to="'/profile/' + userData?.uid"
            class="w-full"
            @click.prevent.stop
          >
            <h1
              v-if="userData"
              class="text-base sm:text-xl max-w-full truncate pr-8 sm:pr-36 flex-shrink-0 hover:underline -mt-2"
            >
              {{ userData?.userName }}
            </h1>
            <div
              v-else
              class="w-4/12 h-4 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"
            />
          </router-link>
        </div>
      </div>
      
      <!-- //!Poster -->
      <div
        v-if="!noPoster"
        class="w-full h-full flex flex-col justify-start items-start px-8 sm:px-14 transform transition duration-300 group-hover:-translate-y-2.5"
      >
        <div
          :class="{ 'bg-red-300 animate-pulse': loading }"
          class="aspect-w-2 aspect-h-1 sm:aspect-w-2 sm:aspect-h-1 w-full rounded-3xl flex-shrink-0 shadow-md overflow-hidden"
        >
          <img
            v-if="!loading"
            :src="cover"
            alt="yeet"
          >
        </div>
      </div>

      <!-- //!hosting date -->
      <div
        v-if="!noDates"
        class="px-12 sm:px-36 mt-4"
      >
        <div class="bg-gray-100 dark:bg-gray-900 py-1 px-2 rounded-xl shadow-md flex justify-between items-center">
          <h1 class="text-sm font-semibold flex justify-start items-center gap-1">
            <h2 :class="{'text-red-400': !eventUpcoming}">
              {{ eventUpcoming ? 'Hosting' : 'Hosted' }}
            </h2> 
            {{ hostedDate.date + ' at ' + hostedDate.time }}
          </h1>
          <div
            class="btnTransformSm cursor-pointer w-7 h-7 bg-red-300 flex-shrink-0 rounded-lg"
            @click.prevent.stop
          >
            <i
              class="fa fa-bell text-xs h-full w-full flex justify-center items-center"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { formatDate } from '../utils';
  import { getCI2 } from '../js/dbActions';

  export default {
    name: 'PostCard',
    props: ['post', 'userData', 'noPoster', 'noHover', 'noDates'],
    data() {
      return {
        cover: null,
        loading: true,
      };
    },
    computed: {
      createdDate() {
        return formatDate(this.post.creation_date);
      },
      hostedDate() {
        return formatDate(this.post.hosting_date);
      },
      eventUpcoming(){
        return new Date(this.post.hosting_date) - Date.now() > 0;
      }
    },
    async mounted() {
      this.cover = await getCI2(this.post.pid);
      this.loading = false;
    },
  };
</script>

<style>
  .adaptiveBg {
    --cs: #f1f5f9;
    transition: --cs 300ms;
    background: linear-gradient(0deg, var(--cs), #f1f5f9);
  }

  .adaptiveBg:hover {
    --cs: #fca5a5;
  }
</style>
