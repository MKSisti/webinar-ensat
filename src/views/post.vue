<template>
  <div
    :key="pid"
    class="h-full"
  >
    <loader v-if="loading" />

    <transition
      v-else
      name="fade-y"
      appear
    >
      <!-- //!post -->
      <div class="flex justify-start items-start flex-col w-full h-full transition duration-300 flex-shrink-0 overflow-auto">
        <!-- //!poster -->
        <div
          :class="{ 'translate-y-5': viewingImg }"
          class="w-full h-auto relative transform transition duration-300 flex-shrink-0"
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
              v-if="inEditingMode && !viewingImg"
              class="w-full h-full absolute top-2 z-50 pointer-events-none transform transition duration-300"
            >
              <div
                class="w-10 h-10 mx-auto bg-gray-200 rounded-xl pointer-events-auto cursor-pointer btnTransform shadow-lg"
                @click="$refs.FileUpload.click()"
              >
                <i
                  class="fa fa-arrow-down text-2xl w-full h-full text-center mt-1"
                  aria-hidden="true"
                />
              </div>
              <h1
                v-if="!fileToUpload || !cover"
                class="text-center font-bold text-xl sm:text-2xl p-4"
              >
                Upload your poster
              </h1>
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
            :style="viewingImg ? 'opacity:0!important' : ''"
            :class="{ 'rounded-b-3xl sm:rounded-b-6xl': !viewingImg }"
            class="w-full h-full absolute z-30 bg-gradient-to-b from-transparent via-transparent to-black opacity-10 transition-all duration-300 pointer-events-none"
          />

          <!-- //!cover image-->
          <div
            class="w-full cursor-pointer filter aspect-h-1 transition-all duration-300 z-0 overflow-hidden"
            :class="{
              viewingImg: viewingImg,
              'xl:aspect-w-5 aspect-w-2 md:aspect-w-3': !inEditingMode,
              'xl:aspect-w-8 aspect-w-2 md:aspect-w-4': inEditingMode,
              'rounded-b-3xl sm:rounded-b-6xl': !viewingImg,
            }"
            @click="viewingImg = !viewingImg"
          >
            <img
              v-show="cover"
              ref="postImg"
              :class="{ 'rounded-3xl': viewingImg }"
              class="object-contain h-auto w-auto"
              :src="cover"
              alt=""
              crossorigin="anonymous"
              aria-hidden="true"
              @load="imgLoaded"
            >
          </div>
        </div>

        <!-- //!user and hosting Date -->
        <div
          :class="{ obstructingImg: viewingImg}"
          class="relative px-5 sm:px-10 flex py-5 md:py-0 justify-start items-center md:justify-between md:items-start w-full flex-col md:flex-row transition duration-300 pointer-events-none z-50 gap-5"
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

          <div class="bg-gray-100 h-10 transform md:-translate-y-2/3 shadow-xl rounded-xl flex justify-center items-center px-5 font-semibold">
            Hosting date:
            {{ formatedDate ? formatedDate.date + ' at ' + formatedDate.time : 'xx/xx/xxxx at xx:xx' }}
          </div>
        </div>

        <!-- //!editor -->
        <div 
          :class="{'pt-5 sm:pb-5': inEditingMode || (!inEditingMode && isEditable)}"
          class="sm:px-10 sm:mt-10 bg-gray-100 w-full flex-grow rounded-t-3xl sm:rounded-t-6xl shadow-3xl relative flex justify-center items-center flex-col"
        >
          <div
            :class="{ obstructingImg: viewingImg }"
            class=" flex justify-end items-center transform flex-col sm:flex-row translate-y-0 sm:-translate-y-full gap-7 z-50 w-full transition-opacity duration-300"
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
            />

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
                />
              </template>
            </DatePicker>

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
              class="select-none font-semibold shadow-lg px-3 py-1 bg-gray-100 text-lg border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl"
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
              v-if="inEditingMode && post"
              class="select-none font-semibold shadow-lg px-3 py-1 bg-red-400 text-lg border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl"
            >
              <div @click="remove">
                <h1>Remove</h1>
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
      </div>
    </transition>
  </div>
</template>

