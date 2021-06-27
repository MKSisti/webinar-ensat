<template>
  <div
    class="flex flex-col justify-start items-center relative h-screen w-screen overflow-x-hidden"
  >
    <nav-bar></nav-bar>
    <div class="w-full h-full pt-10">
    <router-view/>
    </div>
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

</style>
