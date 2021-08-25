<template>
  <transition name="fade-y" appear>
    <div
      class="
        w-full
        h-full
        flex
        items-center
        justify-center
        transition
        duration-300
      "
    >
      <div class="loadingDot"></div>
    </div>
  </transition>
</template>

<script>
export default {};
</script>

<style>
.loadingDot {
  @apply h-8 w-8 rounded-2xl bg-red-400;
  animation: dotLoading 1.5s infinite ease;
  animation-delay: -0.75s;
}

.loadingDot::before,
.loadingDot::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  @apply w-8 h-8 rounded-2xl bg-red-400;
}

.loadingDot::before {
  animation: dotLoadingBefore 1.5s infinite ease;
  animation-delay: -0.75s;
}

.loadingDot::after {
  animation: dotLoadingAfter 1.5s infinite ease;
  animation-delay: -0.75s;
}

@keyframes dotLoading {
  0% {
    transform: scale(1.25, 1.25);
    border-radius: 0.7rem;
  }
  50%,
  60% {
    transform: scale(0.8, 0.8);
    border-radius: 1rem;
  }
  100% {
    transform: scale(1.25, 1.25);
    border-radius: 0.7rem;
  }
}

@keyframes dotLoadingBefore {
  0% {
    transform: translate(0) scale(0.7, 0.7);
    border-top-right-radius: 0rem;
    border-bottom-right-radius: 0rem;
  }
  20% {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }
  50%,
  60% {
    transform: translate(-2.5rem) scale(1, 1);
  }
  70% {
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }
  80% {
    transform: translate(0) scale(0.7, 0.7);
    border-top-right-radius: 0rem;
    border-bottom-right-radius: 0rem;
  }
}

@keyframes dotLoadingAfter {
  0% {
    transform: translate(0) scale(0.7, 0.7);
    border-top-left-radius: 0rem;
    border-bottom-left-radius: 0rem;
  }
  20% {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }
  50%,
  60% {
    transform: translate(2.5rem) scale(1, 1);
  }
  70% {
    border-top-left-radius: 1rem;
    border-bottom-left-radius: 1rem;
  }
  80% {
    transform: translate(0) scale(0.7, 0.7);
    border-top-left-radius: 0rem;
    border-bottom-left-radius: 0rem;
  }
}
</style>
