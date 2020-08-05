<template>
  <el-table :data="list" :empty-text="$t('global.noneData')">
    <el-table-column label="ID">
      <template slot-scope="scope">
        <hg-link type="proposal" :content="get(scope.row, 'id')" />
      </template>
    </el-table-column>
    <el-table-column :label="$t('proposals.title')">
      <template slot-scope="scope">
        <hg-link
          type="proposal"
          :content="get(scope.row, 'content.value.title')"
          :link="get(scope.row, 'id')"
        />
      </template>
    </el-table-column>
    <el-table-column :label="$t('proposals.type')">
      <template slot-scope="scope">{{ contentType(get(scope.row, "content.type")) }}</template>
    </el-table-column>
    <el-table-column :label="$t('proposals.status')" prop="proposal_status"> </el-table-column>
    <el-table-column :label="$t('proposals.submitTime')">
      <template slot-scope="scope">
        {{ scope.row.submit_time | formatTime }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { get } from "lodash";

export default {
  props: {
    list: {
      required: true,
      type: Array
    },
    type: {
      type: String,
      default: ""
    }
  },
  methods: {
    get,
    contentType(val) {
      return val.split("/")[1];
    }
  }
};
</script>
