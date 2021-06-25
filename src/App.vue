<template>
  <div class="flex flex-col justify-start items-center h-full w-full overflow-auto space-y-10">
    <div class="h-12 w-full bg-gray-100 shadow-md flex items-center justify-between" >
      <div>
        <div>W</div>
        <div>Webinar Ensat</div>
      </div>
      <div class="flex">
        <div>HOME</div>
        <div>ABOUT</div>
        <div>CONTACT US</div>
      </div>
      <div>Profile</div>
    </div>
      <carousel />
      <div>
        <div>search</div>
        <div>items</div>
      </div>
    
  </div>
</template>

<script>
import Carousel from './components/Carousel'
export default {
  name: 'App',
  components: {
    Carousel
  }
}
</script>

<style>
/* ./src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

html,body,#app{
  @apply bg-gray-50
}
</style>
