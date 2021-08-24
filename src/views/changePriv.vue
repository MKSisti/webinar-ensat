<template>
  <div class="w-full h-full flex justify-start items-start flex-col overflow-auto gap-5">
    <h1 class="text-6xl font-bold px-10 py-5">User privileges</h1>
    <search @apply="searchForUsers" :text="text || ''" searchName="Search by name" :noOrder="true" class="bg-gray-50 md:bg-gray-100 m-auto" />
    <div class="w-full h-full bg-gray-100 rounded-t-6xl shadow-3xl overflow-auto">
      <loader v-if="loading" />
      <div v-else class="overflow-auto flex justify-start items-start flex-wrap px-10 py-20 gap-5">
        <div :key="u.uid" v-for="u in usersList" class="w-full relative flex-none">
          <div class="right-0 top-0 bottom-0 absolute flex justify-end items-center z-50 gap-2 pr-4">
            <base-input :modelValue="u.priv" @update:modelValue="u.priv = $event * 1" :dropDown="true">
              <option value="-1">Blocked</option>
              <option value="0">Viewer</option>
              <option value="1">Host</option>
              <option value="2">Admin</option>
            </base-input>
            <div
              @click="update(u.uid, u.priv)"
              class="btnTransform cursor-pointer w-10 h-10 bg-green-400 rounded-xl flex justify-center items-center flex-shrink-0"
            >
              <i class="fa fa-check text-xl h-0 w-0 flex justify-center items-center" aria-hidden="true"></i>
            </div>
          </div>
          <user-card class="z-30" :minimal="true" :userInfo="u" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import UserCard from '../components/UserCard';
  import Search from '../components/Search';
  import { getUsersFromSearch, updatePriv } from '../js/dbActions';
  import BaseInput from '../components/BaseInput';
  import Loader from '../components/Loader';

  export default {
    name: 'usersDash',
    components: {
      UserCard,
      Search,
      BaseInput,
      Loader,
    },
    data() {
      return {
        usersList: [],
        text: '',
        loading: false,
      };
    },
    methods: {
      async searchForUsers(t) {
        this.loading = true;
        this.text = t;
        this.usersList = await getUsersFromSearch(t);
        this.loading = false;
      },
      async update(uid, dropVal) {
        await updatePriv(uid, dropVal);
      },
    },
  };
</script>

<style></style>
