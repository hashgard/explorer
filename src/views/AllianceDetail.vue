<template>
  <div class="content">
    <card :title="$t('alliance.info')" v-if="detail">
      <data-item label="Logo">
        <img class="logo" :src="detail.logo_url" />
      </data-item>
      <data-item :label="$t('alliance.orgId')">
        <span>{{ detail.id }}</span>
      </data-item>
      <data-item :label="$t('alliance.name')">
        <span>{{ detail.name }}</span>
      </data-item>
      <data-item :label="$t('alliance.description')">
        <span>{{ detail.description }}</span>
      </data-item>
      <data-item :label="$t('alliance.level')">
        <span>{{ $t(`apply.${levels[detail.level]}`) }}</span>
      </data-item>
      <data-item :label="$t('alliance.category')">
        <span>
          {{
            $t(`apply.${orgTypes[detail.category]}`)
          }}
        </span>
      </data-item>
      <data-item :label="$t('alliance.manager')">
        <span>{{ detail.owner }}</span>
      </data-item>
      <data-item :label="$t('alliance.voter')">
        <span>{{ detail.voter }}</span>
      </data-item>
      <data-item :label="$t('alliance.supervisor')">
        <span>{{ detail.supervisor }}</span>
      </data-item>
      <data-item :label="$t('alliance.validator')">
        <span>{{ detail.validator }}</span>
      </data-item>
      <data-item :label="$t('alliance.activateAccount')">
        <span>{{ detail.ext_address }}</span>
      </data-item>
      <data-item :label="$t('alliance.nodeId')">
        <span>{{ detail.node_id }}</span>
      </data-item>
      <data-item :label="$t('alliance.extendedPermissions')">
        <span>{{ detail.roles }}</span>
      </data-item>
      <data-item :label="$t('alliance.voting')">
        <span>{{ detail.votes }}</span>
      </data-item>
    </card>
  </div>
</template>

<script>
import ajax from '@/utils/ajax';

export default {
  data() {
    return {
      detail: null,
      id: this.$route.params.id,
      levels: {
        88001000: 'levelGenesis',
        88001001: 'levelSpecial',
        88001002: 'levelUnion',
        88009000: 'levelSupervise',
      },
      orgTypes: {
        A: 'supervisorOrg',
        B: 'accountingOrg',
        C: 'businessService',
        D: 'dataSync',
      },
    };
  },
  async created() {
    const { data: { result } } = await ajax.get(`/org/detail/${this.id}`);

    this.detail = result;
  },
};
</script>

<style lang="scss" scoped>
.logo {
  max-height: 40px;
}
</style>
