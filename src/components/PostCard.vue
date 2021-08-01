<template>
  <div
    class="group postCard transform hover:-translate-y-2 hover:scale-105 transition duration-300 cursor-pointer rounded-none sm:rounded-4xl relative w-full pb-6 sm:shadow-2xl flex flex-col justify-start items-center overflow-hidden border-0 border-b-2 border-gray-200 border-opacity-70 sm:border-b-0"
  >
    <div
      class="absolute text-black font-semibold top-0 right-0 px-5 py-2 text-xs text-opacity-60 bg-gray-200 bg-opacity-70 rounded-bl-4xl"
    >
      {{ d }}
    </div>
    <div class="h-32 w-full px-8 flex justify-start items-center">
      <div
        class="rounded-full bg-yellow-400 h-16 w-16 pointer-events-auto transition duration-300 flex-shrink-0 overflow-hidden object-contain flex justify-center items-center"
      >
      <img :src="userData?.img" :alt="userData?.userName">
      </div>
      <div
        class="flex flex-col justify-center items-start h-full px-3 w-full"
      >
        <h1 class="text-2xl font-bold max-w-full truncate pr-36 flex-shrink-0">
          Title of very good post is very long as u can see, damn this boi long
          bruh
        </h1>
        <router-link :to="'/profile/' + userData?.uid">
          <h1 class="text-xl max-w-full truncate pr-24 flex-shrink-0 hover:underline">
            {{ userData?.userName }}
          </h1>
        </router-link>
      </div>
    </div>
    <div
      class="w-full h-full flex flex-col justify-start items-start px-8 sm:px-14"
    >
      <div
        class="aspect-w-2 aspect-h-1 sm:aspect-w-4 sm:aspect-h-1 w-full bg-red-300 rounded-3xl flex-shrink-0 transform transition duration-300 group-hover:-translate-y-2"
      ></div>
      <div
        v-html="post?.content"
        class="line-clamp-5 sm:px-8 pt-2 pb-1 font-semibold text-lg postCardHtml"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostCard",
  props: ["post", "userData"],
  data() {
    return {};
  },
  computed: {
    d() {
      var sda = new Date(this.post.hosting_date).toJSON();
      return (
        sda.split("T")[0].replaceAll("-", "/") +
        " " +
        sda.split("T")[1].split(".")[0]
      );
    }
  }
};
</script>

<style>
.adaptiveBg {
  --cs: #f1f5f9;
  transition: --cs 300ms;
  background: linear-gradient(0deg, var(--cs), #f1f5f9);
}

.adaptiveBg:hover {
  --cs: #fca5a5;
}
</style>
