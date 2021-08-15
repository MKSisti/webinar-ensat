<template>
  <div
    class="flex flex-col justify-start items-center relative h-screen w-screen overflow-hidden "
  >
    <nav-bar class="z-50"></nav-bar>
    <router-view class="w-full max-h-full overflow-auto z-20" />
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
// import {mongoAtlas} from "./js/mongoAtlas"

export default {
  name: "App",
  components: {
    NavBar
  },
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
  syntax: "<color>";
  inherits: false;
  initial-value: transparent;
}

@property --cs1 {
  syntax: "<color>";
  inherits: false;
  initial-value: transparent;
}

@property --cs2 {
  syntax: "<color>";
  inherits: false;
  initial-value: transparent;
}

.btnTransform {
  @apply transform transition duration-300;
}

.btnTransform:hover {
  @apply -translate-y-1;
}

.btnTransform * {
  @apply transform transition duration-300;
}

.btnTransform:hover * {
  @apply -translate-y-1;
}

.btnRing {
  @apply ring-0 ring-red-300 ring-opacity-0 transition duration-300;
}

.btnRing:hover {
  @apply ring-2 ring-opacity-100;
}

.fade-leave-to,
.fade-enter-from {
  opacity: 0;
}

.fade-y-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.fade-y-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.height-leave-to,
.height-enter-from {
  height: 0px;
}

.height-enter-active,
.height-leave-active {
  overflow: hidden;
}

.squash-y-leave-to,
.squash-y-enter-from {
  height: 0px;
}

html {
  @apply text-gray-800;
}
</style>

<style lang="scss">
/* Basic editor styles */

.toolbar button {
  @apply px-1 rounded-md whitespace-nowrap transition-all duration-300;
}

button.is-active {
  @apply -translate-y-1 scale-110 px-2;
}

button {
  @apply transform transition-all duration-300;
}

// .toolbarFocus button{
//   @apply opacity-0 w-0;
// }

.toolbarFocus {
}

.ProseMirror:focus {
  @apply outline-none;
}

.ProseMirror,
.postCardHtml {
  > * + * {
    margin-top: 0.75em;
  }
  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  h1 {
    @apply font-bold text-4xl;
  }

  h2 {
    @apply font-bold text-3xl;
  }

  h3 {
    @apply font-semibold text-2xl;
  }

  h4 {
    @apply font-semibold text-xl;
  }

  h5 {
    @apply font-medium text-lg;
  }

  h6 {
    @apply font-normal text-base;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }
}
</style>

<style>
::-webkit-scrollbar {
  @apply w-2 h-2;
}
::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded-full;
}
::-webkit-scrollbar-thumb:hover {
  @apply bg-red-300;
}
::-webkit-scrollbar-track {
  @apply bg-transparent rounded-full;
}
</style>
