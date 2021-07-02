<template>
  <div
    class="sm:shadow-2xl sm:rounded-3xl pt-8 pb-8 px-4 flex flex-col justify-start items-center space-y-10"
  >
    <div class="flex flex-col justify-center items-start w-11/12 relative">
      <input
        type="text"
        name="search"
        id="search"
        class="searchInput outline-none focus:border-transparent focus:outline-none focus:ring-0 border-none bg-gray-200 ring-0 w-full text-2xl order-2 rounded-2xl"
      />
      <label
        for="search"
        class="absolute h-0 top-0 font-bold text-2xl pl-4 transform translate-x-2 scale-125 order-1 transition duration-300 flex justify-center items-center -mt-1"
      >
        Search
      </label>
    </div>
    <div class="flex justify-between items-center w-11/12 space-x-8">
      <div class="flex flex-col justify-center items-start w-7/12 relative">
        <select
          class="searchInput outline-none focus:border-transparent focus:outline-none focus:ring-0 border-none bg-gray-200 ring-0 w-full text-2xl order-2 rounded-2xl"
          name="orderBy"
          id="orderBy"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <label
          for="orderBy"
          class="font-bold text-lg absolute h-0 top-0 pl-4 transform translate-x-2 scale-125 order-1 transition duration-300 flex justify-center items-center -mt-1"
        >
          Order By
        </label>
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
export default {
  name: "Search",
  components: {}
};
</script>

<style>

</style>
