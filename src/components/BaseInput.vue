<template>
  <div class="flex flex-col justify-center items-start w-11/12 relative">
    <input
      v-model="value"
      type="text"
      :name="name"
      :id="id || name"
      class="searchInput outline-none focus:border-transparent focus:outline-none focus:ring-0 border-none bg-gray-200 ring-0 w-full text-2xl order-2 rounded-2xl"
    />
    <label
      :for="id || name"
      class="absolute h-0 top-0 font-bold text-2xl pl-4 transform translate-x-2 scale-125 order-1 transition duration-300 flex justify-center items-center -mt-1"
    >
      {{ label || name }}
    </label>
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  props: ["label", "name", "id", "modelValue"],
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
  },
};
</script>

<style scoped>
.searchInput:focus + label {
  @apply -translate-y-2 translate-x-0 scale-100;
}
</style>

/**
*
* Usage : -if you have a data to show inside the input say from a db : provide the 'modelValue' prop with that data and then listen 
*           to the event 'update:modelValue' for the new value you can then store that new value or give it to some function to update
*         -if it's meant to be used just as a simple input then no need to provide the 'modelValue' prop and you can simplu use 
*           v-model to bind the data with a variable in you component like you would with a normal input
*         For the data to include if you only provide the name that name will be used as id and label aswell ...
*
*/
