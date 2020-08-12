<template>
  <router-link
    v-if="
      action == 'assetPower' ||
        action == 'job-update' ||
        action == 'job-add' ||
        action == 'job' ||
        action == 'call' ||
        action == 'call-job' ||
        action == 'deploy'
    "
    :to="`/${type}/${link || content}?type=contract`"
    :class="`${ellipsis ? 'ellipsis' : ''}`"
  >{{ content }}</router-link>
  <router-link
    v-else
    :to="`/${type}/${link || content}`"
    :class="`${ellipsis ? 'ellipsis' : ''}`"
  >{{ content }}</router-link>
</template>
<script>
export default {
  props: {
    type: String,
    link: String,
    content: String,
    ellipsis: { type: Boolean, default: true },
    action: String
  }
};
</script>

<style lang="scss" scoped>
.ellipsis {
  display: inline-block;
  overflow: hidden;

  max-width: 200px;

  vertical-align: top;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
