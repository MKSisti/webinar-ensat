<template>
  <div
    class="sm:shadow-2xl sm:rounded-3xl pt-8 pb-8 px-4 flex flex-col justify-start items-center space-y-10"
  >
    <div class="flex flex-col justify-center items-start w-11/12 relative">
      <base-input name="Search" modelValue="idk" @update:modelValue="handleSearch" size="2" lazy="250"/>
    </div>
    <div class="flex justify-between items-center w-11/12 space-x-8">
      <div class="flex flex-col justify-center items-start w-7/12 relative">
        <base-input name="Order By" modelValue="1" @update:modelValue="handleSearch" size="1" dropDown="true">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </base-input>
      </div>
      
      <div class="w-5/12 h-12 bg-red-100 rounded-2xl flex justify-center items-center cursor-pointer btnRing" tabindex="-1">
        <h1 class="text-2xl font-bold mb-1 transition duration-300 transform">
          Apply
        </h1>
      </div>
    </div>
  </div>
</template>


<script>
import BaseInput from './BaseInput'
import {debounce} from '../utils'


export default {
  name: "Search",
  methods:{
    deb: debounce,
    handleSearch(val){
      console.log(val);
    }
  },
  components: {
    BaseInput
  }
};
</script>

<style>

</style>
