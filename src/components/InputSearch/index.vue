<template>
  <div :class="`search-container ${mini && !expand ? 'mini' : ''}`">
    <el-input
      ref="input"
      class="search-inner"
      placeholder="Txhash/ Block/ Validator/ Address"
      v-model.trim="value"
      @keyup.enter.native.stop.prevent="onSearch"
      @blur="onBlur"
      :clearable="!mini"
    ></el-input>
    <i
      class="el-icon-search search-icon"
      @click="expandSearch"
    ></i>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    mini: Boolean,
    expand: Boolean
  },
  data() {
    return {
      value: ""
    };
  },
  computed: {
    ...mapGetters("blocks", { blocksLastList: "lastList" })
  },
  methods: {
    expandSearch() {
      if (this.mini && !this.expand) {
        this.$emit("focus");
        this.$refs.input.focus();
      }
    },
    onBlur() {
      if (this.mini && this.expand) {
        this.$emit("blur");
      }
    },
    async onSearch() {
      await this.$store.dispatch("blocks/fetchList");
      await this.$store.dispatch("blocks/fetchLatest");

      let { value } = this;

      value = value.replace(/ /g, "");

      // jump to block detail page;
      const numberPattern = /^\d+$/g;

      if (numberPattern.test(value)) {
        if (value - 0 > this.blocksLastList[0].header.height - 0) {
          this.$router.push("/notFound");

          return;
        }

        this.$router.push({ path: `/block/${value}` });

        return;
      }

      // jump to address detail page;
      const addressPattern = /^gard.{39}$/;
      if (addressPattern.test(value)) {
        this.$router.push({ path: "/address/" + value });
        return false;
      }

      // jump to validator detail page;
      const valPattern = /^gardvaloper.{39}$/;

      if (valPattern.test(value)) {
        this.$router.push({ path: `/validator/${value}` });

        return;
      }

      // jump to tx detail page;
      const txPattern = /^[0-9A-F]{64}$/;

      if (txPattern.test(value)) {
        this.$router.push({ path: `/tx/${value}` });

        return;
      }

      // else show 404
      this.$router.push({ path: "/404" });
    }
  }
};
</script>

<style lang="scss" scoped>
.search-container {
  //   margin: 64px auto 120px;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  width: 100%;
  height: 48px;

  transition: all $trans;

  border: 1px solid white;
  border-radius: 4px;

  .search-inner {
    flex: 1 1 auto;
  }

  .search-icon {
    z-index: 9;

    margin-right: 24px;

    color: rgba(255, 255, 255, 0.75);

    font-size: 18px;
  }

  &.mini {
    width: 40px;

    border: none;
    .search-inner {
      width: 8px;
    }

    .search-icon {
      margin-right: 0;

      cursor: pointer;
      &:hover {
        color: white;
      }
    }
  }
}
</style>
