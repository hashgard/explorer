<template>
  <span>
    {{ viewList.join(" + ") }}
  </span>
</template>

<script>
import { mapState } from "vuex";
import { isEmpty } from "lodash";
import Big from "big.js";
import numeral from "numeral";

export default {
  props: {
    list: Array
  },
  data() {
    return {
      viewList: []
    };
  },
  computed: {
    ...mapState("tokens", ["details"])
  },
  methods: {
    updateList() {
      if (this.list.find(i => !i.denom)) {
        return;
      }
      this.viewList = this.list.map(i => {
        if (i.denom.match(/^coin.{10}$/)) {
          const detail = this.details[i.denom];

          if (!isEmpty(detail)) {
            i.denom = detail.symbol;

            const n = Big(i.amount).div(10 ** detail.decimals);

            i.amount = numeral(n.toString()).format("0,0.[000000]");
          }
        } else if (i.denom === "ugard") {
          const n = Big(i.amount).div(10 ** 6);

          i.amount = numeral(n.toString()).format("0,0.[000000]");
          i.denom = "GARD";
        } else if (i.denom === "uggt") {
          const n = Big(i.amount).div(10 ** 6);

          i.amount = numeral(n.toString()).format("0,0.[000000]");
          i.denom = "GGT";
        } else {
          i.amount = numeral(i.amount).format("0,0.[000000]");
          i.denom = i.denom.toUpperCase();
        }

        return `${i.amount}${i.denom}`;
      });
    }
  },
  watch: {
    list() {
      if (this.list.find(i => !i.denom)) {
        return;
      }

      this.list.forEach(i => {
        if (i.denom.match(/^coin.{10}$/) && isEmpty(this.details[i.denom])) {
          this.$store.dispatch("tokens/fetchDetail", i.denom);
        }
      });

      this.updateList();
    },
    details() {
      if (isEmpty(this.list)) {
        return;
      }

      this.updateList();
    }
  },
  mounted() {
    this.updateList();
  }
};
</script>
