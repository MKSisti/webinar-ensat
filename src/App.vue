<template>
  <div
    class="flex flex-col justify-start items-center h-full w-full space-y-10"
  >
    <nav-bar></nav-bar>
    <router-view />
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
</style>
