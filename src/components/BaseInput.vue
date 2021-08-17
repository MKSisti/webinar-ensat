<template>
  <div class="flex flex-col justify-center items-start w-full relative">
    <div @click="clear" class="absolute right-0 px-4 cursor-pointer">
      <i
        :class="{
          'text-xl': size == 0,
          'text-2xl': size == 1 || size == 2,
          'text-4xl': size == 3 || size == 4,
          'text-5xl': size == 5 || size == 6,
        }"
        class="fa fa-times"
        aria-hidden="true"
      ></i>
    </div>
    <input
      ref="input"
      v-if="!dropDown"
      v-model="value"
      type="text"
      :name="name"
      :id="id || name"
      :class="{
        'text-xl pr-10': size == 0,
        'text-2xl pr-12': size == 1 || size == 2,
        'text-4xl pr-14': size == 3 || size == 4,
        'text-5xl pr-14': size == 5 || size == 6,
      }"
      class="searchInput outline-none focus:border-transparent focus:outline-none focus:ring-0 border-none bg-gray-200 ring-0 w-full order-2 rounded-2xl"
    />
    <select
      v-else
      v-model="value"
      :name="name"
      :id="id || name"
      :class="{
        'text-xl': size == 0,
        'text-2xl': size == 1 || size == 2,
        'text-4xl': size == 3 || size == 4,
        'text-5xl': size == 5 || size == 6,
      }"
      class="searchInput outline-none focus:border-transparent focus:outline-none focus:ring-0 border-none bg-gray-200 ring-0 w-full order-2 rounded-2xl"
    >
      <slot>No options</slot>
    </select>
    <label
      :for="id || name"
      :class="{
        'text-lg': size == 0,
        'text-xl': size == 1,
        'text-2xl': size == 2 || size == 3 || size == 4,
        'text-4xl': size == 5 || size == 6,
      }"
      class="absolute t top-0 w-0 font-bold pl-4 whitespace-nowrap transform -translate-y-1/2 translate-x-2 scale-125 order-1 transition duration-300 flex justify-start items-center -ml-2.5"
    >
      {{ label || name }}
    </label>
  </div>
</template>

<script>
  import { validate } from '../utils';

  export default {
    name: 'BaseInput',
    data() {
      return {
        lazyTimeout: null,
      };
    },
    props: ['label', 'name', 'id', 'modelValue', 'size', 'dropDown', 'lazy', 'numeric'],
    emits: ['update:modelValue', 'clear'],
    computed: {
      value: {
        get() {
          return this.modelValue;
        },
        set(val) {
          if (this.numeric && !validate.isNum(val)) {
            this.$refs.input.value = this.$refs.input.value.substring(0, this.$refs.input.value.length - 1);
          } else {
            if (this.lazyTimeout) clearTimeout(this.lazyTimeout);
            this.lazyTimeout = null;
            this.lazyTimeout = setTimeout(() => {
              this.$emit('update:modelValue', val);
            }, this.lazy ?? 0);
          }
        },
      },
    },
    methods: {
      clear() {
        this.value = '';
        this.$refs.input.value = '';
      },
    },
  };
</script>

<style scoped>
  .searchInput:focus + label {
    @apply -translate-y-full translate-x-0 scale-100;
  }
</style>

/** * * Usage : -if you have a data to show inside the input say from a db : provide the 'modelValue' prop with that data and then listen * to the event
'update:modelValue' for the new value you can then store that new value or give it to some function to update * -if it's meant to be used just as a simple input
then no need to provide the 'modelValue' prop and you can simplu use * v-model to bind the data with a variable in you component like you would with a normal
input * For the data to include if you only provide the name that name will be used as id and label aswell ... * */
