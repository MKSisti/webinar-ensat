<template>
  <div
    class="group postCard transform sm:hover:-translate-y-2 sm:hover:scale-105 transition duration-300 cursor-pointer rounded-none sm:rounded-4xl relative w-full pb-6 sm:shadow-2xl flex flex-col justify-start items-center overflow-hidden border-0 border-b-2 border-gray-200 border-opacity-70 sm:border-b-0"
  >
    <div class="absolute text-black font-semibold top-0 right-0 px-5 py-2 text-xs text-opacity-60 bg-gray-200 bg-opacity-70 rounded-bl-4xl">
      {{ hostedDate.date + ' ' + hostedDate.time }}
    </div>
    <div class="w-full transform hover:-translate-y-2 hover:scale-105 sm:group-hover:-translate-y-0 sm:group-hover:scale-100 transition duration-300 flex-shrink-0">
      <div class="h-32 w-full px-8 flex justify-start items-center">
        <div
          class="rounded-full h-16 w-16 pointer-events-auto transition duration-300 flex-shrink-0 overflow-hidden object-contain flex justify-center items-center"
        >
          <img v-if="userData" :src="userData.img" :alt="userData.userName" />
          <div v-else class="w-full h-full bg-gray-300 animate-pulse"></div>
        </div>
        <div class="flex flex-col justify-center items-start h-full px-3 w-full gap-y-2">
          <h1 v-if="userData" class="text-2xl font-bold max-w-full truncate pr-36 flex-shrink-0 ">
            {{ post.title }}
          </h1>
          <div v-else class="w-full h-6 bg-gray-300 rounded-lg animate-pulse"></div>
          <router-link @click.prevent.stop :to="'/profile/' + userData?.uid" class="w-full">
            <h1 v-if="userData" class="text-xl max-w-full truncate pr-24 flex-shrink-0 hover:underline -mt-2">
              {{ userData?.userName }}
            </h1>
            <div v-else class="w-4/12 h-4 bg-gray-300 rounded-md animate-pulse"></div>
          </router-link>
        </div>
      </div>
      <div class="w-full h-full flex flex-col justify-start items-start px-8 sm:px-14 transform transition duration-300 group-hover:-translate-y-3">
        <div
          :class="{ 'bg-red-300 animate-pulse': loading }"
          class="aspect-w-2 aspect-h-1 sm:aspect-w-2 sm:aspect-h-1 w-full  rounded-3xl flex-shrink-0 shadow-md overflow-hidden"
        >
          <img v-if="!loading" :src="cover" alt="yeet" />
        </div>

        <!-- <div
        class="w-full bg-gray-100 text-xl mx-auto rounded-b-3xl flex justify-center items-center font-semibold py-1 -mt-20 pt-20"
      >
        Hosting {{ hostedDate.date }} at {{ hostedDate.time }}
      </div> -->

        <!-- <div
        v-html="post?.content"
        class="line-clamp-5 sm:px-8 pt-2 pb-1 font-semibold text-lg postCardHtml"
      ></div> -->
      </div>
    </div>
  </div>
</template>

<script>
  import { formatDate } from '../utils';
  import { getCI2 } from '../js/dbActions';

  export default {
    name: 'PostCard',
    props: ['post', 'userData'],
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
