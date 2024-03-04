<script setup lang="ts">
const client = useMastoClient()
const scheduledPosts = await client.v1.scheduledStatuses.list()

function cancelSchedule(id: string) {
  client.v1.scheduledStatuses.$select(id).remove()
}
</script>

<template>
  <div v-for="scheduledPost in scheduledPosts" :key="scheduledPost.id" p4>
    <div flex items-center p2>
      <div i-ri:calendar-schedule-line me-2 />
      Scheduled: {{ new Date(scheduledPost.scheduledAt).toLocaleString() }}
    </div>
    <p p2>
      {{ scheduledPost.params.text }}
    </p>
    <p>
      <button
        px3 py1 border-3 rounded-3 bg-primary text-white
        @click="cancelSchedule(scheduledPost.id)"
      >
        Cancel schedule
      </button>
    </p>
    <details>
      <blockquote border-1 p2>
        <code>{{ scheduledPost }}</code>
      </blockquote>
    </details>
  </div>
</template>
