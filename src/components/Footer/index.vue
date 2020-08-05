<template>
  <div class="footer-container">
    <!-- <img
      class="logo"
      src="~@/assets/logo-white.png"
    /> -->
    <!-- <p>POWERED BY GARDPLORER.IO</p> -->
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.footer-container {
  display: flex;
  height: 68px;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);

  > img {
    margin-right: $basic-margin;
  }
}

@include responsive($sm) {
  .footer-container {
    > img {
      display: none;
    }
  }
}
</style>
