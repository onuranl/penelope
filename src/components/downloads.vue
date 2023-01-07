<script>
export default {
  name: "recentlyDownloads",
  props: ["data"],
};
</script>

<template>
  <div class="flex flex-col text-center mt-20">
    <p class="font-bold text-xl text-white mb-5">- Recently Downloads -</p>
    <p class="text-gray-400" v-for="(item, i) in data" :key="i">
      {{ item }}
    </p>
  </div>
</template>