<template>
  <div class="w-full h-full flex justify-start items-start flex-col relative">
    <div class="absolute top-0 right-0 left-0 sm:left-auto p-5 flex justify-center items-center pointer-events-none z-50 ">
      <transition
        name="fade-y"
        appear
      >
        <div
          v-if="alert.text"
          class=" bg-gray-200 dark:bg-gray-800 shadow-lg btnTransformSm rounded-xl pointer-events-auto cursor-pointer relative overflow-hidden"
          @click="clearAlert()"
        >
          <div class="flex justify-center items-center gap-4 px-4 py-1.5 relative z-50">
            <i
              class="ri-check-fill text-xl h-0 w-0 flex justify-center items-center transform transition duration-300"
              aria-hidden="true"
            />
            <h1 class="text-xl">
              {{ alert.text }}
            </h1>
          </div>
          
          <div
            :class="[`bg-${alert.color}-500`]"
            class="progressBar absolute opacity-0 transform w-full h-full top-0 bottom-0 z-0"
          />
        </div>
      </transition>
    </div>
    <div class="px-4 py-3 bg-gray-100 dark:bg-gray-900 shadow-md flex-col md:flex-row flex items-start md:items-center justify-between rounded-2xl gap-4 font-semibold text-xl mx-auto mt-5 select-none relative z-10">
      <h1 class="text-2xl font-bold">
        Dashboard
      </h1>

      <router-link
        to="/adminUsers"
      >
        <div class="flex justify-center items-center">
          <div class="btnTransformSm transform transition duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl w-44">
            <div class="w-full flex justify-around items-center overflow-hidden cursor-pointer px-2 py-1.5 relative flex-shrink-0 gap-2">
              <i
                class="ri-user-follow-fill font-thin flex-shrink-0 flex items-center justify-center text-xl mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 whitespace-nowrap duration-300">
                Host Requests
              </h1>
            </div>
          </div>
        </div>
      </router-link>

      <router-link
        to="/adminUsers/postsDash"
      >
        <div class="flex justify-center items-center">
          <div class="btnTransformSm transform transition duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl w-44">
            <div class="w-full flex justify-around items-center overflow-hidden cursor-pointer px-2 py-1.5 relative flex-shrink-0 gap-2">
              <i
                class="ri-file-settings-fill font-thin flex-shrink-0 flex items-center justify-center text-xl mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 whitespace-nowrap duration-300">
                Post Requests
              </h1>
            </div>
          </div>
        </div>
      </router-link>
      <router-link
        to="/adminUsers/changePriv"
      >
        <div class="flex justify-center items-center">
          <div class="btnTransformSm transform transition duration-300 bg-gray-200 dark:bg-gray-800 bg-opacity-70 rounded-xl w-44">
            <div class="w-full flex justify-around items-center overflow-hidden cursor-pointer px-2 py-1.5 relative flex-shrink-0 gap-2">
              <i
                class="ri-user-settings-fill font-thin flex-shrink-0 flex items-center justify-center text-xl mt-px ml-px h-4 w-4"
                aria-hidden="true"
              />
              <h1 class="text-lg font-semibold flex-shrink-0 whitespace-nowrap duration-300">
                User information
              </h1>
            </div>
          </div>
        </div>
      </router-link>
    </div>
    <div class="w-full h-full relative select-auto">
      <router-view
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
            @success="showAlert"
          />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DashBoard',
    data(){
      return{
        alert:{},
        alertTimeout:null
      }
    },
    methods:{
      showAlert(color,text){
        this.clearAlert();
        this.alert = {color,text};
        this.alertTimeout = setTimeout(() => this.alert = {},6000);
      },
      clearAlert(){
        if(this.alertTimeout) clearTimeout(this.alertTimeout);
        this.alertTimeout=null;
        this.alert = {}
      }
    }
  };
</script>

<style>

.progressBar{
  animation: progress 4s ease-out;
  animation-iteration-count: 1;
}

@keyframes progress{
  0%{
    left:-100%;
    opacity:0;
  }
  100%{
    left:0%;
    opacity:1;
  }
}



</style>
