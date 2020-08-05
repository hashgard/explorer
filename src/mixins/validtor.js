import {
  get
} from 'lodash';
import {
  mapState,
  mapGetters
} from 'vuex';

export default {
  computed: {
    ...mapState('blocks', ['proposers']),
    ...mapState('validators', ['consPubMap']),
    ...mapGetters('validators', ['onlineList']),
  },
  methods: {
    getValidatorName(height) {
      const proposer = get(this.proposers, [height, 'pub_key']);
      return get(this.consPubMap, [proposer, 'description', 'moniker']) || '-';
    },
  },
};
