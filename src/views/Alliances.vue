<template>
  <card :title="$t('alliance.title')">
    <el-table :data="list" :empty-text="$t('global.noneData')">
      <el-table-column label="Logo">
        <template slot-scope="record">
          <img class="logo" :src="record.row.logo_url" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('alliance.name')">
        <template slot-scope="record">
          <hg-link type="alliance" :content="record.row.name" :link="record.row.id" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('alliance.orgId')" prop="id" />
      <el-table-column :label="$t('alliance.level')">
        <template slot-scope="record">
          {{ $t(`apply.${levels[record.row.level]}`) }}
        </template>
      </el-table-column>
    </el-table>
  </card>
</template>

<script>
import ajax from "@/utils/ajax";

export default {
  data() {
    return {
      list: [],
      levels: {
        88001000: "levelGenesis",
        88001001: "levelSpecial",
        88001002: "levelUnion",
        88009000: "levelSupervise"
      }
    };
  },
  async created() {
    const levels = ["88001000", "88001001", "88001002", "88009000"];
    const { data } = await ajax.get("/org/unions?start-tx-id=0&limit=20");

    this.list = data.result.map(({ item }) => item).filter(item => levels.includes(item.level));
  }
};
</script>

<style lang="scss" scoped>
.logo {
  max-height: 40px;
}
</style>
