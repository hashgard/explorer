<template>
  <card title="HOLDERS">
    <div class="card-header">
      <div class="select-action">
        <el-select
          v-model="selected_key"
          size="small"
          @change="onSelect"
        >
          <el-option
            value="ugard"
            label="GARD"
          />
          <el-option
            value="uggt"
            label="GGT"
          />
        </el-select>
      </div>
    </div>
    <el-table
      v-if="!isEmpty(holdersList)"
      :data="holdersList"
      style="width: 100%"
      :empty-text="$t('global.noneData')"
    >
      <!-- <el-table-column
        label="Index"
        type="index"
        width="100"
      >
      </el-table-column> -->
      <el-table-column label="Balance">
        <template slot-scope="scope">
          <data-amount :list="amount(scope.row.balance)" />
        </template>
      </el-table-column>
      <el-table-column
        label="Delegations"
        v-if="selected_key == 'ugard'"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.delegations == 0">-</span>
          <data-amount
            v-else
            :list="delegations(scope.row.delegations)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="Total"
        v-if="selected_key == 'ugard'"
      >
        <template slot-scope="scope">
          <data-amount :list="total(scope.row.total)" />
        </template>
      </el-table-column>
      <el-table-column label="Address">
        <template slot-scope="scope">
          <hg-link
            type="address"
            :content="scope.row.address"
            :ellipsis="false"
          />
        </template>
      </el-table-column>
    </el-table>
    <p
      v-if="holdersLastPage"
      class="load-more"
      @click="loadMore"
    >{{ $t("global.loadMore") }}</p>
  </card>
</template>
<script>
import { mapState } from "vuex";
import { isEmpty } from "lodash";
export default {
  data() {
    return {
      selected_key: "ugard"
    };
  },
  computed: {
    ...mapState("transactions", ["holdersList", "load", "holdersLastPage"]),
    amount() {
      return function(val) {
        return [{ denom: this.selected_key, amount: parseInt(val) }];
      };
    },
    delegations() {
      return function(val) {
        return [{ denom: "ugard", amount: val }];
      };
    },
    total() {
      return function(val) {
        return [{ denom: this.selected_key, amount: val }];
      };
    }
  },
  methods: {
    isEmpty,
    onSelect() {
      this.$store.commit("transactions/setHoldersListEmpty");
      const params = {
        denom: this.selected_key,
        id: ""
      };
      this.$store.dispatch("transactions/fetchHoldersList", params);
    },
    loadMore() {
      const params = {
        denom: this.selected_key,
        id: this.holdersList[this.holdersList.length - 1].balance
      };
      this.$store.dispatch("transactions/fetchHoldersList", params);
    }
  },
  mounted() {
    const params = {
      denom: this.selected_key,
      id: ""
    };
    this.$store.dispatch("transactions/fetchHoldersList", params);
  },
  beforeDestroy() {
    this.$store.commit("transactions/setHoldersListEmpty");
  }
};
</script>
<style lang="scss" scoped>
</style>