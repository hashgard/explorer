<template>
  <div class="header-container">
    <div class="header">
      <div class="logo">
        <a href="/">
          <img src="~@/assets/logo-white.png" />
        </a>
      </div>

      <Menu />
      <!-- 主网测试网切换 -->
      <div class="net-info">{{ netName }}</div>
      <!-- <el-select
        v-if="!expandSearch"
        value="TESTNET"
        placeholder="请选择"
        size="small"
        class="select-net"
      >
        <el-option
          key="TESTNET"
          :label="testNetName"
          value="TESTNET"
        > </el-option>
      </el-select> -->
      <div
        v-if="!isMobile && $route.path !== '/home'"
        :class="`search ${expandSearch ? 'show' : ''}`"
      >
        <InputSearch
          mini
          :expand="expandSearch"
          @blur="onBlur"
          @focus="onFocus"
        />
      </div>
      <span
        class="menuBtn"
        v-html="menuIcon"
        @click="drawer = true"
      > </span>
      <!-- <el-dropdown
        @command="changeLng"
        trigger="click"
        style="color: #fff;margin-left: 5px;cursor:pointer;"
      >
        <span class="el-dropdown-link">
          <img
            :src="lngImg"
            alt=""
            style="height: 20px;vertical-align: middle;"
          />
          <i
            class="el-icon-caret-bottom"
            style="vertical-align: middle;"
          ></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh">
            <img
              :src="zhSvg"
              style="vertical-align: middle;
    height: 20px;"
            />
            <span style="font-size: 12px;">中文(简体)</span>
          </el-dropdown-item>
          <el-dropdown-item command="en">
            <img
              :src="enSvg"
              style="vertical-align: middle;
    height: 20px;"
            />
            <span style="font-size: 12px;">English</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-drawer
        :visible.sync="drawer"
        :direction="direction"
        custom-class="drawer"
      >
        <el-menu @select="handleSelect">
          <component
            v-for="(item, i) in menu"
            :key="i"
            :index="item.children ? item.name :item.link"
            :is="item.children ? 'ElSubmenu' : 'ElMenuItem' "
          >
            <template
              v-if="item.children"
              slot="title"
            >
              {{ $t(item.name) }}
            </template>
            <span v-else>
              {{ $t(item.name) }}
            </span>

            <template v-if="item.children">
              <el-menu-item
                v-for="(sub, i) in item.children"
                :key="i"
                :index="sub.link"
              >
                {{ $t(sub.name) }}
              </el-menu-item>
            </template>
          </component>
        </el-menu>
      </el-drawer>
    </div>
    <div
      v-if="$route.path === '/home'"
      class="header-title"
    >Hashgard Chain Explorer</div>
    <InputSearch
      v-if="isMobile || $route.path === '/home'"
      class="title-search"
    />
  </div>
</template>

<script>
import { isEmpty } from "lodash";
import Menu, { menu } from "@/components/Menu";
import InputSearch from "@/components/InputSearch";
import changeSvg from "@/assets/changeSvg.svg";
import zhSvg from "@/assets/zh.svg";
import enSvg from "@/assets/en.svg";

export default {
  components: { Menu, InputSearch },
  data() {
    return {
      changeSvg,
      zhSvg,
      enSvg,
      expandSearch: false,
      isMobile: /iPad|iPhone|Android/.test(navigator.userAgent),
      menu,
      menuIcon:
        '<svg class="icon" fill="#fff" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1605"><path d="M981.333333 554.666667 42.666667 554.666667c-23.466667 0-42.666667-19.2-42.666667-42.666667 0-23.466667 19.2-42.666667 42.666667-42.666667l938.666667 0c23.466667 0 42.666667 19.2 42.666667 42.666667C1024 535.466667 1004.8 554.666667 981.333333 554.666667zM981.333333 213.333333 42.666667 213.333333c-23.466667 0-42.666667-19.2-42.666667-42.666667s19.2-42.666667 42.666667-42.666667l938.666667 0c23.466667 0 42.666667 19.2 42.666667 42.666667S1004.8 213.333333 981.333333 213.333333zM42.666667 810.666667l938.666667 0c23.466667 0 42.666667 19.2 42.666667 42.666667 0 23.466667-19.2 42.666667-42.666667 42.666667L42.666667 896c-23.466667 0-42.666667-19.2-42.666667-42.666667C0 829.866667 19.2 810.666667 42.666667 810.666667z" p-id="1606"></path></svg>',
      drawer: false,
      direction: "rtl",
      lang: localStorage.getItem("borwser-lang") || "zh"
    };
  },
  props: {
    netName: String
  },
  computed: {
    lngImg() {
      if (this.$i18n.locale === "zh") {
        return this.zhSvg;
      }

      if (this.$i18n.locale === "en") {
        return this.enSvg;
      }

      return "";
    }
  },
  methods: {
    isEmpty,
    onBlur() {
      this.expandSearch = false;
    },
    onFocus() {
      this.expandSearch = true;
    },
    handleSelect(v) {
      this.$router.push(v);
      this.drawer = false;
    },
    changeLng(val) {
      this.lang = val;
      this.$i18n.locale = val;
      localStorage.setItem("borwser-lang", val);
      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.header-container {
  padding: 0px 40px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 60px;

    color: #fff;
    .logo {
      flex-basis: 140px;
      flex-grow: 1;
      img {
        height: 28px;
      }
    }
    .search {
      transition: width $trans;
      &.show {
        width: 50%;
        max-width: 400px;
      }
    }
    .change-lng {
      display: flex;
      align-items: center;
      justify-content: space-around;

      margin-left: 10px;
      .changeSvg {
        width: 20px;

        cursor: pointer;
      }
      span {
        color: #fff;
      }
    }
  }

  .header-title {
    margin: 64px auto;

    text-align: center;

    color: #fff;

    font-size: 28px;
  }
  .title-search {
    max-width: 640px;
    margin: 64px auto 100px;
  }
}

.menuBtn {
  display: none;

  width: 0;
  height: 0;
}
.net-info {
  margin-right: 5px;

  color: #fff;
}

@include responsive($sm) {
  .header-container {
    padding: 0px 24px;
    // border-bottom: 1px solid $grey;
    .header-title,
    .title-search {
      margin: 16px auto 32px;
    }
    .header {
      .select-net {
        flex-basis: 100px;
      }
    }
  }

  .menuBtn {
    display: inline-block;
    overflow: hidden;

    width: 32px;
    height: 30px;
    padding: 4px;

    text-align: center;
    vertical-align: middle;

    border-radius: 4px;
    svg {
      width: 20px;
      height: 20px;

      vertical-align: top;

      fill: $blue;
    }
  }
}
</style>
<style>
.drawer {
  width: 200px !important;
}
</style>
