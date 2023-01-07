<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const progress = computed(() => store.state.progress);
const state = computed(() => store.state.state);
</script>

<template>
  <div class="fixed inset-0 z-10 overflow-y-auto">
    <div
      class="flex min-h-full justify-center p-4 text-center items-center sm:p-0"
    >
      <div
        class="
          relative
          bg-white
          rounded-lg
          shadow
          dark:bg-gray-700
          w-3/4
          xl:w-1/3
          md:w-1/2
        "
      >
        <div class="p-6 text-center">
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-base font-medium text-blue-700 dark:text-white"
                >Downloading</span
              >
              <span class="text-base font-medium text-blue-700 dark:text-white"
                >{{
                  progress.toString().charAt(0) == 0
                    ? progress.toString().slice(1)
                    : progress
                }}
                %</span
              >
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                class="bg-blue-600 h-2.5 rounded-full"
                :style="`width: ${progress}%`"
              ></div>
            </div>
          </div>
          <div class="my-8">
            <p v-if="state === 'ended'" class="text-green-500">
              Successfully downloaded
            </p>
            <p
              v-if="state !== 'ended' && state !== 'progress'"
              class="text-red-500"
            >
              Successfully downloaded
            </p>
          </div>
          <button
            v-if="state === 'ended'"
            type="button"
            class="
              hover:bg-gray-100
              focus:ring-4 focus:outline-none focus:ring-gray-200
              rounded-lg
              border border-gray-200
              text-sm
              font-medium
              px-5
              py-2.5
              hover:text-gray-900
              focus:z-10
              dark:bg-gray-700
              dark:text-gray-300
              dark:border-gray-500
              dark:hover:text-white
              dark:hover:bg-gray-600
              dark:focus:ring-gray-600
            "
            @click="store.dispatch('updateDownloads')"
          >
            Okey
          </button>
          <button
            v-else
            type="button"
            class="
              text-white
              bg-red-600
              hover:bg-red-800
              focus:ring-4 focus:outline-none focus:ring-red-300
              dark:focus:ring-red-800
              font-medium
              rounded-lg
              text-sm
              inline-flex
              items-center
              px-5
              py-2.5
              text-center
              mr-2
            "
            @click="store.dispatch('destroyDownload')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: "downloadProgress" };
</script>