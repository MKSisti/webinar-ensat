<template>
  <div
    :class="{'pb-5 mt-5': $slots.msg}"
    class="flex flex-col justify-center items-start w-full relative transition-all duration-300"
    @click="msgShow = false"
    @keypress="msgShow = false"
  >
    <div
      v-if="!dropDown && !noClear && !ro"
      class="absolute mt-1 right-0 px-4 cursor-pointer select-none"
      @click="clear"
    >
      <i
        :class="{
          'text-sm sm:text-base': size == 0,
          'text-lg sm:text-xl': size == 1,
          'text-2xl': size == 2,
          'text-4xl': size == 3 || size == 4,
          'text-5xl': size == 5 || size == 6,
        }"
        class="ri-close-fill"
        aria-hidden="true"
      />
    </div>
    <input
      v-if="!dropDown"
      :id="id || name"
      ref="input"
      v-model="value"
      :placeholder="placeHolder || ''"
      type="text"
      :name="name"
      :readonly="ro"
      :class="{
        'text-sm sm:text-base pr-8': size == 0,
        'text-lg sm:text-xl pr-10': size == 1,
        'text-2xl pr-12': size == 2,
        'text-4xl pr-14': size == 3 || size == 4,
        'text-5xl pr-14': size == 5 || size == 6,
      }"
      class="searchInput form-input outline-none focus:border-transparent focus:outline-none focus:ring-0 border-none bg-gray-200 dark:bg-gray-800 ring-0 w-full order-2 rounded-2xl"
    >
    <select
      v-else
      :id="id || name"
      v-model="value"
      :name="name"
      :readonly="ro"
      :class="{
        'text-sm sm:text-base': size == 0,
        'text-lg sm:text-xl': size == 1,
        'text-2xl': size == 2,
        'text-4xl': size == 3 || size == 4,
        'text-5xl': size == 5 || size == 6,
      }"
      class="searchInput form-select cursor-pointer outline-none focus:border-transparent focus:outline-none focus:ring-0 border-none bg-gray-200 dark:bg-gray-800 ring-0 w-full order-2 rounded-2xl"
    >
      <slot>No options</slot>
    </select>
    <label
      :for="id || name"
      :class="{
        'text-sm sm:text-base': size == 0,
        'text-lg sm:text-xl': size == 1,
        'text-xl': size == 2,
        'text-2xl': size == 3 || size == 4,
        'text-4xl': size == 5 || size == 6,
      }"
      class="select-none absolute top-0 w-0 font-bold pl-4 whitespace-nowrap transform -translate-y-2/3 translate-x-2 scale-125 order-1 transition duration-300 flex justify-start items-center -ml-2.5"
    >
      {{ label || name }}
    </label>
    <transition name="fade-y">
      <div 
        v-if="$slots.msg"
        :class="{
          'text-xs sm:text-sm': size == 0,
          'text-sm sm:text-base': size == 1,
          'text-base': size == 2,
          'text-base': size == 3 || size == 4,
          'text-lg': size == 5 || size == 6,
        }"
        class="absolute w-full h-full -bottom-1 text-left flex justify-center items-end pointer-events-none gap-x-1.5 whitespace-nowrap"
      >
        <slot name="msg" />
      </div>
    </transition>
  </div>
</template>

<script>
  import { validate } from '../utils';

  export default {
    name: 'BaseInput',
    props: ['label', 'name', 'id', 'modelValue', 'size', 'dropDown', 'lazy', 'numeric','placeHolder','noClear','ro'],
    emits: ['update:modelValue', 'clear'],
    data() {
      return {
        lazyTimeout: null,
      };
    },
    computed: {
      value: {
        get() {
          return this.modelValue;
        },
        set(val) {
          if ((this.numeric && !validate.isNum(val)) || this.externValidation) {
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
        this.$emit('clear');
      },
    }
  };
</script>

<style scoped>
  .searchInput:focus + label {
    @apply -translate-y-full translate-x-0 scale-100;
  }
</style>

/** * * Usage : -if you have a data to show inside the input say from a db : provide the 'modelValue' prop with that data and then listen * to the event 'update:modelValue' for the new value you can then store that new value or give it to some
function to update * -if it's meant to be used just as a simple input then no need to provide the 'modelValue' prop and you can simplu use * v-model to bind the data with a variable in you component like you would with a normal input * For the data
to include if you only provide the name that name will be used as id and label aswell ... * */
