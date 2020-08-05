<template>
  <el-table
    class="table"
    :data="list"
    v-loading="load"
    style="width: 100%"
    :empty-text="$t('global.noneData')"
  >
    <el-table-column label="ACTION">
      <template slot-scope="scope">
        {{ scope.row.tags.find(i => i.key === "action").value }}
      </template>
    </el-table-column>

    <el-table-column label="TX HASH">
      <template slot-scope="scope">
        <hg-link type="tx" :content="scope.row.txhash" />
      </template>
    </el-table-column>

    <el-table-column label="BLOCK">
      <template slot-scope="scope">
        <hg-link type="block" :content="scope.row.height" />
      </template>
    </el-table-column>

    <el-table-column label="VALIDATOR">
      <template slot-scope="scope">
        <hg-link
          type="validator"
          :content="get(scope.row, 'tx.value.msg.0.value.validator_addr')"
        />
      </template>
    </el-table-column>

    <el-table-column label="DELEGATOR">
      <template slot-scope="scope">
        <hg-link type="address" :content="get(scope.row, 'tx.value.msg.0.value.delegator_addr')" />
      </template>
    </el-table-column>

    <el-table-column label="GAS USED">
      <template slot-scope="scope">
        {{ scope.row.gas_used }}
      </template>
    </el-table-column>

    <el-table-column label="TIME">
      <template slot-scope="scope">
        {{ scope.row.timestamp | formatTime }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { get, isEmpty } from "lodash";
import { mapGetters, mapState } from "vuex";

export default {
  props: {
    list: Array,
    load: { type: Boolean, default: true }
  },
  methods: { get }
};
</script>
