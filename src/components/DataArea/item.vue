<template>
  <div class="data-item">
    <p class="label">{{ label }}</p>
    <p class="content">
      <slot />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    label: String
  }
};
</script>

<style lang="scss" scoped>
$height: 36px;

.data-item {
  display: flex;
  margin-bottom: 12px;

  > .label {
    display: inline-block;
    width: 210px;
    font-weight: bold;
  }

  > .content {
    color: rgba(0, 0, 0, 0.65);
    width: 100%;
    overflow-wrap: break-word;
    word-break: break-all;
  }
}

@include responsive($sm) {
  .data-item {
    flex-direction: column;
  }
}
</style>
