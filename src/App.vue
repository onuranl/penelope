<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import { YoutubeVue3 } from "youtube-vue3";

import Search from "./components/search.vue";
import Type from "./components/type.vue";
import Quality from "./components/quality.vue";
import Download from "./components/download.vue";
import Progress from "./components/progress.vue";

const { ipcRenderer } = require("electron");

const store = useStore();

const videoDetail = computed(() => store.state.videoDetail);
const selectedType = computed(() => store.state.selectedType);
const modal = computed(() => store.state.modal);
const isVideoValid = computed(() => store.getters.isVideoValid);

onMounted(() => {
  ipcRenderer.on("yt:detail", (e, detail) => {
    store.commit("setVideoDetail", detail);
    store.commit("setLoading", false);
  });

  ipcRenderer.on("yt:progress", (e, detail) => {
    store.commit("setProgress", detail);
  });
});
</script>

<template>
  <div class="flex justify-center scroll-smooth font-mono">
    <div class="text-center">
      <p class="font-bold text-2xl text-white">Youtube Mp3/4 Converter</p>
      <div class="mt-8">
        <div v-if="isVideoValid">
          <p class="mb-4 text-white">{{ videoDetail.title }}</p>
          <YoutubeVue3
            class="mx-auto"
            :videoid="videoDetail.videoId"
            :autoplay="0"
          />
        </div>
        <p v-else class="text-red-600">{{ videoDetail }}</p>
      </div>
      <Search />
      <Type v-if="isVideoValid" />
      <Quality v-if="selectedType === 'mp4'" />
      <Download />
      <Progress v-if="modal" />
    </div>
  </div>
</template>