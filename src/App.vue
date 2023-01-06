<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import { YoutubeVue3 } from "youtube-vue3";

import Search from "./components/search.vue";
import Type from "./components/type.vue";
import Quality from "./components/quality.vue";
import Download from "./components/download.vue";
import Progress from "./components/progress.vue";
import Loading from "./components/loading.vue";

const { ipcRenderer } = require("electron");

const store = useStore();

const videoDetail = computed(() => store.state.videoDetail);
const selectedType = computed(() => store.state.selectedType);
const isVideoValid = computed(() => store.getters.isVideoValid);
const modal = computed(() => store.getters.modal);
const loading = computed(() => store.getters.loading);

onMounted(() => {
  ipcRenderer.on("yt:detail", (e, detail) => {
    store.commit("setVideoDetail", detail);
    store.commit("setSearching", false);
  });

  ipcRenderer.on("yt:state", (e, state) => {
    store.commit("setState", state);
  });

  ipcRenderer.on("yt:progress", (e, progress) => {
    store.commit("setProgress", progress);
  });
});
</script>

<template>
  <div v-if="!loading" class="flex justify-center scroll-smooth font-mono">
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
  <Loading v-else />
</template>