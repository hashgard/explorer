<template>
  <card :title="$t('validator.validators')">
    <el-radio-group
      v-model="status"
      @change="onStatusChange"
      class="radios"
    >
      <el-radio
        label="bonded"
        border
      >{{$t('validator.bonded')}}</el-radio>
      <el-radio
        label="unbonded"
        border
      >{{$t('validator.unBonded')}}</el-radio>
      <el-radio
        label="unbonding"
        border
      >{{$t('validator.unBonding')}}</el-radio>
    </el-radio-group>
    <validator-list :list='list' />
  </card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return { status: 'bonded' };
  },
  computed: {
    ...mapState('validators', ['list']),
  },
  methods: {
    onStatusChange() {
      this.$store.dispatch('validators/fetchAll', this.status);
    },
  },
  mounted() {
    this.$store.dispatch('validators/fetchAll', this.status);
  },
};
</script>

<style lang="scss" scoped>
.radios {
  margin-bottom: $basic-padding;
}
</style>
