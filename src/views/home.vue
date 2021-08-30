<template>
  <transition
    name="fade-y"
    appear
  >
    <div
      ref="home"
      class="overflow-auto flex flex-col justify-start items-center sm:space-y-10 xl:pt-10 transition duration-300"
    >
      <carousel
        :loading="carLoading"
        :posters="carPosters"
        :posts="carPosts"
        :users="usersMap"
      />
      <div class="w-full xl:w-10/12 2xl:w-8/12 2xl:px-12 sm:px-8 xl:px-0 flex flex-col xl:flex-row justify-start items-center xl:justify-between xl:items-start xl:space-x-10 relative">
        <loader
          v-if="loading"
          style="height:100px"
          class="relative order-2 z-10 xl:order-1"
        />
        <div 
          v-else
          class="flex flex-col order-2 z-10 xl:order-1 justify-center items-center xl:justify-start xl:w-7/12 w-full md:w-10/12 sm:space-y-10 relative"
        >
          <transition-group
            name="fade-y"
            mode="in-out"
            appear
          >
            <post-card
              v-for="p of posts"
              :key="p.pid"
              class="transform transition duration-300 flex-shrink-0"
              :post="p"
              :user-data="usersMap?.get(p.owner)"
              @click="goToPost(p.pid)"
            />
          </transition-group>
          <loader
            v-if="!loading && extraPosts"
            class="pb-4 pt-4"
          />
          
          <div
            v-else-if="!loading && !extraPosts"
            class="h-20 pt-4"
          >
            <i
              class="fa fa-angle-up transform transition duration-300 text-4xl"
              aria-hidden="true"
            />
          </div>
        </div>
        <search
          :text="$route.query.keyword || ''"
          :drop="$route.query.order || 0"
          class="w-full bg-gray-50 md:bg-gray-100 md:8/12 sm:mb-10 xl:w-5/12 md:w-7/12 order-1 xl:order-2 xl:top-10 xl:sticky border-0 border-b-2 border-gray-200 border-opacity-70 sm:border-b-0"
          @apply="search"
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
  import { makeUsersMap, getCI2, getPosts } from '../js/dbActions';

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
        postsToShow: 5,
        posts: [],
        usersMap: null,
        keyword: '',
        dropVal: 0,
        extraPosts: true,
        searching: false,
        carPosts: [],
        carPosters: {},
        carLoading: true,
        orderBy: [{ hosting_date: 1 }, { hosting_date: -1 }, { creation_date: 1 }, { creation_date: -1 }, { title: 1 }, { title: -1 }],
      };
    },
    computed: {},
    watch: {
      $route: async function () {
        if (this.$route.name == 'home') {
          this.keyword = this.$route.query.keyword || '';
          this.dropVal = this.$route.query.order || 0;
          await this.doSearch();
        }
      },
    },
    async mounted() {
      this.init();
    },
    methods: {
      async init(){
        this.$nextTick(async () => {
          let op = { approved: true };
          if (this.$route.query?.keyword) {
            this.keyword = this.$route.query.keyword;
            op['title'] = this.keyword;
          }
          if (this.$route.query?.order) {
            this.dropVal = this.$route.query.order;
          }
          this.posts = await getPosts(op, this.orderBy[this.dropVal], this.postsToShow, null);
          this.posts.length > 0 ? (this.usersMap = await makeUsersMap(this.posts, this.usersMap)) : null;

          this.carPosts = await getPosts({ approved: true }, { hosting_date: 1 }, 3, null);

          this.carPosts.forEach(async (p) => {
            const cover = await getCI2(p.pid);
            this.carPosters[p.pid] = cover;
          });
          this.carLoading = false;

          this.loading = false;

          let debScrollBottom = debounce(async () => {
            if (!this.loading)
              if (this.$refs.home?.scrollHeight && this.$refs.home?.scrollHeight - this.$refs.home?.scrollTop <= this.$refs.home?.clientHeight) {
                this.extraPosts = true;
                let extra = await getPosts(this.keyword ? { approved: true, title: this.keyword } : { approved: true }, this.orderBy[this.dropVal], this.postsToShow, this.posts[this.posts.length - 1]);
                if (extra.length > 0) {
                  this.posts.push(...extra);
                  this.usersMap = await makeUsersMap(extra, this.usersMap);
                } else {
                  setTimeout(() => (this.extraPosts = false), 1000);
                }
              }
          }, 200);

          this.$refs.home.addEventListener('scroll', debScrollBottom, false);
        });
      },
      goToPost(pid) {
        this.$router.push({
          name: 'post',
          params: {
            pid: pid,
          },
        });
      },
      async doSearch() {
        this.loading = true;
        if (this.keyword != '') {
          this.searching = true;
          this.posts = await getPosts({ approved: true, title: this.keyword }, this.orderBy[this.dropVal], this.postsToShow);
        } else {
          this.searching = false;
          this.posts = await getPosts({ approved: true }, this.orderBy[this.dropVal], this.postsToShow, null);
        }
        this.usersMap = await makeUsersMap(this.posts, this.usersMap);
        this.loading = false;
      },
      async search(searchVal, dropDownVal) {
        this.$router.push({
          name: 'home',
          query: {
            keyword: searchVal,
            order: dropDownVal,
          },
        });
      },
    },
  };
</script>

<style></style>
