<template>
  <div class="px-10 py-4 h-16 w-full bg-gray-100 shadow-md flex items-center justify-between xl:rounded-b-4xl">
    <div>
      <div>W</div>
      <div>Webinar Ensat</div>
    </div>
    <div class="flex">
      <div>HOME</div>
      <div>ABOUT</div>
      <div>CONTACT US</div>
    </div>
    <div>
      <div v-if="getLoggedState">
        connected!!
      </div>
      <div v-else >
        <div @click="logIn()" class="cursor-pointer py-2 px-4 bg-red-100 rounded-xl btnRing" tabindex="-1">Sign In</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import {auth, provider} from "../firebase"

export default {
    name:"NavBar",
    computed: {
      ...mapGetters('user',[
        'getLoggedState', //usage : this.getLoggedState()
        'getUserInfo',
      ])
    },
    methods:{
      async logIn(){
        console.log("clicked");
        try {
          await auth.signInWithPopup(provider);
        } catch (error) {
          console.log(error);
        }
      }
    }
}
</script>
