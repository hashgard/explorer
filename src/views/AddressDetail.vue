<template>
  <div>
    <sub-title title="ADDRESS" :sub="address" />
    <div class="address-detail-content" v-if="info">
      <card title="Address Information">
        <data-item label="Balance">
          <data-amount :list="info" />
        </data-item>
        <data-item label="Withdraw To">
          <hg-link type="address" :content="withdrawAddress" :ellipsis="false" />
        </data-item>
      </card>
      <card title="Delegator Rewards">
        <data-item label="Total Rewards" v-if="!isEmpty(rewards)">
          <data-amount :list="rewards.total" />
        </data-item>
        <el-table
          v-if="!isEmpty(rewards)"
          :data="rewards.rewards"
          style="width: 100%"
          :empty-text="$t('global.noneData')"
        >
          <el-table-column label="Rewards">
            <template slot-scope="scope">
              <data-amount :list="scope.row.reward" />
            </template>
          </el-table-column>
          <el-table-column label="Validator Address">
            <template slot-scope="scope">
              <hg-link type="validator" :content="scope.row.validator_address" :ellipsis="false" />
            </template>
          </el-table-column>
        </el-table>
      </card>
      <card title="Transaction List">
        <transaction-list :fields="fields" :load="load" :list="transactionList" />
        <p v-if="txLastPage" class="load-more" @click="loadMore">{{ $t("global.loadMore") }}</p>
      </card>
    </div>
  </div>
</template>

<script>
import { get, isEmpty } from "lodash";
import { mapState } from "vuex";

import { txListFieldsMap } from "@/constants";

export default {
  data() {
    return { txListFieldsMap, withdrawAddress: "" };
  },
  methods: {
    get,
    isEmpty,
    loadMore() {
      const params = {
        address: this.address,
        id: parseInt(this.transactionList[this.transactionList.length - 1].id) - 1
      };
      this.$store.dispatch("transactions/fetchAddressTxList", params);
    }
  },

  computed: {
    ...mapState("address", ["info"]),
    ...mapState("validators", ["rewards"]),
    ...mapState("transactions", {
      transactionList: "list",
      load: "load",
      txLastPage: "txLastPage"
    }),
    address() {
      return this.$route.params.address;
    },
    fields() {
      return [
        {
          name_zh: this.$t("tx.time"),
          name: "Time",
          field: "timestamp",
          linkType: ""
        },
        {
          name_zh: this.$t("tx.tx"),
          name: "txhash",
          field: "txhash",
          linkType: "tx"
        },
        {
          name_zh: this.$t("tx.block"),
          name: "block",
          field: "height",
          linkType: "block"
        },
        {
          name_zh: this.$t("tx.action"),
          name: "action",
          field: "",
          linkType: ""
        },
        {
          name_zh: this.$t("tx.memo"),
          name: "memo",
          field: "tx.value.memo",
          linkType: ""
        }
      ];
    }
  },

  beforeRouteUpdate(to, from, next) {
    const address = to.params.address;

    this.$store.dispatch("address/fetch", address);

    this.$store.dispatch("transactions/fetchAddressTxList", {
      address: address,
      id: ""
    });

    next();
  },

  async mounted() {
    this.$store.dispatch("address/fetch", this.address);
    this.$store.dispatch("validators/fetchRewards", this.address);
    this.withdrawAddress = await this.$store.dispatch(
      "validators/fetchWithdrawAddress",
      this.address
    );
    this.$store.dispatch("transactions/fetchAddressTxList", {
      address: this.address,
      id: ""
    });
  },
  beforeDestroy() {
    this.$store.commit("transactions/setListEmpty");
  }
};
</script>
