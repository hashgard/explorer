<template>
  <div>
    <sub-title
      :title="$t('proposals.proposals')"
      :sub="id"
    />
    <div class="content">
      <card
        :title="$t('proposals.detail')"
        v-if="!isEmpty(detail)"
      >
        <data-item label="ID">
          <span>{{ detail.id}}</span>
        </data-item>
        <data-item :label="$t('proposals.type')">
          <span>{{ contentType(detail.content.type) }}</span>
        </data-item>
        <data-item :label="$t('proposals.status')">
          <span>{{ detail.proposal_status }}</span>
        </data-item>
        <data-item :label="$t('proposals.submitTime')">
          <span>{{ detail.submit_time | formatTime }}</span>
        </data-item>
        <data-item :label="$t('proposals.depositEndTime')">
          <span>{{ detail.deposit_end_time | formatTime }}</span>
        </data-item>
        <data-item :label="$t('proposals.totalDeposit')">
          <data-amount :list="detail.total_deposit" />
        </data-item>
      </card>

      <card
        :title="$t('proposals.content')"
        v-if="content"
      >
        <data-item
          v-for="(value, key) in content"
          :key="key"
          :label="$t(`proposals.${key}`)"
        >
          <span>{{ isEmpty(value) ? '-' : value }}</span>
        </data-item>
      </card>
      <card title="Parameter adjustment">
        <div
          class="changes"
          v-if="get(detail, 'content.value.changes')"
        >

          <div
            v-for="(item, index) in get(detail, 'content.value.changes')"
            :key="index"
            class="params"
          >
            <span class="label">{{item.subspace}}/{{item.key}}</span>
            <span>Adjusted To: {{item.value}}</span>
          </div>
        </div>
      </card>
      <card title="VOTING LIST">
        <el-table
          class="table"
          :data="voteList"
          style="width: 100%"
          :empty-text="$t('global.noneData')"
        >
          <el-table-column label="Option">
            <template slot-scope="scope">
              <span :class="scope.row.option">{{scope.row.option}}</span>
            </template>
          </el-table-column>
          <el-table-column label="Voter">
            <template slot-scope="scope">
              <span
                v-if="isValidator(scope.row.voter) != ''"
                class="validator"
                @click="goValidator(isValidator(scope.row.voter).address)"
              >{{isValidator(scope.row.voter).name}}</span>
              <hg-link
                v-else
                type="address"
                :content="scope.row.voter"
                :ellipsis="false"
              />
            </template>
          </el-table-column>
        </el-table>
      </card>
      <card
        :title="$t('proposals.votingStatus')"
        v-if="!isEmpty(detail) && detail.proposal_status !== 'DepositPeriod'"
      >
        <data-item :label="$t('proposals.votingStartTime')">
          <span>{{ detail.voting_start_time | formatTime }}</span>
        </data-item>
        <data-item :label="$t('proposals.votingEndTime')">
          <span>{{ detail.voting_end_time | formatTime }}</span>
        </data-item>
        <data-item :label="$t('proposals.votingResult')">
          <div class="voting-result">
            <div class="yes">
              <span>{{detail.final_tally_result.yes}}</span>
              <p>YES</p>
            </div>
            <div class="no">
              <span>{{detail.final_tally_result.no}}</span>
              <p>NO</p>
            </div>
            <div class="veto">
              <span>{{detail.final_tally_result.no_with_veto}}</span>
              <p>NO WITH VETO</p>
            </div>
            <div class="abstain">
              <span>{{detail.final_tally_result.abstain}}</span>
              <p>ABSTAIN</p>
            </div>
          </div>
        </data-item>
      </card>
    </div>
  </div>
</template>

<script>
import { get, isEmpty } from "lodash";
import { mapState } from "vuex";

export default {
  data() {
    return {
      id: this.$route.params.id
    };
  },
  methods: {
    get,
    isEmpty,
    contentType(val) {
      return val.split("/")[1];
    },
    goValidator(val) {
      this.$router.push({ path: `/validator/${val}` });
    }
  },
  computed: {
    ...mapState("proposals", ["details", "voteList"]),
    ...mapState("validators", ["validators"]),
    isValidator() {
      return function(address) {
        const result = this.validators.filter(i => {
          return i.owner == address;
        });
        if (result.length > 0) {
          return result[0];
        } else {
          return "";
        }
      };
    },
    labelChange() {
      return function(params) {
        return `${params.subspace}/${params.key}`;
      };
    },
    detail() {
      return this.$store.state.proposals.details[+this.id]?.result ?? {};
    },
    content() {
      if (isEmpty(this.detail)) {
        return null;
      }
      const detail = this.detail.content.value;
      const info = detail.apply_info;
      const result = {
        title: detail.title,
        applyInstructions: detail.description
      };

      const orgTypes = {
        A: "supervisorOrg",
        B: "accountingOrg",
        C: "businessService",
        D: "dataSync"
      };

      const skipProps = [
        "id",
        "disabled",
        "node_disabled",
        "records",
        "apply_proposal_id",
        "quit_proposal_id",
        "created_time"
      ];

      // Object.entries(info)
      //   .filter(([key]) => !skipProps.includes(key))
      //   .forEach(([key, value]) => {
      //     if (key === "category") {
      //       result[key] = this.$t(`apply.${orgTypes[value]}`);
      //     } else {
      //       result[key] = value;
      //     }
      //   });

      return result;
    }
  },
  async mounted() {
    await this.$store.dispatch("proposals/fetchDetail", this.id);

    await this.$store.dispatch("proposals/fetchVoteList", this.id);
    await this.$store.dispatch("validators/fetchValidators");
  }
};
</script>

<style lang="scss" scoped>
.voting-result {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  text-align: center;
  & > div {
    flex-basis: 120px;
    span {
      font-size: 24px;
    }
  }
  .yes {
    color: green;
  }
  .no {
    color: orange;
  }
  .veto {
    color: red;
  }
}
.params {
  margin-bottom: 12px;
  > .label {
    font-weight: bolder;
    margin-right: 20px;
  }
}
.Yes {
  color: green;
}
.No {
  color: red;
}
.validator {
  color: blue;
  cursor: pointer;
}
</style>
