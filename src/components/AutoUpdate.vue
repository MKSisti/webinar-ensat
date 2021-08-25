<template>
  <div v-if="updateExists">
    <span> Please wait while we update the application.</span>
  </div>
</template>

<script>
import { useServiceWorker } from "@/composables/use-service-worker";

export default {
  name: "AppAutoUpdate",
  data() {
    return {
      updateExists: false,
    };
  },
  mounted() {
    this.updateExists = useServiceWorker(true);
  },
};
</script>

<style scoped></style>
