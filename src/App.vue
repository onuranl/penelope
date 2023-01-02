<template>
  <div class="flex justify-center mt-10 scroll-smooth font-mono">
    <div class="text-center">
      <p class="font-bold text-2xl">Youtube Mp3/4 Converter</p>
      <div v-if="videoDetail" class="mt-8">
        <p class="mb-4">{{ videoDetail.title }}</p>
        <YoutubeVue3
          :videoid="videoDetail.videoId"
          :autoplay="0"
          class="mx-auto"
        />
      </div>
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
          {{ baseUrl }}
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
          @keyup="getDetail"
        />
      </div>
      <div
        v-if="downloading"
        class="w-full bg-gray-200 rounded-full dark:bg-gray-700 my-10"
      >
        <div
          class="
            bg-blue-600
            text-xs
            font-medium
            text-blue-100 text-center
            p-1
            leading-none
            rounded-full
          "
          style="width: 45%"
        >
          45%
        </div>
      </div>
      <ul
        v-if="videoDetail"
        class="grid gap-6 w-full md:grid-cols-2 text-start mb-8"
      >
        <li v-for="(type, index) in types" :key="index">
          <input
            v-model="selectedType"
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
      <button
        type="button"
        class="
          py-2.5
          px-5
          mr-2
          mb-2
          text-sm
          font-medium
          text-gray-900
          focus:outline-none
          bg-white
          rounded-full
          border border-gray-200
          hover:bg-gray-100 hover:text-blue-700
          focus:z-10 focus:ring-4 focus:ring-gray-200
          dark:focus:ring-gray-700
          dark:bg-gray-800
          dark:text-gray-400
          dark:border-gray-600
          dark:hover:text-white
          dark:hover:bg-gray-700
        "
        :disabled="
          !videoFormatController ||
          !videoDetail ||
          videoDetail === 'Video unavailable'
        "
        @click="download"
      >
        <svg
          v-if="loading"
          aria-hidden="true"
          role="status"
          class="
            inline
            mr-2
            w-4
            h-4
            text-gray-200
            animate-spin
            dark:text-gray-600
          "
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="#1C64F2"
          />
        </svg>

        {{ loading ? "Loading" : "Download" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import { YoutubeVue3 } from "youtube-vue3";

const { ipcRenderer } = require("electron");

const baseUrl = ref("youtube.com/watch?v=");

const videoIdRegex = ref(/^[a-zA-Z0-9-_]{11}$/);
const types = ref([
  { id: "mp3", title: "MP3", description: "Audio only" },
  { id: "mp4", title: "MP4", description: "Audio + video" },
]);

const selectedType = ref("mp3");

const videoID = ref(null);
const videoDetail = ref(null);

const loading = ref(false);
const downloading = ref(false);

const download = () => {
  downloading.value = true;

  if (selectedType.value === "mp3")
    return ipcRenderer.send("yt:mp3", videoID.value);

  ipcRenderer.send("yt:mp4", videoID.value);
};

const getDetail = () => {
  if (videoFormatController.value) {
    loading.value = true;

    ipcRenderer.send("yt:detail", videoID.value);
  }
};

const videoFormatController = computed(() => {
  return videoIdRegex.value.test(videoID.value);
});

onMounted(() => {
  ipcRenderer.on("yt:detail", (e, detail) => {
    videoDetail.value = detail;

    loading.value = false;
  });
});
</script>