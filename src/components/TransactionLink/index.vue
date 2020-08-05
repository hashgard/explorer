<template>
  <router-link :to="`/tx/${content}`">
    {{ ellipsis === false ? content : content.slice(0, 18) + '...' }}
  </router-link>
</template>
<script>
export default {
  props: {
    content: String,
    ellipsis: { type: Boolean, default: true },
  },
};
</script>
