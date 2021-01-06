<template>
  <el-menu
    :default-active="$route.path"
    @select="handleSelect"
    class="menu-container"
    mode="horizontal"
  >
    <template v-for="(item, i) in menu">
      <el-submenu
        v-if="item.children"
        :index="item.name"
        :key="`sub${i}`"
        class="item"
      >
        <template slot="title">
          {{ $t(item.name) }}
        </template>
        <el-menu-item
          v-for="sub in item.children"
          :key="sub.name"
          :index="sub.link"
        >
          {{ $t(sub.name) }}
        </el-menu-item>
      </el-submenu>
      <el-menu-item
        :key="`menu${i}`"
        v-else
        :index="item.link"
        class="item"
      >
        {{ $t(item.name) }}
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
export const menu = [
  {
    name: "menu.blocks",
    link: "/block"
  },
  // {
  //   name: 'menu.record',
  //   index: 'test',
  //   children: [
  //     {
  //       name: 'record.publicRecord',
  //       link: '/publicRecord',
  //     },
  //     {
  //       name: 'record.authorRecord',
  //       link: '/authRecord',
  //     },
  //     {
  //       name: 'record.fileRecord',
  //       link: '/fileRecord',
  //     },
  //   ],
  // },
  // {
  //   name: 'menu.contract',
  //   link: '/contract',
  // },
  {
    name: "menu.tx",
    children: [
      {
        name: "txCate.all",
        link: "/txs?module=all"
      },
      {
        name: "txCate.bank",
        link: "/txs?module=bank"
      },
      {
        name: "txCate.migrate",
        link: "/txs?module=migrate"
      },
      {
        name: "txCate.governance",
        link: "/txs/?module=gov"
      },
      // {
      //   name: "txCate.staking",
      //   link: "/txs?module=staking"
      // },
      {
        name: "txCate.distribution",
        link: "/txs?module=distribution"
      },
      {
        name: "txCate.grid999",
        link: "/txs?module=grid999"
      }
    ]
  },
  {
    name: "menu.proposals",
    link: "/proposal"
  },
  {
    name: "menu.validators",
    link: "/validator"
  }
  // {
  //   name: 'menu.alliance',
  //   link: '/alliance',
  // },
  // {
  //   name: 'menu.joinUs',
  //   link: '/apply',
  // },
];

export default {
  data() {
    return { menu };
  },
  methods: {
    handleSelect(key) {
      if (key === "/apply") {
        window.open("/apply", "_blank");
      } else {
        this.$router.push(key);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-container {
  padding-right: 40px;

  border-bottom: none;
  background-color: transparent;

  a {
    text-decoration: none;
  }
}

.item {
  transition: $trans;

  color: rgba($color: #fff, $alpha: 0.8);

  $active-color: #00fffb;

  &.is-active {
    color: $active-color;
    border-bottom-color: $active-color;

    & /deep/ .el-submenu__title {
      color: $active-color;
      border-bottom-color: $active-color;

      &:not(.is-disabled):hover,
      &:not(.is-disabled):focus {
        color: $active-color;
        background-color: transparent;
      }
    }
  }

  &:not(.is-disabled):hover,
  &:not(.is-disabled):focus {
    color: $active-color;
    background-color: transparent;
  }

  &:focus /deep/ .el-submenu__title {
    color: rgba($color: #fff, $alpha: 0.8);
  }

  & /deep/ .el-submenu__title {
    color: rgba($color: #fff, $alpha: 0.8);

    &:hover,
    &:focus {
      color: rgba($color: #fff, $alpha: 0.8);
      background-color: transparent;
    }
  }
}

@include responsive($sm) {
  .menu-container {
    display: none;
  }
}
</style>
