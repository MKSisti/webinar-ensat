<template>
  <div
    :class="{'shadow-2xl rounded-3xl': float}"
    class="sm:shadow-2xl sm:rounded-3xl py-6 sm:py-8 px-4 sm:px-6 bg-gray-100 dark:bg-gray-900"
    @keypress.enter="apply"
  >
    <div
      :class="{ 'flex-col': !noOrder }"
      class="w-full flex justify-center items-center gap-6 sm:gap-8"
    >
      <!-- //!search top section -->
      <div
        :class="{ 'w-full': !noOrder }"
        class="flex flex-col justify-center items-start relative"
      >
        <base-input
          :name="searchName || 'Search'"
          :model-value="search"
          size="0"
          @update:modelValue="handleSearch"
          @clear="clear"
        />
      </div>

      <!-- //!search bottom section -->
      <div
        :class="{ 'w-full': !noOrder }"
        class="flex justify-between flex-grow items-center gap-x-2"
      >
        <div
          v-if="!noOrder"
          class="flex flex-col flex-grow justify-center items-start relative"
        >
          <base-input
            name="Order By"
            :model-value="dropDown"
            size="0"
            drop-down="true"
            @update:modelValue="handleDropdown"
          >
            <option value="0">
              Hosting Date asc
            </option>
            <option value="1">
              Hosting Date desc
            </option>
            <option value="2">
              Creation Date asc
            </option>
            <option value="3">
              Creation Date desc
            </option>
            <option value="4">
              Title asc
            </option>
            <option value="5">
              Title desc
            </option>
          </base-input>
        </div>

        <div
          class="bg-red-100 dark:bg-red-400 select-none rounded-2xl flex justify-center items-center cursor-pointer btnRing px-4 sm:px-6 py-1"
          tabindex="-1"
          @click="apply"
        >
          <h1 class="text-base sm:text-lg font-bold py-0.5 transition duration-300 transform">
            Apply
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BaseInput from './BaseInput';
  import { debounce } from '../utils';

  export default {
    name: 'Search',
    components: {
      BaseInput,
    },
    props: ['text', 'drop', 'noOrder', 'searchName','float'],
    data() {
      return {
        search: this.text || '',
        dropDown: this.drop || 0,
      };
    },
    methods: {
      deb: debounce,
      handleSearch(val) {
        this.search = val;
        this.$emit('searchChange', val);
      },
      handleDropdown(val) {
        this.dropDown = val;
        this.$emit('dropChange', val);
      },
      apply() {
        this.$emit('apply', this.search, this.dropDown);
      },
      clear(){
        this.search='';
        this.dropDown = 0;
        this.apply();
      }
    },
  };
</script>

<style></style>
