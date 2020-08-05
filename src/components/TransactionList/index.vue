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
            v-if="(get(scope.row, item.field) instanceof Array)"
            :list="get(scope.row, item.field)"
          />
          <data-amount
            v-else-if="(get(scope.row, item.field) instanceof Object)"
            :list="[get(scope.row, item.field)]"
          />
          <data-amount
            v-else-if="item.name === 'Rewards'"
            :list="rewardList(scope.row, item.field)"
          />
          <data-amount
            v-else-if="item.name === 'Amount'"
            :list="get(scope.row, item.field)"
          />
          <span v-else-if="item.name.match('Time')">
            {{ get(scope.row, item.field) | formatTime }}
          </span>
          <span v-else-if="item.name === 'Proposal Type'">
            {{ (get(scope.row, item.field) || "").split("/")[1] }}
          </span>
          <data-amount
            v-else-if="item.name === 'Send Amount'"
            :list="rewardList(scope.row, item.field)"
          />
          <span v-else-if="item.name === 'action'">
            {{ action(scope.row) }}
          </span>
          <span v-else>
            <span v-if="item.name === 'Hash'">{{
              (get(scope.row, item.field) || "-").slice(0, 18) + "..."
            }}</span>
            <span v-else>{{ get(scope.row, item.field) || "-" }}</span>
          </span>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { isEmpty, get, find } from "lodash";

export default {
  props: {
    list: Array,
    fields: Array,
    load: { type: Boolean, default: false }
  },
  computed: {
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
    }
  },
  methods: {
    get,
    rewardList(row, key) {
      const val = get(row, key);

      return !isEmpty(val)
        ? [{ denom: "ugard", amount: val.replace(/[^0-9]/gi, "") }]
        : [];
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
