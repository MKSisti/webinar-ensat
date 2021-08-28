<template>
  <div
    class="sm:shadow-2xl sm:rounded-3xl py-8 px-6"
    @keypress.enter="apply"
  >
    <div
      :class="{ 'flex-col': !noOrder }"
      class="w-full flex justify-start items-center gap-8"
    >
      <div
        :class="{ 'w-full': !noOrder }"
        class="flex flex-col justify-center items-start relative"
      >
        <base-input
          :name="searchName || 'Search'"
          :model-value="search"
          size="1"
          lazy="250"
          @update:modelValue="handleSearch"
          @clear="clear"
        />
      </div>
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
            size="1"
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
          class="h-11 bg-red-100 rounded-2xl flex justify-center items-center cursor-pointer btnRing px-6"
          tabindex="-1"
          @click="apply"
        >
          <h1 class="text-2xl font-bold mb-1 transition duration-300 transform">
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
    props: ['text', 'drop', 'noOrder', 'searchName'],
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
