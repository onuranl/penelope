<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const videoID = computed({
  get: () => store.state.videoID,
  set: (val) => store.commit("setVideoID", val),
});
</script>

<template>
  <div class="flex my-10">
    <span
      class="
        inline-flex
        items-center
        px-3
        text-sm text-gray-900
        bg-gray-200
        border border-r-0 border-gray-300
        rounded-l-md
        dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600
      "
    >
      {{ store.state.baseUrl }}
    </span>
    <input
      v-model="videoID"
      type="text"
      id="website-admin"
      maxlength="11"
      class="
        rounded-none rounded-r-lg
        bg-gray-50
        border
        text-gray-900
        focus:ring-blue-500 focus:border-blue-500
        block
        flex-1
        min-w-0
        w-full
        text-sm
        border-gray-300
        p-2.5
        dark:bg-gray-700
        dark:border-gray-600
        dark:placeholder-gray-400
        dark:text-white
        dark:focus:ring-blue-500
        dark:focus:border-blue-500
      "
      placeholder="id"
      @keyup="store.dispatch('getDetail')"
    />
  </div>
</template>

<script>
export default { name: "videoSearch" };
</script>