<template>
  <transition name="fade-y" appear>
    <div class="w-full h-full transition duration-300">
      <div
        class="w-full h-full flex justify-start items-start flex-col space-y-10"
      >
        <!-- //TODO user card needs to be a component-->
        <div
          class="
            flex
            w-full
            sm:w-10/12 sm:max-w-xl
            justify-center
            items-center
            sm:px-10
            pt-10
            mb-0
          "
        >
          <user-card :userInfo="userInfo" :editable="true" />
        </div>

        <transition name="fade" appear>
          <div
            class="
              w-full
              h-full
              transition-opacity
              duration-300
              bg-gray-100
              flex
              justify-start
              items-start
              flex-col
              space-y-5
              rounded-t-6xl
              shadow-3xl
              overflow-auto
            "
            v-if="userInfo.priv >= 1"
          >
            <div class="text-7xl font-bold px-10">Posts</div>
            <!-- //!Create post button -->
            <div
              @click="goToCreate"
              class="flex justify-center items-center space-x-2 px-10"
            >
              <div
                class="
                  flex-grow-0 flex
                  justify-start
                  items-center
                  bg-gray-100
                  rounded-2xl
                  shadow-xl
                  overflow-hidden
                  group
                  duration-300
                  cursor-pointer
                  btnRing
                  px-4
                  py-3
                  space-x-3
                  relative
                  flex-shrink-0
                "
              >
                <i
                  class="
                    fa fa-file-o
                    flex-shrink-0 flex
                    items-center
                    justify-center
                    text-3xl
                    transition
                    transform
                    duration-300
                    group-hover:-translate-y-1
                    mt-px
                    ml-px
                  "
                  aria-hidden="true"
                ></i>
                <h1
                  class="
                    text-2xl
                    font-semibold
                    flex-shrink-0
                    transition
                    transform
                    group-hover:-translate-y-1
                    -mt-0.5
                    duration-300
                    pl-1
                  "
                >
                  Write a post
                </h1>
              </div>
            </div>

            <div class="w-full h-full">
              <div class="w-full h-full flex-col text-4xl text-gray-500">
                <div
                  class="
                    w-full
                    sm:px-8
                    xl:px-0
                    flex flex-row
                    justify-around
                    items-start
                    flex-wrap
                    gap-y-10
                    py-10
                  "
                >
                  <transition-group
                    v-if="userPosts.length > 0"
                    name="fade-y"
                    appear
                  >
                    <post-card
                      class="transform transition duration-300 max-w-2xl"
                      :key="p.pid"
                      v-for="p of userPosts"
                      :post="p"
                      :userData="userInfo"
                      @click="goToPost(p.pid)"
                    />
                  </transition-group>
                  <div v-else>Feels empty in here 😢</div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="
              w-full
              h-full
              transition-opacity
              duration-300
              bg-gray-100
              flex
              justify-start
              items-center
              flex-col
              rounded-t-6xl
              shadow-3xl
              overflow-auto
            "
            v-else
          >
            <div
              v-if="!awaitingApproval && userInfo.priv == 0"
              class="
                flex
                justify-start
                items-center
                flex-col
                h-full
                p-5
                space-y-3
              "
            >
              <h1 class="text-4xl font-bold">
                You don't have the necessary privilege to post
              </h1>
              <h2 class="text-xl font-semibold">
                please fill the necessary details to complete your account
              </h2>
              <div class="py-20 space-y-10">
                <base-input
                  size="4"
                  :modelValue="univ"
                  lazy="200"
                  @update:modelValue="handleUniv"
                  name="University"
                ></base-input>
                <div class="flex justify-center items-center gap-x-2">
                  <div
                    class="
                      h-14
                      w-28
                      text-2xl
                      font-semibold
                      flex
                      justify-center
                      items-center
                      rounded-2xl
                      bg-gray-200
                      pb-1
                    "
                  >
                    (+212)
                  </div>
                  <base-input
                    size="4"
                    :modelValue="number"
                    lazy="200"
                    @update:modelValue="handleNumber"
                    name="Phone Number"
                    :numeric="true"
                  ></base-input>
                </div>
                <div
                  @click="submit"
                  class="
                    w-5/12
                    h-12
                    bg-red-100
                    rounded-2xl
                    flex
                    justify-center
                    items-center
                    cursor-pointer
                    btnRing
                    mx-auto
                  "
                  tabindex="-1"
                >
                  <h1
                    class="
                      text-2xl
                      font-bold
                      mb-1
                      transition
                      duration-300
                      transform
                    "
                  >
                    Submit
                  </h1>
                </div>
              </div>
            </div>
            <div
              v-else-if="awaitingApproval && userInfo.priv == 0"
              class="
                flex
                justify-center
                items-center
                flex-col
                h-full
                p-20
                space-y-3
              "
            >
              <h1 class="text-4xl font-bold text-center">
                We are currently processing your profile
              </h1>
              <h2 class="text-xl font-semibold">
                Please come back at a later date
              </h2>
            </div>
            <div
              v-if="userInfo.priv < 0"
              class="
                flex
                justify-center
                items-center
                flex-col
                h-full
                p-20
                space-y-3
              "
            >
              <h1 class="text-4xl font-bold text-center">
                You can no longer Post here. Contact an admin to learn more
              </h1>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import {
  getUser,
  requestHost,
  checkUserInwaitingRoom,
  getPosts,
} from "../js/dbActions.js";
import UserCard from "../components/UserCard";
import PostCard from "../components/PostCard";
import BaseInput from "../components/BaseInput";
import { mapActions } from "vuex";
import { BSON } from "realm-web";

export default {
  name: "profile",
  props: ["uid"],
  components: {
    UserCard,
    PostCard,
    BaseInput,
  },
  data() {
    return {
      userInfo: {},
      userPosts: [],
      becomingHost: false,
      editingProfile: false,
      univ: "",
      number: "",
      awaitingApproval: false,
    };
  },
  methods: {
    goToCreate() {
      let token = BSON.ObjectID();
      this.updateToken(token);
      this.$router.push({ name: "post", params: { pid: token } });
    },
    goToPost(pid) {
      this.$router.push({ name: "post", params: { pid: pid } });
    },
    handleUniv(val) {
      this.univ = val;
    },
    handleNumber(val) {
      this.number = val;
    },
    submit() {
      requestHost(this.uid, this.univ, this.number);
      this.awaitingApproval = true;
    },
    ...mapActions("user", ["updateToken"]),
  },
  async created() {
    this.$nextTick(async () => {
      this.userInfo = await getUser(this.uid);
      if (this.userInfo.priv >= 1)
        this.$nextTick(async () => {
          this.userPosts = await getPosts({ owner: this.uid });
        });
      this.awaitingApproval = await checkUserInwaitingRoom(this.uid);
    });
  },
  async mounted() {},
};
</script>

<style scoped>
.btnRing {
  @apply ring-0 ring-red-300 ring-opacity-0 transition-all duration-300;
}

.btnRing:hover {
  @apply ring-2 ring-opacity-100;
}
</style>
