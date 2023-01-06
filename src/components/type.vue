<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const types = ref([
  { id: "mp3", title: "MP3", description: "Audio only" },
  { id: "mp4", title: "MP4", description: "Audio + video" },
]);

const videoType = computed({
  get: () => store.state.videoType,
  set: (val) => store.commit("setVideoType", val),
});
</script>

<template>
  <ul class="grid gap-6 w-full md:grid-cols-2 text-start mb-8">
    <li v-for="type in types" :key="type.id">
      <input
        v-model="videoType"
        type="radio"
        name="type"
        :id="type.id"
        :value="type.id"
        class="hidden peer"
        required
      />
      <label
        :for="type.id"
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
        <div class="block">
          <div class="w-full text-lg font-semibold">{{ type.title }}</div>
          <div class="w-full">{{ type.description }}</div>
        </div>
      </label>
    </li>
  </ul>
</template>

<script>
export default { name: "videoType" };
</script>
