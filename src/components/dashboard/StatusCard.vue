<script setup lang="ts">
defineProps<{
  title: string;
  value: number;
  icon: string;
  color: string;
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
    <div class="p-6">
      <div class="flex items-center mb-4">
        <div :class="[color, 'w-12 h-12 rounded-full flex items-center justify-center text-white text-xl']">
          {{ icon }}
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-medium text-gray-700">{{ title }}</h3>
        </div>
      </div>
      <div class="text-3xl font-bold text-gray-800">{{ value }}</div>
    </div>
  </div>
</template>