<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const qualities = ref([
  {
    name: "Low Quality",
    value: "lowestvideo",
  },
  {
    name: "High Quality",
    value: "highestvideo",
  },
]);

const videoQuality = computed({
  get: () => store.state.videoQuality,
  set: (val) => store.commit("setVideoQuality", val),
});
</script>

<template>
  <ul class="w-9/12 grid gap-2 w-full md:grid-cols-2 text-start mb-8 mx-auto">
    <li v-for="quality in qualities" :key="quality.value">
      <div class="flex items-center pl-3">
        <input
          v-model="videoQuality"
          :value="quality.value"
          :id="quality.value"
          type="radio"
          class="hidden peer"
        />
        <label
          :for="quality.value"
          class="
            inline-flex
            justify-between
            items-center
            p-5
            w-full
            text-gray-500
            bg-white
            rounded-lg
            border border-gray-200
            cursor-pointer
            dark:hover:text-gray-300
            dark:border-gray-700
            dark:peer-checked:text-blue-500
            peer-checked:border-blue-600 peer-checked:text-blue-600
            hover:text-gray-600 hover:bg-gray-100
            dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700
          "
        >
          {{ quality.name }}
        </label>
      </div>
    </li>
  </ul>
</template>

<script>
export default { name: "videoQuality" };
</script>
