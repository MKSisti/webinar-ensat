<template>
  <div
    class="rounded-4xl relative h-108 w-full bg-gray-100 shadow-2xl flex flex-col justify-start items-center overflow-hidden"
  >
    <div
      class="absolute text-black font-semibold top-0 right-0 pl-5 pr-5 py-2 text-xs text-opacity-30 bg-gray-200 bg-opacity-70 rounded-bl-4xl"
    >
      19-04-2021
    </div>
    <div class="h-32 w-full px-8 flex justify-start items-center">
      <div
        class="rounded-full bg-yellow-400 h-16 w-16 pointer-events-auto transition duration-300 flex-shrink-0"
      ></div>
      <div
        class="flex flex-col justify-center items-start h-full px-3 w-full overflow-visible"
      >
        <h1 class="text-2xl font-bold max-w-full truncate pr-36 flex-shrink-0">
          Title of very good post is very long as u can see, damn this boi long
          bruh
        </h1>
        <h1 class="text-xl max-w-full truncate pr-24 flex-shrink-0">User</h1>
      </div>
    </div>
    <div class="w-full h-full flex flex-col justify-start items-center px-14">
      <div class="h-36 w-full bg-red-300 rounded-3xl flex-shrink-0"></div>
      <p class="px-8 py-2 font-semibold leading-7 text-lg postText">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa eos
        rerum magnam explicabo, aliquam ullam cumque distinctio inventore
        architecto maxime pariatur a voluptatum vel natus, veritatis, iusto est
        at iure. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Excepturi architecto sunt debitis rem assumenda corporis expedita
        temporibus fugit? Sed aspernatur inventore quod? Quis et fuga molestias
        optio libero eos harum velit, dicta voluptas cum sequi perspiciatis at
        reiciendis dolore. Voluptatum!
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.postText {
  display: block;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
