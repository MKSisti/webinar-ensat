<template>
  <div class="w-full h-full flex justify-start items-start flex-col">
    <h1 class="text-4xl sm:text-6xl font-bold px-10 py-5">
      User Data
    </h1>
    
    <div class="w-full h-full bg-gray-100 dark:bg-gray-900 rounded-t-6xl shadow-3xl overflow-y-auto overflow-x-hidden flex justify-start items-center flex-col py-10 gap-10">
      <search
        :text="text || ''"
        search-name="Search"
        :no-order="true"
        class="mx-auto"
        :float="true"
        @apply="searchForUsers"
      />
      <loader v-if="loading" />
      <div
        v-else
        class="w-full flex justify-start items-start flex-wrap px-5 sm:px-10 sm:gap-10"
      >
        <div
          v-if="usersList.length <= 0 "
          class="text-xl font-semibold w-full p-5 text-center select-none"
        >
          No items to show.
        </div>
        <transition-group
          v-else
          name="fade-y"
          appear
        >
          <div
            v-for="u in usersList"
            :key="u.uid"
            class="w-full relative transform transition duration-300 flex-none flex justify-center items-start gap-10 flex-col py-5 sm:px-5 bg-gray-100 dark:bg-gray-900 sm:rounded-3xl sm:shadow-2xl border-b-2 sm:border-b-0"
          >
            <user-card
              class="z-30"
              :minimal="true"
              :user-info="u"
            />
            <div class="flex justify-end items-center z-50 w-full">
              <div class="flex justify-center items-center flex-wrap w-full gap-y-7 gap-x-3">
                <base-input
                  :id="u.uid + 'user'"
                  size="0"
                  class="flex-shrink max-w-72"
                  name="Username"
                  :model-value="u.userName"
                  @update:modelValue="u.userName = $event"
                />

                <base-input
                  :id="u.uid + 'uni'"
                  size="0"
                  class="flex-shrink max-w-72"
                  name="University"
                  :model-value="u.uni"
                  @update:modelValue="u.uni = $event"
                />

                <base-input
                  :id="u.uid + 'num'"
                  size="0"
                  class="flex-shrink max-w-72"
                  name="Number"
                  :model-value="u.number"
                  @update:modelValue="u.number = $event"
                />

                <base-input
                  :id="u.uid + 'priv'"
                  size="0"
                  class="flex-shrink max-w-72"
                  name="privilege"
                  :model-value="u.priv"
                  :drop-down="true"
                  @update:modelValue="u.priv = $event * 1"
                >
                  <option value="-1">
                    Blocked
                  </option>
                  <option value="0">
                    Viewer
                  </option>
                  <option value="1">
                    Host
                  </option>
                  <option value="2">
                    Admin
                  </option>
                </base-input>
              </div>

              <div
                :class="{'pointer-events-none': transactionInProgress[u.uid]}"
                class="btnTransform cursor-pointer w-10 h-10 bg-green-500 rounded-xl flex justify-center items-center flex-shrink-0 relative"
                @click="update(u.uid, u.userName, u.uni, u.number, u.priv)"
                @click.prevent.stop
              >
                <transition
                  name="fade-y"
                  appear
                >
                  <i
                    v-if="!transactionInProgress[u.uid]"
                    class="ri-check-fill absolute text-xl h-0 w-0 flex justify-center items-center transform transition duration-300"
                    aria-hidden="true"
                  />
                  <div
                    v-else
                    class="w-4 h-4 absolute bg-gray-50 rounded-full transform transition duration-300 animate-ping"
                  />
                </transition>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
  import UserCard from '../components/UserCard';
  import Search from '../components/Search';
  import { getUsersFromSearch, updateUser } from '../js/dbActions';
  import BaseInput from '../components/BaseInput';
  import Loader from '../components/Loader';

  export default {
    name: 'UsersDash',
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
        transactionInProgress:{},
      };
    },
    methods: {
      async searchForUsers(t) {
        this.loading = true;
        this.text = t;
        this.usersList = await getUsersFromSearch(t);
        this.loading = false;
      },
      updateUser,
      async update(uid, userName, uni, number, priv){
        this.transactionInProgress[uid] = true;
        await updateUser(uid, userName, uni, number, priv);
        this.$emit('success','green','User has been updated');
        this.transactionInProgress[uid] = false;
      }
    },
  };
</script>

<style></style>
