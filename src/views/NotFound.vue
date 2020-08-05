<template>
  <div class="not-found-container">
    <Card :title="$t('global.notFound')">
      <div class="content">
        <p>{{$t('global.pageNotFound')}}</p>
        <p>{{$t('global.backPage')}} <router-link to="/">{{$t('global.homePage')}}</router-link>
        </p>
      </div>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.not-found-container {
  font-size: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);

  .content {
    margin: 64px 0;
  }
}
</style>
