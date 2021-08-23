<template>
  <div class="w-full h-full flex justify-start items-start flex-col">
    <div class="px-10 py-4 h-16 w-full bg-gray-100 shadow-md flex items-center justify-between xl:rounded-b-4xl">
        <router-link to="/adminUsers">
            <div>Host requests</div>
        </router-link>
        <router-link to="/adminUsers/postsDash">
            <div>Post requests</div>
        </router-link>
        <router-link to="/adminUsers/changePriv">
            <div>update User privileges</div>
        </router-link>
    
    </div>
    <router-view class="w-full max-h-full" />
  </div>
</template>

<script>
  export default {
    name:"dashBoard",
  };
</script>

<style></style>
