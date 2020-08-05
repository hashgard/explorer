<template>
  <div class="home-container">
    <div class="panels">
      <div class="home-panel">
        <p>{{ $t("home.blockHeight") }}</p>
        <span>{{ lastHeight }}</span>
      </div>
      <div class="home-panel">
        <p>
          <router-link to="/txs?module=all">{{ $t("home.txTotal") }}</router-link>
        </p>
        <span>{{ homeTxTotal }}</span>
      </div>
      <div class="home-panel">
        <p>
          <router-link to="/validator">Bonded Tokens</router-link>
        </p>
        <span>{{ bonded }}</span>
      </div>

      <div class="home-panel">
        <p>
          <router-link to="/validator">{{ $t("home.activeValidators") }}</router-link>
        </p>
        <span>{{ validatorList.length }}</span>
      </div>
    </div>

    <el-row :gutter="24">
      <el-col
        :xs="24"
        :sm="24"
      >
        <Card
          title="Blocks"
          link="/block"
        >
          <el-table
            class="table"
            :data="blocksLastList"
            style="width: 100%"
            :empty-text="$t('global.noneData')"
          >
            <el-table-column
              class="height"
              :label="$t('home.blockHeight')"
            >
              <template slot-scope="scope">
                <RouterLink
                  :to="`/block/${scope.row.header.height}`"
                  class="link"
                >{{
                  scope.row.header.height
                }}</RouterLink>
              </template>
            </el-table-column>
            <el-table-column
              class="height"
              :label="$t('block.superNode')"
            >
              <template slot-scope="scope">
                <span>{{ getValidatorName(scope.row.header.height) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="header.num_txs"
              :label="$t('block.txn')"
            />
            <el-table-column :label="$t('block.age')">
              <template slot-scope="scope">
                <span>{{ formatTime(scope.row.header.time, currentTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="header.app_hash"
              :label="$t('block.hash')"
            />
          </el-table>
        </Card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import blockMixin from "@/mixins/block";
import validatorMixin from "@/mixins/validtor";
import BigNumber from "bignumber.js";
import numeral from "numeral";
export default {
  name: "Home",
  data() {
    return {
      currentTime: ""
    };
  },
  mixins: [blockMixin, validatorMixin],
  interval: null,
  computed: {
    ...mapState("basic", ["pool"]),
    ...mapState("blocks", {
      blockList: "list",
      lastHeight: "lastHeight",
      homeTxTotal: "homeTxTotal"
    }),
    ...mapState("validators", { validatorList: "list" }),
    ...mapState("transactions", ["txTotal"]),
    ...mapGetters("blocks", { blocksLastList: "lastList" }),
    ...mapGetters("transactions", { txLastList: "lastList" }),
    bonded() {
      // GARD精度化（除以Math.pow(10, 6)），再转化为兆（除以Math.pow(10, 12)）
      // return `${new BigNumber(this.pool.bonded_tokens / Math.pow(10, 18)).toFixed(5)} M`;
      const amount = `${new BigNumber(
        this.pool.bonded_tokens / Math.pow(10, 6)
      ).toFixed(0)}`;
      return numeral(amount.toString()).format("0,0.[0000]");
    }
  },
  methods: {
    fetchData() {
      this.$store.dispatch("blocks/fetchList");
    },
    fetchLatestBlock() {
      this.$store.dispatch("blocks/fetchLatest");
    }
  },
  async mounted() {
    this.currentTime = await this.fetchCurrentTime();
    await this.$store.dispatch("basic/fetchPool");
    await this.$store.dispatch("validators/fetchAll", "bonded");
    this.fetchData();
    this.fetchLatestBlock();

    this.interval = setInterval(async () => {
      this.currentTime = await this.fetchCurrentTime();
      this.fetchData();
      this.fetchLatestBlock();
    }, 5 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
    this.interval = null;
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  .panels {
    display: flex;
    margin: 0 -1%;
  }

  .home-panel {
    flex-basis: 33%;
    margin: 24px 1% 0;
    text-align: center;
    padding: 24px 0;
    height: 146px;
    overflow: hidden;
    background: white;
    border-radius: 8px;
    box-shadow: $shadow;
    font-size: 1.2em;

    p {
      margin-bottom: 16px;
    }
    span {
      font-size: 36px;
    }
  }
  .item {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 16px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    font-size: 14px;

    > p {
      margin-bottom: 10px;
    }
    > p:last-child {
      margin-bottom: 0;
    }
  }
}

.block > .height {
  flex: 1;
  color: $blue;
}

.block > .txn {
  flex-basis: 100%;
}

.block > .time {
  color: rgba(0, 0, 0, 0.65);
}

.transactions > .gas {
  flex-basis: 100%;
}

@include responsive($sm) {
  .home-container {
    .panels {
      flex-wrap: wrap;
    }
    .home-panel {
      flex-basis: 98%;
    }
  }
}
</style>
