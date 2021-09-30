<template>
  <div
    :key="pid"
    class="h-full"
  >
    <loader v-if="loading">
      <h1
        v-if="loadingText"
        class="text-xl font-semibold"
      >
        {{ loadingText }}
      </h1>
    </loader>

    <transition
      v-else
      name="fade-y"
      appear
    >
      <!-- //!post -->
      <div class="flex justify-start items-start flex-col w-full h-full transition duration-300 flex-shrink-0 overflow-y-auto overflow-x-hidden">
        <!-- //!poster -->
        <div
          class="select-none w-full h-auto relative transform transition duration-300 flex-shrink-0"
        >
          <loader
            v-if="imgLoading && cover"
            class="absolute"
          />
          <!-- //!upload button -->
          <transition
            name="fade-y"
            appear
          >
            <div
              v-if="inEditingMode"
              class="w-full h-full absolute top-2 z-50 pointer-events-none transform transition duration-300"
            >
              <div
                class="mx-auto max-w-min bg-gray-200 dark:bg-gray-800 rounded-xl pointer-events-auto cursor-pointer btnTransform shadow-lg flex justify-center items-center gap-2 px-2.5 py-0.5"
                @click="$refs.FileUpload.click()"
              >
                <i
                  class="ri-image-edit-fill text-lg h-full mt-1"
                  aria-hidden="true"
                />
                <h1
                  class="font-semibold text-base whitespace-nowrap"
                >
                  Edit your poster
                </h1>
              </div>

              <div
                v-if="!cover"
                class="w-full text-center text-red-400"
              >
                <h1>
                  Cover missing
                </h1>
              </div>
              
              <input
                ref="FileUpload"
                type="file"
                accept="image/*"
                hidden
                @change="fileChange($event.target.files)"
              >
            </div>
          </transition>

          <!-- //!gradient to black (contrast) -->
          <div
            class="w-full h-full absolute z-30 bg-gradient-to-b from-transparent to-black dark:to-gray-900 opacity-10 dark:opacity-80 transition-all duration-300 pointer-events-none"
          />

          <!-- //!cover image-->
          <div
            class="w-full cursor-pointer filter aspect-h-1 transition-all duration-300 z-0 overflow-hidden rounded-b-3xl sm:rounded-b-6xl"
            :class="{
              'xl:aspect-w-5 aspect-w-2 md:aspect-w-3': !inEditingMode,
              'xl:aspect-w-8 aspect-w-2 md:aspect-w-4': inEditingMode,
            }"
            @click="viewingImg = true"
          >
            <img
              v-show="cover"
              ref="postImg"
              class="object-contain h-auto w-auto"
              :src="cover"
              alt=""
              onerror="this.onerror=null;this.src='/img/icons/errorCover.jpg';"
              aria-hidden="true"
              @load="imgLoaded"
            >
          </div>
        </div>

        <!-- //!user and hosting Date -->
        <div
          class="select-none relative px-5 sm:px-10 flex py-5 md:py-0 justify-start items-center md:justify-between md:items-start w-full flex-col md:flex-row transition duration-300 pointer-events-none z-50 gap-5"
        >
          <router-link
            :to="'/profile/' + postOwner.uid"
            tag="div"
            class="transform md:-translate-y-2/3 w-full sm:w-10/12 sm:max-w-md"
          >
            <user-card
              :user-info="postOwner"
              :minimal="true"
              class="cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 pointer-events-auto"
            />
          </router-link>

          <div class="bg-gray-100 dark:bg-gray-900 py-2 transform md:-translate-y-2/3 shadow-xl rounded-xl flex justify-center items-center px-4 font-semibold">
            Hosting date:
            {{ formatedDate ? formatedDate.date + ' at ' + formatedDate.time : 'xx/xx/xxxx at xx:xx' }}
          </div>
        </div>

        <!-- //!editor -->
        <div 
          :class="{'pt-6 sm:pt-0 sm:pb-5': inEditingMode || (!inEditingMode && isEditable)}"
          class="sm:px-10 sm:mt-10 bg-gray-100 dark:bg-gray-900 w-full flex-grow rounded-t-3xl sm:rounded-t-6xl shadow-3xl relative flex justify-center items-center flex-col"
        >
          <div
            class=" flex justify-end items-center transform flex-col sm:flex-row translate-y-0 sm:-translate-y-1/2 gap-8 sm:gap-6 z-50 w-full transition-opacity duration-300"
          >
            <!-- title and date input and commit button-->

            <!-- //!title input -->
            <base-input
              v-if="inEditingMode"
              name="Title"
              class="max-w-xs"
              :lazy="200"
              size="0"
              :model-value="title"
              @update:modelValue="handleTitle"
            >
              <template
                v-if="title.length > 64"
                #msg
              >
                <i class="ri-error-warning-fill text-red-400 transform scale-125" />
                <h1 class="text-red-400">
                  Can't be more than 64 characters
                </h1>
              </template>
            </base-input>

            <!-- //!date input -->
            <DatePicker
              v-if="inEditingMode"
              v-model="pickedDate"
              :order="50"
              :dot="true"
              :min-date="new Date()"
              :class="{ hidden: !inEditingMode }"
              mode="dateTime"
              color="red"
              timezone="UTC"
              :is24hr="true"
            >
              <template #default="{ inputValue, inputEvents }">
                <base-input 
                  :no-clear="true"
                  name="Hosting Date"
                  size="0"
                  :model-value="inputValue"
                  :ro="true" 
                  v-on="inputEvents"
                >
                  <template
                    v-if="pickedDate < Date.now()"
                    #msg
                  >
                    <i class="ri-error-warning-fill text-red-400 transform scale-125" />
                    <h1 class="text-red-400">
                      Has to be a future date
                    </h1>
                  </template>
                </base-input>
              </template>
            </DatePicker>

            <div class="flex justify-end items-center flex-col sm:flex-row gap-5 sm:-mt-0">
              <!-- //!cancel button -->
              <div
                v-if="inEditingMode && post"
                class="select-none font-semibold shadow-lg px-3 py-1 bg-blue-400 text-lg border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl"
              >
                <div @click="cancel">
                  <h1>Cancel</h1>
                </div>
              </div>

              <!-- //!publish/update/edit button-->
              <div
                v-if="inEditingMode || yetToPublish || isEditable"
                class="select-none font-semibold shadow-lg px-3 py-1 bg-gray-100 dark:bg-gray-900 text-lg border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl"
              >
                <div
                  v-if="inEditingMode && yetToPublish"
                  @click="publish"
                >
                  Publish
                </div>
                <div
                  v-if="inEditingMode && !yetToPublish"
                  @click="update"
                >
                  Update
                </div>
                <div
                  v-if="!inEditingMode && isEditable"
                  @click="inEditingMode = true"
                >
                  Edit
                </div>
              </div>

              <!-- //!remove button -->
              <div
                v-if="(inEditingMode && post) || (getPrivLevel >1 && post && post.owner != getUserInfo.uid)"
                class="select-none font-semibold shadow-lg px-3 py-1 bg-red-400 text-lg border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl"
              >
                <div @click="remove">
                  <h1>Remove</h1>
                </div>
              </div>
            </div>
          </div>

          <!-- //!post section -->
          <div class="w-full h-full py-10 z-0">
            <!-- //!title -->
            <div
              :class="{
                'max-h-0': inEditingMode,
                'max-h-full pb-5': !inEditingMode,
              }"
              class="w-8/12 transition-all duration-300 mx-auto overflow-hidden"
            >
              <h1 class="w-full text-center flex-grow-0 text-5xl sm:text-6xl font-bold capitalize">
                {{ title }}
              </h1>
            </div>

            <!-- //!tiptap -->
            <Tiptap
              :class="{ 'p-0': !inEditingMode, 'pt-0': inEditingMode }"
              class="z-0 transition-all duration-300 p-0.5 flex-grow-0 flex-shrink"
              :model-value="content"
              :editable="inEditingMode || yetToPublish"
              @update:modelValue="updateContent"
            />
          </div>
        </div>

        <transition
          name="fade-y"
          appear
        >
          <div
            v-if="viewingImg && cover"
            class="absolute w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-60 absolute transition duration-300"
            @click="viewingImg = false"
          >
            <div
              class="w-full h-auto sm:h-full sm:w-auto flex items-center justify-center z-40"
              @click="viewingImg = false"
            >
              <img
                class="max-w-full max-h-full md:p-5"
                :src="cover"
                alt=""
                @click.prevent.stop
              >
            </div>
            <div class="px-8 py-4 absolute top-0 right-0 z-50">
              <i
                class="ri-close-fill text-xl p-2 bg-gray-200 dark:bg-gray-800 rounded-xl cursor-pointer"
                aria-hidden="true"
                @click="viewingImg = false"
              />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
  import UserCard from '../components/UserCard';
  import Tiptap from '../components/TipTap';
  import BaseInput from '../components/BaseInput';
  import Loader from '../components/Loader';
  import { Calendar, DatePicker } from 'v-calendar';

  import { getUserInfo as getU, createPost, uploadCover, getCWithRetry, updateCover, updatePost, removePost, getPost , fileHandler} from '../js/dbActions';
  import { formatDate } from '../utils';
  import { mapGetters } from 'vuex';

  export default {
    name: 'Post',
    components: {
      UserCard,
      Tiptap,
      BaseInput,
      Loader,
      DatePicker
    },
    props: {
      pid: String,
    },
    data() {
      return {
        loading: true,
        loadingText: null,
        content: '',
        postOwner: {},
        post: {},
        isEditable: false,
        inEditingMode: false,
        yetToPublish: false,
        pickedDate: new Date().addDays(1),
        viewingImg: false,
        displayedDate: null,
        title: 'Untitled',
        cover: null,
        imgLoading: true,
        fileToUpload: null,
        color: 'rgba(0,0,0,0)',
      };
    },
    computed: {
      ...mapGetters('user', ['getUserInfo', 'getPrivLevel', 'getToken']),
      formatedDate(){
        return formatDate(this.pickedDate);
      }
    },
    watch: {
      $route: async function () {
        if (this.$route.name == 'post') {
            this.clearData();
            await this.init();
        }
      },
    },
    async mounted() {
      await this.init();
    },
    methods: {
      clearData(){
        this.loading = true
        this.content = ''
        this.postOwner = {}
        this.post = {}
        this.isEditable = false
        this.inEditingMode = false
        this.yetToPublish = false
        this.pickedDate = new Date().addDays(1)
        this.viewingImg = false
        this.displayedDate = null
        this.title = 'Untitled'
        this.cover = null
        this.imgLoading = true
        this.fileToUpload = null
        this.color = 'rgba(0,0,0,0)'
      },
      async init(){
        this.$nextTick(async () => {
          this.post = await getPost(this.pid);
          if (this.post == null) {
            if (this.getPrivLevel > 0) {
              if (this.getToken && this.getToken == this.pid) {
                this.postOwner = this.getUserInfo;
                this.inEditingMode = true;
                this.yetToPublish = true;
                this.isEditable = true;
              } else {
                this.$router.push({ name: "error", params: { err: 'Invalid post creation token' } });
              }
            } else {
              this.$router.push({ name: "error", params: { err: 'User cannot create posts' } });
            }
          } else {
            this.postOwner = await getU(this.post.owner);
            let uri = await getCWithRetry(this.pid);
            this.cover = uri ? uri : "/img/icons/errorCover.jpg";
            //retries once on post cause the user will most probably reload the page anyway so no need for fancy code 
            if (!uri) {
              setTimeout(async () => {
                uri = await getCWithRetry(this.pid);
                this.cover = uri ? uri : "/img/icons/errorCover.jpg";
              }, 2000 );
            }
            this.content = this.post.content;
            this.title = this.post.title;
            this.pickedDate = new Date(this.post.hosting_date);
            if (this.post.owner == this.getUserInfo.uid) {
              this.isEditable = true;
            }
          }
          this.loading = false;
        }); 
      },
      handleTitle(val) {
        this.title = val;
      },
      updateContent(newVal) {
        this.content = newVal;
      },
      async publish() {
        if (this.fileToUpload && this.title.length < 65) {
          const hostingDate = this.pickedDate.getTime();
          const now = new Date();
          if (hostingDate < now.getTime() + now.getTimezoneOffset() * 60000) {
            console.error('invalid date');
          } else {
            this.loading = true;
            this.loadingText = 'Uploading post';
            this.inEditingMode = false;
            this.yetToPublish = false;
            await createPost(this.pid, this.content, this.postOwner.uid, hostingDate, this.title);
            await uploadCover(this.fileToUpload, this.pid);
            this.loading = false;
            this.loadingText = null;
          }
        } else {
          console.error('COVER MISSING');
        }
      },
      async remove() {
        this.loading = true;
        this.loadingText = 'Removing post';
        removePost(this.pid, this.post.owner);
        this.$router.push({ name: 'home' });
      },
      async update() {
        this.loading = true;
        this.loadingText = 'Updating post';
        this.inEditingMode = false;
        await updatePost(this.pid, this.content, this.pickedDate.getTime(), this.title, this.post.owner);
        if (this.fileToUpload) {
          await updateCover(this.fileToUpload, this.pid);
        }
        this.loading = false;
        this.loadingText = null;
      },
      async fileChange(f) {
        [this.fileToUpload,this.cover] = await fileHandler(f);
      },
      async imgLoaded() {
        this.imgLoading = false;
      },
      async cancel(){
        this.loading = true;
        this.inEditingMode = false;
        // this.$router.go(0);

        this.clearData();
        this.loadingText = 'Undoing edits';
        await this.init();
        this.loadingText = null;
      }
    },
  };
</script>

<style>
  [type='text']:focus,
  [type='email']:focus,
  [type='url']:focus,
  [type='password']:focus,
  [type='number']:focus,
  [type='date']:focus,
  [type='datetime-local']:focus,
  [type='month']:focus,
  [type='search']:focus,
  [type='tel']:focus,
  [type='time']:focus,
  [type='week']:focus,
  [multiple]:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgba(252, 165, 165, 1);
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
    border-color: rgba(252, 165, 165, 1);
  }
</style>