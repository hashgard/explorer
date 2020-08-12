<template>
  <div v-if="detail">
    <sub-title
      :title="$t('home.blockHeight')"
      :sub="`#${height}`"
    />
    <div class="block-detail-content">
      <card :title="$t('block.blockInformation')">
        <data-item :label="$t('home.blockHeight')">
          <span>{{ detail.header.height }}</span>
        </data-item>
        <data-item :label="$t('block.timestamp')">
          <span>{{ detail.header.time }}</span>
        </data-item>
        <data-item :label="$t('block.hash')">
          <span>{{ detail.header.app_hash }}</span>
        </data-item>
        <data-item :label="$t('block.transactionsNumber')">
          <span>{{ detail.header.num_txs }}</span>
        </data-item>
        <data-item :label="$t('block.proposerAddress')">
          <hg-link
            type="validator"
            :content="get(consPubMap, [get(proposers, [height, 'pub_key']), 'operator_address'])"
            :ellipsis="false"
          />
        </data-item>
      </card>
      <card :title="$t('block.lastBlock')">
        <data-item :label="$t('block.lastBlockHash')">
          {{ detail.last_commit.block_id.hash }}
        </data-item>
      </card>
      <card :title="$t('home.tx')">
        <transaction-list
          :fields="fields"
          :list="transactionList"
        />
      </card>
      <card
        v-if="validatorList"
        :title="$t('block.validators')"
      >
        <validator-list :list="validatorList" />
      </card>
    </div>
  </div>
</template>

<script>
import { get, isEmpty, chunk, find } from "lodash";
import { mapState } from "vuex";
import sha256 from "crypto-js/sha256";
import Base64 from "crypto-js/enc-base64";

export default {
  data() {
    const fields = [
      {
        name: "Time",
        name_zh: this.$t("tx.time"),
        field: "timestamp",
        linkType: ""
      },
      {
        name: "Txhash",
        name_zh: this.$t("tx.tx"),
        field: "txhash",
        linkType: "tx"
      },
      {
        name: "Block",
        name_zh: this.$t("tx.block"),
        field: "height",
        linkType: "block"
      },
      {
        name_zh: "Fee",
        name: "Fee",
        field: "tx.value.fee.amount",
        linkType: ""
      },
      {
        name_zh: "Amount",
        name: "Amount",
        field: "",
        linkType: ""
      },
      {
        name: "action",
        name_zh: this.$t("tx.action"),
        field: "",
        linkType: ""
      },
      {
        name: "Memo",
        name_zh: this.$t("tx.memo"),
        field: "tx.value.memo",
        linkType: ""
      }
    ];

    return {
      height: this.$route.params.id,
      fields,
      num: 0,
      blockTx: []
    };
  },
  computed: {
    ...mapState("blocks", {
      blockDetails: "details",
      proposers: "proposers",
      validatorsets: "validatorsets"
    }),
    ...mapState("transactions", {
      transactionDetails: "details",
      load: "load"
    }),
    ...mapState("validators", ["consPubMap"]),

    detail() {
      const { height, blockDetails } = this;

      return get(blockDetails, [height, "block"]);
    },

    txs() {
      if (isEmpty(this.detail)) {
        return false;
      }

      const txs = this.detail.data.txs;

      return isEmpty(txs) ? false : txs.map(this.decodeTx);
    },

    transactionList() {
      const { txs, transactionDetails } = this;

      if (isEmpty(txs)) {
        return null;
      }
      const list = txs
        .map(hash => get(transactionDetails, [hash]))
        .filter(item => !!item);
      let result = [];
      list.forEach(item => {
        const eventsMessage = get(item, "events", []).filter(
          i => i.type === "message"
        );
        const action =
          find(get(eventsMessage[0], "attributes"), {
            key: "action"
          }) || {};
        if (action.value == "withdraw_delegator_reward") {
          const msg = get(item, "tx.value.msg");
          msg.forEach((m, index) => {
            result.push({ ...item, index });
          });
        } else {
          result.push(item);
        }
      });
      return result;
    },

    validatorList() {
      const { height, validatorsets, consPubMap } = this;
      const validatorset = get(validatorsets, [height, "validators"]);

      if (isEmpty(validatorset) || isEmpty(consPubMap)) {
        return [];
      }

      return validatorset.map(i => get(consPubMap, [i.pub_key]));
    }
  },
  methods: {
    get,
    chunk,
    decodeTx(tx) {
      return sha256(Base64.parse(tx))
        .toString()
        .toUpperCase();
    },
    async fetchData() {
      if (isEmpty(this.consPubMap)) {
        this.$store.dispatch("validators/fetchAll", "bonded");
      }

      const height = this.height;
      const data = await this.$store.dispatch("blocks/fetchDetail", height);
      const txs = data.block.data.txs;

      if (isEmpty(txs)) {
        return;
      }

      // 优化分批加载
      const txhashArr = txs.map(this.decodeTx);

      this.blockTx = chunk(txhashArr, 10);
      this.getTxData();
      // txs
      //   .map(this.decodeTx)
      //   .map(hash => this.$store.dispatch("transactions/fetch", hash));
    },
    getTxData() {
      if (this.num >= this.blockTx.length) {
        return;
      }

      this.blockTx[this.num].forEach(hash =>
        this.$store.dispatch("transactions/fetch", hash)
      );

      this.num += 1;

      setTimeout(() => {
        this.getTxData();
      }, 1000);
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>
