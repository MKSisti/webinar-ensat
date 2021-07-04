<template>
  <div class="w-full h-full">
    <div class="w-full h-full bg-black p-10">
      <div class="h-28 w-116 relative">
        <div
          class="w-100 h-full bg-gray-100 z-10 absolute flex justify-start items-center rounded-3xl"
        >
          <div class="h-full flex justify-center items-center px-4">
            <img :src="userInfo.img" alt="avatar" class="rounded-full w-full" />
          </div>
          <div class="flex justify-center items-start flex-col">
            <h1 class="text-3xl font-bold">{{ userInfo.userName }}</h1>
            <h2 class="text-xl font-semibold">{{ userInfo.email }}</h2>
          </div>
        </div>
        <div class="w-100 pt-28 bg-gray-200 absolute z-0 rounded-3xl">
          <div class="w-full flex justify-around items-center py-1">
            <h3 class="font-semibold max-w-full truncate flex-shrink-0">
              {{getAbbreviation("ecole national des science applique tanger")}} 
            </h3>
            <h3 class="max-w-full truncate flex-shrink-0">
              +(212)655554244
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
import { getUser } from "../js/firebaseActions.js";
import { getAbbreviation } from "../utils";

export default {
  name: "profile",
  props: ["uid"],
  data() {
    return {
      userInfo: {},
      tags: ["user", "host", "admin"],
      colors: ["yellow", "green?", "white"],
      becomingHost: false
    };
  },
  methods:{
    getAbbreviation,
  },
  computed: {
    tag() {
      return this.userInfo?.p ? this.tags[this.userInfo.priv] : "";
    },
  },
  async created() {
    this.$nextTick(async () => {
      this.userInfo = await getUser(this.uid);
    });
  },
  components: {
    // BaseInput
  }
};
</script>

<style></style>
