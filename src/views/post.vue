<template>
  <div class="h-full">
    <loader v-if="loading" />

    <transition v-else name="fade-y" appear>
      <!-- post -->
      <div
        class="flex justify-start items-start flex-col space-y-20 w-full h-full overflow-auto transition duration-300"
      >
        <!-- post img -->
        <div class="w-full h-auto relative">
          <div
            :style="viewingImg ? 'opacity:0!important' : ''"
            :class="{ 'rounded-b-6xl': !viewingImg }"
            class="w-full h-full absolute z-30 bg-gradient-to-b from-transparent via-transparent to-black opacity-10 transition-all duration-300 pointer-events-none"
          ></div>
          <div
            class="w-full cursor-pointer aspect-w-8 aspect-h-1 transition-all duration-300 z-0 overflow-hidden"
            :class="{ viewingImg: viewingImg, 'rounded-b-6xl': !viewingImg }"
            @click="viewingImg = !viewingImg"
          >
            <img
              class="w-full object-contain h-auto"
              src="https://encapstore.com/wp-content/uploads/2019/06/banner-test.jpg"
            />
          </div>

          <!-- poster and hosting Date -->
          <div
            :class="{ 'opacity-0': viewingImg }"
            class="absolute px-10 flex justify-between items-start w-full transition duration-300 pointer-events-none z-50"
          >
            <router-link
              :to="'/profile/' + postOwner.uid"
              tag="div"
              class="transform -translate-y-2/3"
            >
              <user-card
                :class="{ 'pointer-events-auto': !viewingImg }"
                :userInfo="postOwner"
                :minimal="true"
                class="cursor-pointer transform hover:-translate-y-2 transition duration-300"
            /></router-link>

            <div
              class=" bg-gray-100 h-10 transform -translate-y-2/3 shadow-xl rounded-xl flex justify-center items-center px-5 font-semibold"
            >
              Hosting date: {{displayedDate ? displayedDate.date+ " at " + displayedDate.time : "xx/xx/xxxx at xx:xx"}}
            </div>
          </div>
        </div>

        <!-- editor -->
        <div
          class="px-10 py-5 bg-gray-100 w-full h-full rounded-t-6xl shadow-3xl relative space-y-10 pb-20"
        >
          <div
            class="top-0 absolute right-20 flex justify-end items-center transform -translate-y-1/2 gap-x-4 z-50 w-full"
          >
            <!-- title and date input and commit button-->
            <div
              :class="{ hidden: !inEditingMode }"
              class="w-2/12 flex items-center justify-start relative ml-32"
            >
              <base-input
                name="Title"
                :lazy="200"
                size="0"
                :modelValue="title"
                @update:modelValue="handleTitle"
              />
            </div>
            <div :class="{ hidden: !inEditingMode }" class="relative">
              <div
                class="absolute top-0 z-50 transform -translate-y-1/2 bg-gray-50 left-4 font-semibold text-sm rounded-full px-px"
              >
                Hosting date
              </div>
              <datepicker
                class="outline-none shadow-2xl focus:outline-none rounded-2xl font-semibold z-0 bg-gray-50 w-48"
                v-model="pickedDate"
              />
            </div>

            <div :class="{ hidden: !inEditingMode }" class="relative">
              <div
                class="absolute top-0 z-50 transform -translate-y-1/2 bg-gray-50 left-3 font-semibold text-sm rounded-full px-px"
              >
                Hosting time
              </div>
              <vue-timepicker
                format="HH:mm"
                v-model="pickedTime"
                :blur-delay="150"
                class="outline-none shadow-2xl focus:outline-none rounded-2xl font-semibold z-0 bg-gray-50"
                manual-input
              ></vue-timepicker>
            </div>

            <!-- //? this button can change its text from edit/update and publish to match the action, edit can toggle edit ... -->
            <div
              @click="publish"
              v-if="inEditingMode && yetToPublish"
              class="bg-gray-100 shadow-2xl px-4 py-2 text-3xl font-bold border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl"
            >
              Publish
            </div>
            <div
              @click="update"
              v-if="inEditingMode && !yetToPublish"
              class="bg-gray-100 shadow-2xl px-4 py-2 text-3xl font-bold border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl"
            >
              Update
            </div>
            <div
              @click="inEditingMode = true"
              v-if="!inEditingMode && isEditable"
              class="bg-gray-100 shadow-2xl px-4 py-2 text-3xl font-bold border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl"
            >
              Edit
            </div>
          </div>

          <!-- well it's tiptap, duh -->
          <Tiptap
            class="z-0"
            @update:modelValue="updateContent"
            :modelValue="content"
            :editable="inEditingMode || yetToPublish"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import UserCard from "../components/UserCard";
import Tiptap from "../components/TipTap";
import Datepicker from "vue3-datepicker";
import VueTimepicker from "vue3-timepicker";
import BaseInput from "../components/BaseInput";
import Loader from "../components/Loader";

import { getPost, getUserInfo as getU, createPost } from "../js/firebaseActions";
import { formatDate } from "../utils";
import { mapGetters } from "vuex";

export default {
  name: "Post",
  props: {
    pid: String
  },
  components: {
    UserCard,
    Tiptap,
    Datepicker,
    VueTimepicker,
    BaseInput,
    Loader
  },
  data() {
    return {
      loading: true,
      content: "",
      postOwner: {},
      post: {},
      isEditable: false,
      inEditingMode: false,
      yetToPublish: false,
      pickedDate: new Date(),
      viewingImg: false,
      pickedTime: null,
      displayedDate: null,
      title: "Untitled",
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"])
  },
  methods: {
    handleTitle(val) {
      this.title = val;
    },
    updateContent(newVal) {
      this.content = newVal;
    },
    async publish() {
      this.pickedDate.setHours(
        this.pickedTime.HH != "" ? this.pickedTime.HH * 1 : 0,
        this.pickedTime.mm != "" ? this.pickedTime.mm * 1 : 0,
        0
      );

      let hostingDate =
        this.pickedDate.getTime() + this.pickedDate.getTimezoneOffset() * 60000;

      this.inEditingMode = false;
      this.yetToPublish = false;
      await createPost(this.pid, this.content, this.postOwner.uid, hostingDate, this.title);
    },
    update() {
      this.inEditingMode = false;
      //TODO update logic
    }
  },
  async mounted() {
    this.post = await getPost(this.pid);
    if (this.post == null) {
      this.postOwner = this.getUserInfo;
      this.inEditingMode = true;
      this.yetToPublish = true;
      this.isEditable = true;
    } else {
      this.postOwner = await getU(this.post.owner);
      this.content = this.post.content;
      this.title = this.post.title;
      this.displayedDate = formatDate(this.post.hosting_date);
      console.log(this.displayedDate);
      this.pickedDate = new Date(this.post.hosting_date);
      if (this.post.owner == this.getUserInfo.uid) {
        this.isEditable = true;
      }
    }
    this.loading = false;
    console.log(this.postOwner.img);
  }
};
</script>

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

[type="text"]:focus,
[type="email"]:focus,
[type="url"]:focus,
[type="password"]:focus,
[type="number"]:focus,
[type="date"]:focus,
[type="datetime-local"]:focus,
[type="month"]:focus,
[type="search"]:focus,
[type="tel"]:focus,
[type="time"]:focus,
[type="week"]:focus,
[multiple]:focus,
textarea:focus,
select:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty, /*!*/ /*!*/);
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgba(252, 165, 165, 1);
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
    var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
    calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow, 0 0 #0000);
  border-color: rgba(252, 165, 165, 1);
}

.viewingImg {
  @apply aspect-w-4 aspect-h-1 rounded-none;
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