<script>
  import UserCard from '../components/UserCard';
  import Tiptap from '../components/TipTap';
  import BaseInput from '../components/BaseInput';
  import Loader from '../components/Loader';
  const ColorThief = require('colorthief').default;
  import { Calendar, DatePicker } from 'v-calendar';

  import { getUserInfo as getU, createPost, uploadCover, getCI2, updateCover, updatePost, removePost, getPost } from '../js/dbActions';
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
        content: '',
        postOwner: {},
        post: {},
        isEditable: false,
        inEditingMode: false,
        yetToPublish: false,
        pickedDate: new Date(),
        viewingImg: false,
        displayedDate: null,
        title: 'Untitled',
        cover: null,
        imgLoading: true,
        fileToUpload: null,
        palette: new ColorThief(),
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
        if (this.$route.name == 'post') 
          this.clearData();
          await this.init();
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
        this.pickedDate = new Date()
        this.viewingImg = false
        this.displayedDate = null
        this.title = 'Untitled'
        this.cover = null
        this.imgLoading = true
        this.fileToUpload = null
        this.palette = new ColorThief()
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
              this.$router.push({ name: 'home' });
            }
          } else {
            this.$router.push({ name: 'home' });
          }
        } else {
          this.postOwner = await getU(this.post.owner);
          this.cover = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(await getCI2(this.pid));
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
      publish() {
        if (this.fileToUpload) {
          const hostingDate = this.pickedDate.getTime();
          const now = new Date();
          if (hostingDate < now.getTime() + now.getTimezoneOffset() * 60000) {
            console.error('invalid date');
          } else {
            this.inEditingMode = false;
            this.yetToPublish = false;
            createPost(this.pid, this.content, this.postOwner.uid, hostingDate, this.title);
            uploadCover(this.fileToUpload, this.pid);
          }
        } else {
          console.error('COVER MISSING');
        }
      },
      async remove() {
        await removePost(this.pid, this.owner);
        this.$router.push({ name: 'home' });
      },
      update() {
        this.inEditingMode = false;
        updatePost(this.pid, this.content, this.pickedDate.getTime(), this.title);
        if (this.fileToUpload) {
          updateCover(this.fileToUpload, this.pid);
        }
      },
      fileChange(f) {
        if (f[0] && f[0].type.split('/')[0] == 'image') {
          this.fileToUpload = f[0];
          var reader = new FileReader();
          reader.onload = (e) => {
            this.cover = e.target.result;
          };
          reader.readAsDataURL(f[0]);
        }
      },
      async imgLoaded() {
        this.imgLoading = false;
        try {
          this.color = await this.palette.getColor(this.$refs.postImg);
          this.color = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},1)`;
          document.documentElement.style.setProperty('--cs', this.color);
        } catch (e) {
          console.warn(e);
        }
      },
      cancel(){
        this.loading = true;
        this.inEditingMode = false;
        this.$router.go(0);
      }
    },
  };
</script>

<style>
  .bg-dyn {
    --cs: rgba(0, 0, 0, 0);
    transition: --cs 2000ms ease;
    background: radial-gradient(var(--cs), transparent 60%);
    background-position-y: -350px;
    background-position-x: center;
    background-size: 90% 700px;
    background-repeat: no-repeat;
  }

  .viewingImg {
    @apply aspect-w-1 md:aspect-w-3 xl:aspect-w-4 aspect-h-1 rounded-none drop-shadow-2xl;
  }

  .obstructingImg {
    @apply sm:opacity-0 sm:pointer-events-none;
  }
</style>

<style>
  :root {
    --vdp-bg-color: rgba(243, 244, 246, 1);
    --vdp-text-color: rgba(31, 41, 55, 1);
    --vdp-box-shadow: 0 17px 50px -12px rgba(0, 0, 0, 0.25);
    --vdp-border-radius: 1rem;
    --vdp-heading-size: 2.5em;
    --vdp-heading-weight: bold;
    --vdp-heading-hover-color: #eeeeee;
    --vdp-arrow-color: currentColor;
    --vdp-elem-color: currentColor;
    --vdp-disabled-color: #d5d9e0;
    --vdp-hover-color: #ffffff;
    --vdp-hover-bg-color: rgba(252, 165, 165, 1);
    --vdp-selected-color: #ffffff;
    --vdp-selected-bg-color: rgba(252, 165, 165, 1);
    --vdp-elem-font-size: 0.8em;
    --vdp-elem-border-radius: 0.375rem;
    --vdp-divider-color: #d5d9e0;
  }

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

<style>
  .vue__time-picker {
    display: inline-block;
    position: relative;
    font-size: 1em;
    width: 8em;
    vertical-align: middle;
    @apply font-semibold;
  }
  .vue__time-picker * {
    box-sizing: border-box;
  }
  .vue__time-picker input.vue__time-picker-input {
    width: 8em;
    height: 2.2em;
    padding: 0.3em 0.5em;
    font-size: 1em;
    @apply ring-1 ring-gray-800 rounded-xl border-0 font-semibold;
  }
  .vue__time-picker input.has-custom-icon {
    padding-left: 1.8em;
  }
  .vue__time-picker input.vue__time-picker-input.invalid:not(.skip-error-style) {
    border-color: #c03;
    @apply ring-red-400 outline-none border-0;
  }
  .vue__time-picker input.vue__time-picker-input.disabled,
  .vue__time-picker input.vue__time-picker-input:disabled {
    @apply text-gray-400;
  }
  .vue__time-picker .controls {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 3;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: stretch;
    pointer-events: none;
  }
  .vue__time-picker .controls > * {
    cursor: pointer;
    width: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 0 0.35em;
    color: #d2d2d2;
    line-height: 100%;
    font-style: normal;
    pointer-events: auto;
    transition: color 0.2s, opacity 0.2s;
  }
  .vue__time-picker .controls > :hover {
    @apply text-gray-700;
  }
  .vue__time-picker .controls > :active,
  .vue__time-picker .controls > :focus {
    outline: 0;
  }
  .vue__time-picker .controls .char {
    font-size: 1.1em;
    line-height: 100%;
    -webkit-margin-before: -0.15em;
  }
  .vue__time-picker .custom-icon {
    z-index: 2;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1.8em;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  }
  .vue__time-picker .controls img,
  .vue__time-picker .controls svg,
  .vue__time-picker .custom-icon img,
  .vue__time-picker .custom-icon svg {
    display: inline-block;
    vertical-align: middle;
    margin: 0;
    border: 0;
    outline: 0;
    max-width: 1em;
    height: auto;
  }
  .vue__time-picker .time-picker-overlay {
    z-index: 4;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .vue__time-picker .dropdown {
    position: absolute;
    z-index: 5;
    top: calc(2.2em + 2px);
    left: 0;
    background: #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
    width: 10em;
    height: 10em;
    font-weight: 400;
    @apply rounded-2xl shadow-2xl overflow-hidden;
  }
  .vue__time-picker .dropdown.drop-up {
    top: auto;
    bottom: calc(2.2em + 1px);
  }
  .vue__time-picker .dropdown .select-list {
    width: 10em;
    height: 10em;
    @apply flex justify-between items-stretch flex-row flex-nowrap overflow-hidden;
  }
  .vue__time-picker .dropdown .select-list:active,
  .vue__time-picker .dropdown .select-list:focus {
    @apply outline-none;
  }
  .vue__time-picker .dropdown ul {
    padding: 0;
    margin: 0;
    list-style: none;
    outline: 0;
    flex: 1 1 0.00001px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .vue__time-picker .dropdown ul.apms,
  .vue__time-picker .dropdown ul.minutes,
  .vue__time-picker .dropdown ul.seconds {
    @apply border-l-2 border-white;
  }
  .vue__time-picker .dropdown ul li {
    list-style: none;
    @apply list-none text-center px-2 text-gray-800;
  }
  .vue__time-picker .dropdown ul li:not(.hint):not([disabled]):focus,
  .vue__time-picker .dropdown ul li:not(.hint):not([disabled]):hover {
    @apply cursor-pointer text-gray-800 bg-black bg-opacity-5;
  }
  .vue__time-picker .dropdown ul li:not([disabled]).active,
  .vue__time-picker .dropdown ul li:not([disabled]).active:focus,
  .vue__time-picker .dropdown ul li:not([disabled]).active:hover {
    @apply text-white bg-red-300;
  }
  .vue__time-picker .dropdown ul li[disabled],
  .vue__time-picker .dropdown ul li[disabled]:hover {
    @apply bg-transparent opacity-30 cursor-not-allowed;
  }
  .vue__time-picker .dropdown .hint {
    @apply text-gray-500 cursor-default text-sm;
  }
</style>
