<template>
  <div>
    <sub-title title="VALIDATOR OVERVIEW" />
    <div class="content">
      <card
        :title="$t('validator.validatorProfile')"
        v-if="!isEmpty(detail)"
      >
        <data-item :label="$t('validator.operatorAddress')">
          <hg-link
            type="validator"
            :content="detail.operator_address"
            :ellipsis="false"
          />
        </data-item>
        <data-item label="Owner Address">
          <hg-link
            type="address"
            :content="distribution.operator_address"
            :ellipsis="false"
          />
        </data-item>
        <data-item label="Withdraw Address">
          <hg-link
            type="address"
            :content="withDrawAddress"
            :ellipsis="false"
          />
        </data-item>
        <data-item :label="$t('validator.name')">
          <span>{{ detail.description.moniker }}</span>
        </data-item>
        <data-item :label="$t('validator.comissionRate')">
          <span>{{ Number(get(detail, "commission.commission_rates.rate")) * 100 }} %</span>
        </data-item>
        <data-item :label="$t('validator.website')">
          <span>{{ detail.description.website || "-" }}</span>
        </data-item>
        <data-item :label="$t('validator.details')">
          <span>{{ detail.description.details || "-" }}</span>
        </data-item>
      </card>

      <card
        :title="$t('validator.currentStatus')"
        v-if="!isEmpty(detail)"
      >
        <data-item :label="$t('validator.votingPower')">
          <!-- <span>{{ detail.delegator_shares | formatShares }}</span> -->
          <span v-if="!isEmpty(pool)">{{ percent }}</span>
        </data-item>
        <data-item :label="$t('validator.totalBlocks')">
          <span>{{ total.toLocaleString("en-US") }}</span>
        </data-item>
        <data-item :label="$t('validator.jailed')">
          <span>{{ detail.jailed ? "True" : "False" }}</span>
        </data-item>
        <data-item :label="$t('validator.unBondingHeight')">
          <span>{{ detail.unbonding_height || "-" }}</span>
        </data-item>
        <data-item :label="$t('validator.unBondingTime')">
          <span>{{ detail.unbonding_time | formatTime }}</span>
        </data-item>
        <data-item label="Rewards">
          <!-- <span v-if="!isEmpty(distribution)">{{
            distribution.self_bond_rewards[0].amount | formatShares
          }}</span> -->
          <data-amount
            v-if="!isEmpty(distribution)"
            :list="distribution.self_bond_rewards"
          ></data-amount>
        </data-item>
        <data-item label="Commission">
          <!-- <span v-if="!isEmpty(distribution)">{{
            distribution.val_commission[0].amount | formatShares
          }}</span> -->
          <data-amount
            v-if="!isEmpty(distribution)"
            :list="distribution.val_commission"
          ></data-amount>
        </data-item>
      </card>
      <el-row :gutter="24">
        <el-col
          :xs="24"
          :sm="12"
        >
          <card title="Delegations">
            <el-table
              class="table"
              :data="delegations"
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
              <el-table-column label="Delegator Address">
                <template slot-scope="scope">
                  <span
                    class="link"
                    @click="goAddress(scope.row.delegator_address)"
                  >{{ scope.row.delegator_address.slice(0, 20) }}...</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="Validator Address">
                <template slot-scope="scope">
                  <span
                    class="link"
                    @click="goValidator(scope.row.validator_address)"
                  >{{scope.row.validator_address.slice(0,20)}}...</span>
                </template>
              </el-table-column> -->
            </el-table>
            <div class="card-footer">
              <el-pagination
                background
                :pager-count="5"
                layout="prev, pager, next"
                :current-page="currentPageDelegations"
                :page-size="5"
                :total="delegationsTotal"
                @prev-click="onPageChangeDelegations"
                @next-click="onPageChangeDelegations"
                @current-change="onPageChangeDelegations"
              />
            </div>
          </card>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
        >
          <card title="Unbonding Delegations">
            <el-table
              class="table"
              :data="unbondingDelegations"
              style="width: 100%"
              :empty-text="$t('global.noneData')"
            >
              <el-table-column label="Amount">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.entries.balance | formatShares }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Completion Time">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.entries.completion_time | formatTime }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Delegator Address">
                <template slot-scope="scope">
                  <span
                    class="link"
                    @click="goAddress(scope.row.delegator_address)"
                  >{{ scope.row.delegator_address.slice(0, 20) }}...</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="Validator Address">
                <template slot-scope="scope">
                  <span
                    class="link"
                    @click="goValidator(scope.row.validator_address)"
                  >{{scope.row.validator_address.slice(0,20)}}...</span>
                </template>
              </el-table-column> -->
            </el-table>
            <div class="card-footer">
              <el-pagination
                background
                :pager-count="5"
                layout="prev, pager, next"
                :current-page="currentPageUnDelegations"
                :page-size="5"
                :total="unbondingDelegationsTotal"
                @prev-click="onPageChangeUnDelegations"
                @next-click="onPageChangeUnDelegations"
                @current-change="onPageChangeUnDelegations"
              />
            </div>
          </card>
        </el-col>
      </el-row>
      <card title="redelegations">
        <el-table
          class="table"
          :data="redelegations"
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
        <div class="card-footer">
          <el-pagination
            background
            :pager-count="5"
            layout="prev, pager, next"
            :current-page="currentPageRedelegations"
            :page-size="5"
            :total="redelegationsTotal"
            @prev-click="onPageChangeRedelegations"
            @next-click="onPageChangeRedelegations"
            @current-change="onPageChangeRedelegations"
          />
        </div>
      </card>
      <card title="Proposed Blocks">
        <el-table
          class="table"
          :data="list"
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
            prop="header.num_txs"
            :label="$t('block.txn')"
          > </el-table-column>
          <el-table-column
            prop="header.time"
            :label="$t('block.age')"
          >
            <template slot-scope="scope">
              <span>{{ formatTime(scope.row.header.time, currentTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="header.time"
            :label="$t('block.hash')"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.header.app_hash }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="card-footer">
          <el-pagination
            background
            :pager-count="5"
            layout="prev, pager, next"
            :current-page="currentPage"
            :page-size="20"
            :total="total"
            @prev-click="onPageChange"
            @next-click="onPageChange"
            @current-change="onPageChange"
          />
        </div>
      </card>
    </div>
  </div>
</template>

<script>
import { get, isEmpty } from "lodash";
import { mapState } from "vuex";
import ajax from "@/utils/ajax";
import blockMixin from "@/mixins/block";

export default {
  mixins: [blockMixin],
  data() {
    return {
      address: this.$route.params.address,
      gap: 0,
      total: 0,
      currentPage: 1,
      currentPageDelegations: 1,
      currentPageRedelegations: 1,
      currentPageUnDelegations: 1,
      list: [],
      timer: null,
      currentTime: "",
      distribution: {},
      delegations: [],
      redelegations: [],
      unbondingDelegations: [],
      pool: {},
      withDrawAddress: ""
    };
  },
  methods: {
    get,
    isEmpty,
    async fetchList() {
      const address = this.$route.params.address;
      const startId =
        this.total !== 0 ? this.total - (this.currentPage - 1) * 20 - 1 : 0;

      const {
        data: { result }
      } = await ajax.get(`staking/validator/blocks/${address}/${startId}/20`);

      this.total = +result.total;
      this.list = result.blocks;
    },
    onPageChange(page) {
      this.currentPage = page;
      this.fetchList();
    },
    async onPageChangeDelegations(page) {
      this.currentPageDelegations = page;
      this.delegations = await this.$store.dispatch(
        "validators/fetchDelegations",
        {
          address: this.address,
          page: this.currentPageDelegations
        }
      );
    },
    async onPageChangeRedelegations(page) {
      this.currentPageRedelegations = page;
      this.redelegations = await this.$store.dispatch(
        "validators/fetchRedelegations",
        {
          address: this.address,
          page: this.currentPageRedelegations
        }
      );
    },
    async onPageChangeUnDelegations(page) {
      this.currentPageUnDelegations = page;
      this.unbondingDelegations = await this.$store.dispatch(
        "validators/fetchUnbondingDelegations",
        { address: this.address, page: this.currentPageUnDelegations }
      );
    },
    goAddress(address) {
      this.$router.push({ path: `/address/${address}` });
    }
  },
  computed: {
    ...mapState("validators", [
      "details",
      "delegationsTotal",
      "redelegationsTotal",
      "unbondingDelegationsTotal"
    ]),
    detail() {
      return get(this.details, this.address)?.result ?? {};
    },
    percent() {
      const result =
        (parseFloat(this.detail.delegator_shares) /
          parseFloat(this.pool.bonded_tokens)) *
        100;
      return `${result.toFixed(2)}%`;
    }
  },
  async mounted() {
    this.currentTime = await this.fetchCurrentTime();
    this.fetchList();
    this.$store.dispatch("validators/fetchDetail", this.address);
    this.distribution = await this.$store.dispatch(
      "validators/fetchDistribution",
      this.address
    );
    this.$store.dispatch("validators/fetchOutstandingRewards", this.address);
    this.delegations = await this.$store.dispatch(
      "validators/fetchDelegations",
      {
        address: this.address,
        page: this.currentPageDelegations
      }
    );
    this.redelegations = await this.$store.dispatch(
      "validators/fetchRedelegations",
      {
        address: this.address,
        page: this.currentPageRedelegations
      }
    );
    this.unbondingDelegations = await this.$store.dispatch(
      "validators/fetchUnbondingDelegations",
      {
        address: this.address,
        page: this.currentPageUnDelegations
      }
    );
    this.pool = await this.$store.dispatch("validators/fetchStakingPool");
    this.withDrawAddress = await this.$store.dispatch(
      "validators/fetchWithdrawAddress",
      this.distribution.operator_address
    );
    this.timer = setInterval(async () => {
      this.currentTime = await this.fetchCurrentTime();
      this.fetchList();
    }, 8e3);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>
<style lang="scss" scoped>
.link {
  color: blue;
  cursor: pointer;
}
</style>
