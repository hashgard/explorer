<template>
  <card :title="$t('proposals.proposals')">
    <ProposalList :list='list' />
  </card>
</template>

<script>
import { mapState } from 'vuex';
import ProposalList from '@/components/Proposals/List';

export default {
  components: { ProposalList },
  computed: {
    ...mapState('proposals', ['list']),
  },
  mounted() {
    this.$store.dispatch('proposals/fetchList');
  },
};
</script>
