<template>
  <div class="flex justify-start items-start flex-col space-y-20 w-full h-full">
    <div class="flex-shrink-0 w-full h-auto relative">
      <img class="aspect-w-4 aspect-h-1 bg-black flex-shrink-0" src="" alt="" />
      <div
        class="absolute transform -translate-y-28 px-10 flex justify-between items-center w-full"
      >
        <user-card :userInfo="postOwner" />
        <div
          class=" bg-gray-100 h-10 shadow-xl rounded-xl flex justify-center items-center px-5 font-semibold"
        >
          Hosting date: xx/xx/xxxx at xx:xx
        </div>
      </div>
    </div>
    <div
      class="px-10 py-5 bg-gray-100 w-full h-full rounded-t-6xl shadow-3xl relative"
    >
      <div
        class="top-0 absolute right-20 flex justify-center items-center space-x-4 transform -translate-y-1/2 z-50"
      >
        <div class="relative">
          <div class="absolute top-0 z-50 transform -translate-y-1/2 bg-gray-50 left-4 font-semibold text-sm rounded-full px-px">Hosting date</div>
          <datepicker
            class="outline-none shadow-2xl focus:outline-none rounded-2xl font-semibold z-0 bg-gray-50"
            v-model="pickedDate"
          />
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

      <Tiptap
        class="z-0"
        @update:modelValue="updateContent"
        :modelValue="content"
        :editable="inEditingMode"
      />
    </div>
  </div>
</template>

<script>
import UserCard from "../components/UserCard";
import Tiptap from "../components/TipTap";
import { getPost, getUserInfo, createPost } from "../js/firebaseActions";
import { mapGetters } from "vuex";
import Datepicker from "vue3-datepicker";

export default {
  name: "Post",
  props: {
    pid: String
  },
  components: {
    UserCard,
    Tiptap,
    Datepicker
  },
  data() {
    return {
      content: "",
      postOwner: null,
      post: null,
      isEditable: false,
      inEditingMode: false,
      yetToPublish: false,
      pickedDate: new Date(),
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"])
  },
  methods: {
    updateContent(newVal) {
      // console.log('new content');
      this.content = newVal;
      console.log(newVal);
    },
    async publish() {
      let hostingDate = this.pickedDate.getTime() + this.pickedDate.getTimezoneOffset() * 60000;

      this.inEditingMode = false;
      this.yetToPublish = false;
      await createPost(
        this.pid,
        this.content,
        this.postOwner,
        hostingDate
      );
    },
    update() {
      this.inEditingMode = false;
    }
  },
  async created() {
    this.post = await getPost(this.pid);
    if (this.post == null) {
      this.postOwner = this.getUserInfo;
      this.inEditingMode = true;
      this.yetToPublish = true;
      this.isEditable = true;
    } else {
      this.owner = await getUserInfo(this.post.owner);
      this.content = this.post.content;
      if (this.post.owner == this.getUserInfo.uid) {
        this.isEditable = true;
      }
    }
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
</style>
