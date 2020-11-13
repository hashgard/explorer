<template>
  <el-table
    class="table"
    :data="list"
    v-loading="load"
    style="width: 100%"
    :empty-text="$t('global.noneData')"
  >
    <el-table-column
      v-for="item in fields"
      :key="item.name"
      :label="item.name_zh"
      :width="item.width"
    >
      <template slot-scope="scope">
        <hg-link
          v-if="item.linkType"
          :type="item.linkType"
          :content="get(scope.row, item.field)"
          :action="action(scope.row)"
        />
        <span v-if="!item.linkType">
          <data-amount
            v-if="get(scope.row, item.field) instanceof Array"
            :list="get(scope.row, item.field)"
          />
          <data-amount
            v-else-if="get(scope.row, item.field) instanceof Object"
            :list="[get(scope.row, item.field)]"
          />
          <data-amount
            v-else-if="item.name === 'Rewards'"
            :list="rewardList(scope.row, item.field)"
          />
          <span v-else-if="item.name === 'Amount'">
            <data-amount
              v-if="action(scope.row) == 'send' || action(scope.row) == 'erc20-migrate'"
              :list="get(scope.row, 'tx.value.msg.0.value.amount')"
            />
            <data-amount
              v-else-if="
                action(scope.row) == 'delegate' || action(scope.row) == 'begin_redelegate' || action(scope.row) == 'begin_unbonding'
              "
              :list="[get(scope.row, 'tx.value.msg.0.value.amount')]"
            />
            <span v-else-if="action(scope.row) == 'withdraw_delegator_reward'">
              <data-amount
                v-if="!isEmpty(withdrawRewardList(scope.row))"
                :list="withdrawRewardList(scope.row)"
              />
              <span v-else>-</span>
            </span>
            <span v-else-if="action(scope.row) == 'grid999_dapp_withdraw'">
              <data-amount
                v-if="!isEmpty(gridWithdrawRewards(scope.row))"
                :list="gridWithdrawRewards(scope.row)"
              />
              <span v-else>-</span>
            </span>
            <span v-else-if="action(scope.row) == 'grid999_dapp_deposit' || action(scope.row) == 'grid999_dapp_create_grid'">
              <data-amount
                v-if="!isEmpty(grid999DappDeposit(scope.row))"
                :list="grid999DappDeposit(scope.row)"
              />
              <span v-else>-</span>
            </span>

            <span v-else>-</span>
          </span>
          <span v-else-if="item.name.match('Time')">
            {{ get(scope.row, item.field) | formatTime }}
          </span>
          <span v-else-if="item.name === 'Proposal Type'">
            {{ (get(scope.row, item.field) || '').split('/')[1] }}
          </span>
          <data-amount
            v-else-if="item.name === 'Send Amount'"
            :list="rewardList(scope.row, item.field)"
          />
          <span v-else-if="item.name === 'action'">
            {{ action(scope.row) }}
          </span>
          <span v-else>
            <span v-if="item.name === 'Hash'">{{ (get(scope.row, item.field) || '-').slice(0, 18) + '...' }}</span>
            <span v-else>{{ get(scope.row, item.field) || '-' }}</span>
          </span>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { isEmpty, get, find, findLast } from "lodash";

export default {
  props: {
    list: Array,
    fields: Array,
    load: { type: Boolean, default: false }
  },
  computed: {
    recipientRewards() {
      return detail => {
        const eventsMessage = get(detail, "events", []).filter(
          item => item.type === "transfer"
        );
        const action =
          find(get(eventsMessage[0], "attributes"), {
            key: "amount"
          }) || {};
        if (!isEmpty(action)) {
          if (action.value) {
            const list = action.value.split(",");
            const result = [];
            list.forEach(i => {
              const denom = i.replace(/[^a-z]/gi, "");
              const amount = i.replace(/[^0-9]/gi, "");
              result.push({ denom, amount });
            });
            return result;
          } else {
            return [];
          }
        } else {
          return [];
        }
      };
    },
    contractAddress() {
      return row => {
        const result = [];

        get(row, "tx.events", []).forEach(i => {
          i.attributes.forEach(k => {
            result.push(k);
          });
        });

        const address = find(result, i => i.key === "contract_address");

        return !isEmpty(address) ? address.value : "";
      };
    },
    action() {
      return item => {
        const eventsMessage = get(item, "events", []).filter(
          i => i.type === "message"
        );
        const action =
          find(get(eventsMessage[0], "attributes"), {
            key: "action"
          }) || {};

        return action.value;
      };
    },
    gridWithdrawRewards() {
      return function(detail) {
        const eventsMessage = get(detail, "events", []).filter(
          item => item.type === "grid_withdraw"
        );
        const action =
          find(get(eventsMessage[0], "attributes"), {
            key: "rewards"
          }) || {};
        if (!isEmpty(action)) {
          if (action.value) {
            const list = action.value.split(",");
            const result = [];
            list.forEach(i => {
              const denom = i.replace(/[^a-z]/gi, "");
              const amount = i.replace(/[^0-9]/gi, "");
              result.push({ denom, amount });
            });
            return result;
          } else {
            return [];
          }
        } else {
          return [];
        }
      };
    },
    grid999DappDeposit() {
      return function(detail) {
        return [detail.tx.value.msg[0].value.deposit];
      };
    }
  },
  methods: {
    get,
    isEmpty,
    rewardList(row, key) {
      const val = get(row, key);

      return !isEmpty(val)
        ? [{ denom: "ugard", amount: val.replace(/[^0-9]/gi, "") }]
        : [];
    },
    withdrawRewardList(detail) {
      const eventsMessage = get(detail, "events", []).filter(
        item => item.type === "withdraw_rewards"
      );
      let list;
      if (detail.index >= 0) {
        const reward = get(eventsMessage[0], "attributes", []).filter(
          i => i.key == "amount"
        );
        if (isEmpty(reward)) {
          return [
            { denom: "ugard", amount: 0 },
            { denom: "uggt", amount: 0 }
          ];
        }
        if (!isEmpty(reward[detail.index])) {
          if (reward[detail.index].value) {
            list = reward[detail.index].value.split(",");
          } else {
            list = [];
          }
        } else {
          list = [];
        }
      } else {
        const reward =
          find(get(eventsMessage[0], "attributes"), {
            key: "amount"
          }) || {};
        if (isEmpty(reward)) {
          return [
            { denom: "ugard", amount: 0 },
            { denom: "uggt", amount: 0 }
          ];
        }
        if (reward.value) {
          list = reward.value.split(",");
        } else {
          list = [];
        }
      }
      const result = [];
      list.forEach(i => {
        const denom = i.replace(/[^a-z]/gi, "");
        const amount = i.replace(/[^0-9]/gi, "");
        result.push({ denom, amount });
      });
      return result;
    },
    goDetail(hash) {
      const routeData = this.$router.resolve({ path: `/tx/${hash}` });

      window.open(routeData.href, "_blank");
    }
  }
};
</script>
<style lang="scss" scoped>
.main-color {
  color: #3a2b7e;
  cursor: pointer;
}
</style>
