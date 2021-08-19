<template>
  <transition name="fade-y" appear>
    <div ref="home" class="flex flex-col justify-start items-center sm:space-y-10 xl:pt-10 transition duration-300">
      <carousel :posters="carPosters" :posts="carPosts" :users="usersMap"/>
      <div class="w-full xl:w-7/12 sm:px-8 xl:px-0 flex flex-col xl:flex-row justify-start items-center xl:justify-between xl:items-start xl:space-x-10">
        
        <div class="flex flex-col order-2 xl:order-1 justify-center items-center xl:justify-start xl:w-7/12 w-full md:w-10/12 sm:space-y-10">
          <transition-group name="fade-y" appear>
            <loader v-if="loading" />
            <post-card
              class="transform transition duration-300 flex-shrink-0"
              :key="p.pid"
              v-for="p of posts"
              :post="p"
              :userData="usersMap?.get(p.owner)"
              @click="goToPost(p.pid)"
            />
          </transition-group>
          <loader class="pb-4 pt-4" v-if="!loading && extraPosts" />
          <div v-else class="h-20 pt-4"><i  class="fa fa-angle-up transform transition duration-300 text-4xl" aria-hidden="true"></i></div>
        </div>
        <search
          @apply="search"
          @searchChange="updateSearchText"
          @dropChange="updateDropVal"
          class="w-full bg-gray-50 md:bg-gray-100 md:8/12 sm:mb-10 xl:w-5/12 md:w-7/12 order-1 xl:order-2 xl:top-10 xl:sticky"
        />
      </div>
    </div>
  </transition>
</template>

<script>
  import Carousel from '../components/Carousel';
  import PostCard from '../components/PostCard';
  import Search from '../components/Search';
  import Loader from '../components/Loader';

  import { debounce } from '../utils';
  // import {createPost} from '../js/firebaseActions'
  import { getInitPosDyn,getExtPosDyn, makeUsersMap, getTitles, getPosFromList, getCI2 } from '../js/firebaseActions';

  export default {
    name: 'App',
    components: {
      Carousel,
      PostCard,
      Search,
      Loader,
    },
    data() {
      return {
        loading: true,
        postsToShow: 3,
        posts: [],
        usersMap: null,
        keyword: null,
        dropVal: 0,
        T: [],
        offset: 0,
        mode: false,
        extraPosts: true,
        searching:false,
        carPosts:[],
        carPosters:{},
        orderBy: ["hosting_date", "creation_date", "title"],
      };
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
      async search() {
        if (this.keyword != '') {
          this.searching = true;
          this.loading = true;
          this.offset = 0;
          this.T = await getTitles(this.keyword);

          this.posts = await getPosFromList(this.postsToShow, this.T, this.offset);
          this.offset = this.postsToShow;
          this.usersMap = await makeUsersMap(this.posts, this.usersMap);

          this.loading = false;
        } else {
          this.searching = false;
          this.loading = true;
          this.posts = await getInitPosDyn(this.postsToShow, this.orderBy[this.dropVal]);
          this.usersMap = await makeUsersMap(this.posts, this.usersMap);
          this.loading = false;
        }
      },
      updateSearchText(val) {
        this.keyword = val;
      },
      updateDropVal(val){
        this.dropVal = val;
        console.log(this.dropVal);
      }
    },
    computed: {
    },
    async mounted() {
      // this.posts = await getInitialPosts(this.postsToShow);
      this.posts = await getInitPosDyn(this.postsToShow, this.orderBy[this.dropVal]);

      this.usersMap = await makeUsersMap(this.posts, this.usersMap);

      this.carPosts = this.posts.slice(0,3);
      
      this.carPosts.forEach(async (p) => {
        const cover = await getCI2(p.pid);
        this.carPosters[p.pid] = cover;
      });

      this.loading = false;

      let debScrollBottom = debounce(async () => {
        if (!this.loading)
          if (this.$refs.home?.scrollHeight && this.$refs.home?.scrollHeight - this.$refs.home?.scrollTop === this.$refs.home?.clientHeight) {
            this.extraPosts = true;
            if (this.searching) {
              let extra = await getPosFromList(this.postsToShow, this.T, this.offset);
              this.offset += this.postsToShow;
              if (extra.length > 0) {
                await this.posts.push(...extra);
                this.usersMap = await makeUsersMap(extra, this.usersMap);
              } else {
                setTimeout(() => (this.extraPosts = false), 1000);
              }
            } else {
              // let extra = this.posts.length > 0 ? await getExtraPosts(this.postsToShow, this.posts[this.posts.length - 1].hosting_date) : null;
              let extra = this.posts.length > 0 ? await getExtPosDyn(this.postsToShow, this.orderBy[this.dropVal] , this.posts[this.posts.length - 1][this.orderBy[this.dropVal]]) : null;
              console.log(this.posts[this.posts.length - 1][this.orderBy[this.dropVal]]);
              if (extra.length > 0) {
                await this.posts.push(...extra);
                this.usersMap = await makeUsersMap(extra, this.usersMap);
              } else {
                setTimeout(() => (this.extraPosts = false), 1000);
              }
            }
          }
      }, 200);

      this.$refs.home.addEventListener('scroll', debScrollBottom, false);
    },
  };
</script>

<style></style>
