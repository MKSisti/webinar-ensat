<template>
  <div class="sm:shadow-2xl sm:rounded-3xl pt-8 pb-8 px-4 flex flex-col justify-start items-center space-y-10">
    <div class="flex flex-col justify-center items-start w-11/12 relative">
      <base-input name="Search" modelValue="" @update:modelValue="handleSearch" size="2" lazy="250" />
    </div>
    <div class="flex justify-between items-center w-11/12 space-x-8">
      <div class="flex flex-col justify-center items-start w-7/12 relative">
        <base-input name="Order By" modelValue="0" @update:modelValue="handleDropdown" size="1" dropDown="true">
          <option value="0">Hosting Date asc</option>
          <option value="1">Hosting Date desc</option>
          <option value="2">Creation Date asc</option>
          <option value="3">Creation Date desc</option>
          <option value="4">Title asc</option>
          <option value="5">Title desc</option>
        </base-input>
      </div>

      <div @click="apply" class="w-5/12 h-12 bg-red-100 rounded-2xl flex justify-center items-center cursor-pointer btnRing" tabindex="-1">
        <h1 class="text-2xl font-bold mb-1 transition duration-300 transform">
          Apply
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
  import BaseInput from './BaseInput';
  import { debounce } from '../utils';

  export default {
    name: 'Search',
    data() {
      return {
        search: '',
        dropDown: 0,
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
        this.$emit('apply',this.search, this.dropDown);
      },
    },
    components: {
      BaseInput,
    },
  };
</script>

<style>
</style>
