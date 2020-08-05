<template>
  <card title="BLOCKS">
    <div class="card-header">
      <p>{{ $t("home.blockHeight") }}: {{ lastHeight }}</p>
    </div>
    <el-table class="table" :data="list" style="width: 100%" :empty-text="$t('global.noneData')">
      <el-table-column class="height" :label="$t('home.blockHeight')">
        <template slot-scope="scope">
          <RouterLink :to="`/block/${scope.row.header.height}`" class="link">{{
            scope.row.header.height
          }}</RouterLink>
        </template>
      </el-table-column>
      <el-table-column class="height" :label="$t('block.superNode')">
        <template slot-scope="scope">
          <span>{{ getValidatorName(scope.row.header.height) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="header.num_txs" :label="$t('block.txn')" />
      <!-- <el-table-column :label="$t('block.validators')">
        <template slot-scope="scope">
          <span>{{ get(scope, 'row.validators.length') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        :label="$t('block.validators')"
      >
        <template slot-scope="scope">
          <span>{{ countVotingPower(scope.row.validators) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('block.age')">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.header.time, currentTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="header.app_hash" :label="$t('block.hash')" />
    </el-table>
    <div class="card-footer">
      <el-pagination
        class="pagination"
        background
        :pager-count="5"
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="lastHeight"
        @prev-click="onPageChange"
        @next-click="onPageChange"
        @current-change="onPageChange"
      />
    </div>
  </card>
</template>

<script>
import { get } from "lodash";
import Card from "@/components/Card";
import { mapGetters, mapState } from "vuex";
import blockMixin from "@/mixins/block";
import validatorMixin from "@/mixins/validtor";

export default {
  mixins: [blockMixin, validatorMixin],
  components: { Card },
  data() {
    return {
      timer: Infinity,
      currentTime: ""
    };
  },
  computed: {
    ...mapGetters("blocks", ["list"]),
    ...mapState("blocks", ["lastHeight", "currentPage", "pageSize"])
  },
  methods: {
    get,
    countVotingPower(validators) {
      if (!validators) {
        return "";
      }

      return validators.reduce((prev, current) => prev + Number(current.voting_power), 0);
    },
    onPageChange(page) {
      const { pageSize, lastHeight } = this;
      const maxHeight = lastHeight - pageSize * (page - 1) + 1;
      const minHeight = Math.max(0, lastHeight - pageSize * page);

      this.$store.dispatch("blocks/fetchList", { page, maxHeight, minHeight });
    }
  },
  async mounted() {
    this.currentTime = await this.fetchCurrentTime();
    this.$store.dispatch("blocks/fetchList");
    this.timer = setInterval(async () => {
      this.currentTime = await this.fetchCurrentTime();
      this.$store.dispatch("blocks/fetchList");
    }, 5e3);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss">
.height {
  color: $blue;
}

.card-header {
  margin-bottom: 24px;
}
.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>
