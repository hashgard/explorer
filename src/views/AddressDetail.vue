<template>
  <div>
    <sub-title
      title="ADDRESS"
      :sub="address"
    />
    <div
      class="address-detail-content"
      v-if="info"
    >
      <card title="Address Information">
        <data-item label="Balance">
          <data-amount
            v-if="!isEmpty(info)"
            :list="info"
          />
          <span v-else>-</span>
        </data-item>
        <data-item label="Withdraw To">
          <hg-link
            type="address"
            :content="withdrawAddress"
            :ellipsis="false"
          />
        </data-item>
      </card>
      <card title="delegations">
        <data-item
          label="Total Balance"
          v-if="!isEmpty(addressDelegators)"
        >
          <data-amount :list="[{denom: 'ugard', amount: addressDelegationsBalance}]" />
        </data-item>
        <data-item
          label="Total Shares"
          v-if="!isEmpty(addressDelegators)"
        >
          <data-amount :list="[{denom: 'ugard', amount: addressDelegationsShares}]" />
        </data-item>
        <el-table
          class="table"
          :data="addressDelegators"
          style="width: 100%"
          :empty-text="$t('global.noneData')"
        >
          <el-table-column label="Amount">
            <template slot-scope="scope">
              <span>{{ scope.row.balance | formatShares }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Shares">
            <template slot-scope="scope">
              <span>{{ scope.row.shares | formatShares }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Validator Address">
            <template slot-scope="scope">
              <hg-link
                type="validator"
                :ellipsis="false"
                :content="scope.row.validator_address"
              ></hg-link>
            </template>
          </el-table-column>
        </el-table>
      </card>
      <card title="redelegations">
        <el-table
          class="table"
          :data="addressRedelegations"
          style="width: 100%"
          :empty-text="$t('global.noneData')"
        >
          <el-table-column label="Amount">
            <template slot-scope="scope">
              <span>{{ scope.row.entries.balance | formatShares }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Completion Time">
            <template slot-scope="scope">
              <span>{{scope.row.entries.completion_time | formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Creation Height">
            <template slot-scope="scope">
              <hg-link
                type="block"
                :ellipsis="false"
                :content="scope.row.entries.creation_height.toString()"
              ></hg-link>
            </template>
          </el-table-column>
          <el-table-column label="Validator From">
            <template slot-scope="scope">
              <hg-link
                type="validator"
                :ellipsis="false"
                :content="scope.row.validator_src_address"
              ></hg-link>
            </template>
          </el-table-column>
          <el-table-column label="Validator To">
            <template slot-scope="scope">
              <hg-link
                type="validator"
                :ellipsis="false"
                :content="scope.row.validator_dst_address"
              ></hg-link>
            </template>
          </el-table-column>
        </el-table>
      </card>
      <card title="unbonding delegations">
        <el-table
          class="table"
          :data="addressUnbonding"
          style="width: 100%"
          :empty-text="$t('global.noneData')"
        >
          <el-table-column label="Amount">
            <template slot-scope="scope">
              <span>{{ scope.row.entries[0].balance | formatShares }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Completion Time">
            <template slot-scope="scope">
              <span>{{scope.row.entries[0].completion_time | formatTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Creation Height">
            <template slot-scope="scope">
              <hg-link
                type="block"
                :ellipsis="false"
                :content="scope.row.entries[0].creation_height.toString()"
              ></hg-link>
            </template>
          </el-table-column>
          <el-table-column label="Validator Address">
            <template slot-scope="scope">
              <hg-link
                type="validator"
                :ellipsis="false"
                :content="scope.row.validator_address"
              ></hg-link>
            </template>
          </el-table-column>
        </el-table>
      </card>
      <card title="Delegator Rewards">
        <data-item
          label="Total Rewards"
          v-if="!isEmpty(rewards.total)"
        >
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
              <hg-link
                type="validator"
                :content="scope.row.validator_address"
                :ellipsis="false"
              />
            </template>
          </el-table-column>
        </el-table>
      </card>
      <card title="Transaction List">
        <transaction-list
          :fields="fields"
          :load="load"
          :list="transactionList"
        />
        <p
          v-if="txLastPage"
          class="load-more"
          @click="loadMore"
        >{{ $t("global.loadMore") }}</p>
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
        id:
          parseInt(this.transactionList[this.transactionList.length - 1].id) - 1
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
      txLastPage: "txLastPage",
      addressDelegators: "addressDelegators",
      addressDelegationsShares: "addressDelegationsShares",
      addressDelegationsBalance: "addressDelegationsBalance",
      addressRedelegations: "addressRedelegations",
      addressUnbonding: "addressUnbonding"
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
          linkType: "block",
          width: 100
        },
        {
          name_zh: "Fee",
          name: "Fee",
          field: "tx.value.fee.amount",
          linkType: "",
          width: 100
        },
        {
          name_zh: "Amount",
          name: "Amount",
          field: "",
          linkType: ""
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
    this.$store.dispatch("transactions/fetchAddressDelegators", this.address);
    this.$store.dispatch(
      "transactions/fetchAddressRedelegations",
      this.address
    );
    this.$store.dispatch("transactions/fetchAddressUnbonding", this.address);
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
