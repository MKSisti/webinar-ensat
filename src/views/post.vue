<template>
  <div class="flex justify-start items-start flex-col space-y-20 w-full h-full">
    <div class="flex-shrink-0 w-full h-auto relative">
      <img class="aspect-w-4 aspect-h-1 bg-black flex-shrink-0" src="" alt="" />
      <div class="absolute transform -translate-y-28 px-10 flex justify-between items-center w-full">
        <user-card
          :userInfo="{}"
        />
        <div class=" bg-gray-100 h-10 shadow-xl rounded-xl flex justify-center items-center px-5 font-semibold">
          Hosting date: xx/xx/xxxx at xx:xx
        </div>
      </div>
    </div>
    <div class="px-10 py-5 bg-gray-100 w-full h-full rounded-t-6xl shadow-3xl relative">
        <!-- //? this button can change its text from edit/update and publish to match the action, edit can toggle edit ... -->
        <div v-if="!'publishing'" class="top-0 absolute bg-gray-100 shadow-2xl right-20 px-4 py-2 text-3xl font-bold border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl transform -translate-y-1/2">
          Publish
        </div>
        <div v-if="!'editing'" class="top-0 absolute bg-gray-100 shadow-2xl right-20 px-4 py-2 text-3xl font-bold border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl transform -translate-y-1/2">
          Update
        </div>
        <div v-if="'editable and not editing'" class="top-0 absolute bg-gray-100 shadow-2xl right-20 px-4 py-2 text-3xl font-bold border-2 border-red-300 border-opacity-50 hover:border-opacity-0 btnRing cursor-pointer rounded-2xl transform -translate-y-1/2">
          Edit
        </div>
        <Tiptap :editable="true"/>
    </div>
  </div>
</template>

<script>
import UserCard from '../components/UserCard';
import Tiptap from '../components/TipTap'

export default {
  methods: {},
  props: {
    pid: String
  },
  components: {
    UserCard,
    Tiptap
  }
};
</script>

<style></style>
