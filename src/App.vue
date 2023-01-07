<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

import YouTube from "vue3-youtube";

import Search from "./components/search.vue";
import Type from "./components/type.vue";
import Quality from "./components/quality.vue";
import Download from "./components/download.vue";
import Downloads from "./components/downloads.vue";
import Progress from "./components/progress.vue";
import Error from "./components/error.vue";
import Loading from "./components/loading.vue";

const { ipcRenderer } = require("electron");

const store = useStore();

const videoDetail = computed(() => store.state.videoDetail);
const videoType = computed(() => store.state.videoType);
const downloads = computed(() => store.state.downloads);
const isVideoValid = computed(() => store.getters.isVideoValid);
const modal = computed(() => store.getters.modal);
const loading = computed(() => store.getters.loading);

const error = ref(null);

const handleError = () => {
  store.commit("setStateDefault");

  error.value.setState(true);

  setTimeout(() => {
    error.value.setState(false);
  }, 3000);
};

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
  <div
    v-if="!loading"
    class="relative flex justify-center scroll-smooth font-mono"
  >
    <div class="text-center">
      <p class="font-bold text-2xl text-white">Youtube Mp3/4 Converter</p>
      <div class="mt-8">
        <div v-if="isVideoValid">
          <p class="mb-4 text-white">{{ videoDetail.title }}</p>
          <YouTube
            class="mx-auto"
            :src="videoDetail.videoId"
            @error="handleError"
          />
        </div>
        <p v-else class="text-red-600">{{ videoDetail }}</p>
      </div>
      <Search />
      <Type v-if="isVideoValid" />
      <Quality v-if="videoType === 'mp4'" />
      <Download />
      <Downloads v-if="downloads && downloads.length > 0" :data="downloads" />
      <Progress v-if="modal" />
    </div>
    <Error ref="error" />
  </div>
  <Loading v-else />
</template>