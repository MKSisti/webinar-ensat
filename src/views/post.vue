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
    <div class="px-10 py-5 bg-gray-100 w-full h-full rounded-t-6xl shadow-3xl relative">
      <!-- //? this button can change its text from edit/update and publish to match the action, edit can toggle edit ... -->
      <div
      @click="publish"
        v-if="inEditingMode && yetToPublish"
        class="top-0 absolute bg-gray-100 shadow-2xl right-20 px-4 py-2 text-3xl font-bold border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl transform -translate-y-1/2"
      >
        Publish
      </div>
      <div
      @click="update"
        v-if="inEditingMode && !yetToPublish"
        class="top-0 absolute bg-gray-100 shadow-2xl right-20 px-4 py-2 text-3xl font-bold border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl transform -translate-y-1/2"
      >
        Update
      </div>
      <div
        @click="inEditingMode = true"
        v-if="!inEditingMode && isEditable"
        class="top-0 absolute bg-gray-100 shadow-2xl right-20 px-4 py-2 text-3xl font-bold border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl transform -translate-y-1/2"
      >
        Edit
      </div>
      <Tiptap @update:modelValue="updateContent" :modelValue="content" :editable="inEditingMode" />
    </div>
  </div>
</template>

<script>
import UserCard from "../components/UserCard";
import Tiptap from "../components/TipTap";
import { getPost, getUserInfo, createPost } from "../js/firebaseActions";
import { mapGetters } from "vuex";

export default {
  name: "Post",
  props: {
    pid: String,
  },
  components: {
    UserCard,
    Tiptap,
  },
  data() {
    return {
      content:'',
      hostingdate: null,
      postOwner: null,
      post: null,
      isEditable: false,
      inEditingMode: false,
      yetToPublish: false,
    };
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
  },
  methods:{
    updateContent(newVal){
      // console.log('new content');
      this.content = newVal;
      console.log(newVal);
    },
    async publish(){
      this.inEditingMode = false;
      this.yetToPublish = false;
      await createPost(this.pid, this.content, this.postOwner, this.hostingdate);
    },
    update(){
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
  },
};
</script>

<style></style>
