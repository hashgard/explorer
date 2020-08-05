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
        <!-- <data-item :label="$t('proposals.totalDeposit')">
          <data-amount :list="detail.total_deposit" />
        </data-item> -->
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
    }
  },
  computed: {
    ...mapState("proposals", ["details"]),
    detail() {
      return this.$store.state.proposals.details[+this.id]?.result ?? {};
    },
    content() {
      if (isEmpty(this.detail)) {
        return null;
      }
      console.log(this.detail);
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
  mounted() {
    this.$store.dispatch("proposals/fetchDetail", this.id);
  }
};
</script>

<style lang="scss">
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
</style>
