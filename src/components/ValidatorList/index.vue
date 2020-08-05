<template>
  <el-table :data="list" :empty-text="$t('global.noneData')">
    <el-table-column class="jailed-status" :label="$t('validator.active')">
      <template slot-scope="record">
        <span :class="record.row.jailed ? 'jailed' : 'active'">{{
          record.row.jailed ? "FALSE" : "TRUE"
        }}</span>
      </template>
    </el-table-column>
    <el-table-column
      class="operator-address"
      :label="$t('validator.operatorAddress')"
      prop="operator_address"
    >
      <template slot-scope="record">
        <hg-link type="validator" :content="record.row.operator_address" />
      </template>
    </el-table-column>
    <el-table-column class="name" :label="$t('validator.name')" prop="description.moniker" />
    <el-table-column class="voting-power" :label="$t('validator.votingPower')" prop="tokens">
      <!-- <template slot-scope="record">
        {{ record.row.delegator_shares | formatShares }}
      </template> -->
      <template slot-scope="record">
        {{ percent(record.row.delegator_shares) }}
      </template>
    </el-table-column>
    <el-table-column :label="$t('validator.ranking')" prop="number" />
    <el-table-column
      class="bond-height"
      :label="$t('validator.unBondingHeight')"
      prop="unbonding_height"
    />
  </el-table>
</template>

<script>
export default {
  props: {
    list: {
      required: true,
      type: Array
    },
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      pool: {}
    };
  },
  computed: {
    percent() {
      return function(val) {
        const result = (parseFloat(val) / parseFloat(this.pool.bonded_tokens)) * 100;
        return `${result.toFixed(2)}%`;
      };
    }
  },
  async mounted() {
    this.pool = await this.$store.dispatch("validators/fetchStakingPool");
  }
};
</script>

<style lang="scss">
.jailed {
  color: red;
}

.active {
  color: green;
}
</style>
