<template>
  <card
    :title="title"
    class="data-area"
  >
    <slot />
  </card>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>

<style lang="scss" >
.data-area {
  padding: 0 $basic-padding;
  margin-top: 32px;
}

.data-area:first-child {
  margin-top: 0;
}

.data-area > .content {
  padding: $basic-padding;
}

.data-area-title {
  margin-bottom: 8px;
  height: 65px;
  line-height: 65px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 2px solid rgba(0, 0, 0, 0.65);
}
</style>
