<template>
  <div class="sm:shadow-2xl sm:rounded-3xl py-8 px-6">
    <div :class="{ 'flex-col': !noOrder }" class="w-full flex justify-start items-center gap-8">
      <div :class="{ 'w-full': !noOrder }" class="flex flex-col justify-center items-start relative">
        <base-input name="Search" :modelValue="search" @update:modelValue="handleSearch" size="2" lazy="250" />
      </div>
      <div :class="{ 'w-full': !noOrder }" class="flex justify-between items-center gap-x-4">
        <div v-if="!noOrder" class="flex flex-col justify-center items-start relative">
          <base-input name="Order By" :modelValue="dropDown" @update:modelValue="handleDropdown" size="1" dropDown="true">
            <option value="0">Hosting Date asc</option>
            <option value="1">Hosting Date desc</option>
            <option value="2">Creation Date asc</option>
            <option value="3">Creation Date desc</option>
            <option value="4">Title asc</option>
            <option value="5">Title desc</option>
          </base-input>
        </div>

        <div @click="apply" class="h-12 bg-red-100 rounded-2xl flex justify-center items-center cursor-pointer btnRing px-6" tabindex="-1">
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
    props: ['text', 'drop', 'noOrder'],
    components: {
      BaseInput,
    },
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
    },
  };
</script>

<style></style>
