<template>
  <card :title="cardTitlt">
    <div
      class="card-header"
      v-if="$route.query.module != 'all'"
    >
      <span>Total Txs:
        <span v-if="list.length > 0">{{list[0].id}}</span>
        <span v-else>0</span>
      </span>
    </div>
    <transaction-list
      :list="list"
      :fields="fields"
      :load="load"
    />
    <p
      v-if="txLastPage"
      class="load-more"
      @click="loadMore"
    >{{ $t("global.loadMore") }}</p>
  </card>
</template>

<script>
import { mapState } from "vuex";
import { txTypes, txListFieldsMap } from "@/constants";
import { get } from "lodash";

export default {
  data() {
    return {
      // selected_key: Object.keys(txTypes[this.$route.query.module])[0]
      selected_key: ""
    };
  },
  computed: {
    ...mapState("transactions", ["list", "load", "txLastPage"]),
    txList() {
      const result = this.list.filter(i => get(i, "logs.0.success") === true);

      return result;
    },
    cardTitlt() {
      const titles = {
        bank: this.$t("txCate.bank"),
        staking: this.$t("txCate.staking"),
        governance: this.$t("txCate.governance"),
        record: "存证",
        all: this.$t("txCate.all"),
        migrate: this.$t("txCate.migrate"),
        distribution: this.$t("txCate.distribution"),
        grid999: this.$t("txCate.grid999")
      };

      return titles[this.$route.query.module];
    },
    actions() {
      return txTypes[this.$route.query.module];
    },
    fields() {
      // return txListFieldsMap[this.selected_key];
      // return txListFieldsMap["all"];
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
    },
    selected() {
      return this.selected_key.match("-")
        ? this.selected_key.split("-")
        : [this.selected_key, ""];
    }
  },
  methods: {
    onSelect(value) {
      this.selected_key = value;
      this.fetchData();
    },
    async fetchData() {
      const params = {
        module: this.$route.query.module,
        id: ""
      };
      this.$store.dispatch("transactions/fetchList", params);
    },
    loadMore() {
      const params = {
        module: this.$route.query.module,
        id: parseInt(this.list[this.list.length - 1].id) - 1
      };
      if (params.id > 0) {
        this.$store.dispatch("transactions/fetchList", params);
      }
    }
  },
  mounted() {
    this.fetchData();
  },
  beforeDestroy() {
    this.$store.commit("transactions/setListEmpty");
  },
  watch: {}
};
</script>

<style lang="scss">
.height {
  color: $blue;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.select-action {
  font-size: 16px;
  margin-right: 16px;
}
.load-more {
  text-align: center;
  color: blue;
  padding: 10px 0 0;
  cursor: pointer;
}
</style>
