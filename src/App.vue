<template>
  <div
    v-if="updateExists"
    class="w-full h-screen flex justify-center items-center gap-5 flex-col"
  >
    <loader style="height:48px" />
    <h1 class="text-2xl font-semibold">
      Updating the app
    </h1>
  </div>
  <div
    v-else
    class="flex flex-col justify-start items-center relative h-screen w-screen overflow-hidden"
  >
    <nav-bar class="z-50" />
    <div class="w-full h-full relative max-h-full z-10">
      <loader
        v-if="firstTimeInit <= 1"
        class="absolute"
      />
      <router-view
        v-else
        v-slot="{ Component }"
        class="w-full max-h-full absolute"
      >
        <transition
          name="fade-y"
          appear
          mode="out-in"
        >
          <component
            :is="Component"
            class="w-full max-h-full transition duration-300"
          />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
  import NavBar from './components/NavBar';
  import Loader from './components/Loader';
  import { useServiceWorker } from "@/composables/use-service-worker";

  export default {
    name: 'App',
    components: {
      NavBar,
      Loader,
    },
    data() {
      return {
        firstTimeInit: process.env.NODE_ENV === 'production' ? 0 : 2,
        updateExists: false,
      };
    },
    async mounted() {
      //pwa init stage
      if (process.env.NODE_ENV === 'production') {
        this.firstTimeInit = await this.$lf.getItem('firstTime');

        let recheck;
        if (this.firstTimeInit <= 1)
          recheck = setInterval(async () => {
            this.firstTimeInit = await this.$lf.getItem('firstTime');
            if (this.firstTimeInit >= 2) clearInterval(recheck);
          }, 500);

        const { updateExists } = useServiceWorker(true);
        this.updateExists = updateExists;
      }
    },
  };
</script>

<style>
  /* ./src/index.css */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  html,
  body,
  #app {
    @apply bg-gray-50 dark:bg-black;
  }

  ::-moz-selection {
    @apply bg-red-300 dark:bg-red-400;
  }
  ::selection {
    @apply bg-red-300 dark:bg-red-400;
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

  .btnTransformSm {
    @apply transform transition duration-300;
  }

  .btnTransformSm:hover {
    @apply -translate-y-0.5;
  }

  .btnTransformSm * {
    @apply transform transition duration-300;
  }

  .btnTransformSm:hover * {
    @apply -translate-y-0.5;
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
    @apply text-gray-800 dark:text-gray-200;
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
      font-family: 'JetBrainsMono', monospace;
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
    @apply bg-gray-400 dark:bg-gray-600 rounded-full border-2 border-transparent bg-clip-padding;
  }
  ::-webkit-scrollbar-thumb:hover {
    @apply bg-red-300;
  }
  ::-webkit-scrollbar-track {
    @apply bg-transparent rounded-full;
  }

  *{
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
  }
</style>
