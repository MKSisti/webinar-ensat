<template>
  <div
    class="flex flex-col justify-start items-center relative h-screen w-screen overflow-hidden "
  >
    <nav-bar class="z-50"></nav-bar>
      <router-view class="w-full max-h-full overflow-auto z-20 -mt-10 pt-10"/>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";

export default {
  name: "App",
  components: {
    NavBar
  }
};
</script>

<style>
/* ./src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body,
#app {
  @apply bg-gray-50;
}

::-moz-selection {
  @apply bg-red-300;
}
::selection {
  @apply bg-red-300;
}

@property --cs {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}

@property --cs1 {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}

@property --cs2 {
  syntax: '<color>';
  inherits: false;
  initial-value: transparent;
}

.btnTransform{
  @apply transform transition duration-300
}

.btnTransform:hover{
  @apply -translate-y-1
}

.btnTransform *{
  @apply transform transition duration-300
}

.btnTransform:hover *{
  @apply -translate-y-1
} 

.btnRing{
  @apply ring-0 ring-red-300 ring-opacity-0 transition duration-300 
}

.btnRing:hover{
  @apply ring-2 ring-opacity-100
}

.fade-leave-to,
.fade-enter-from {
  opacity: 0;
}

.fade-y-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.fade-y-leave-to{
  transform: translateY(-10px);
  opacity: 0;
}

.squash-y-leave-to,
.squash-y-enter-from {
  height:0px;
}

</style>
