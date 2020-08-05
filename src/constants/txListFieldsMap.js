/**
 * The mapping between the elements displayed in the transaction page and the tx data.
 * linkType has 5 options: '', 'tx', 'block', 'address', 'validator', 'token'.
 * (default = '', for no link)
 */
export const defaultListFields = [{
    name: 'Time',
    name_zh: '时间',
    field: 'timestamp',
    linkType: '',
  },
  {
    name: 'Txhash',
    name_zh: '交易哈希',
    field: 'txhash',
    linkType: 'tx',
  },
  {
    name: 'Block',
    name_zh: '区块',
    field: 'height',
    linkType: 'block',
  },
];

export const txListFieldsMap = {
  // bank
  send: [
    ...defaultListFields,
    {
      name: 'From',
      name_zh: '发送方',
      field: 'tx.value.msg.0.value.from_address',
      linkType: '',
    },
    {
      name: 'To',
      name_zh: '接收方',
      field: 'tx.value.msg.0.value.to_address',
      linkType: '',
    },
  ],
  multisend: [
    ...defaultListFields,
    {
      name: 'Inputs',
      name_zh: '',
      field: 'tx.value.msg.0.value.inputs',
      linkType: '',
    },
    {
      name: 'Outputs',
      name_zh: '',
      field: 'tx.value.msg.0.value.outputs',
      linkType: '',
    },
  ],

  // staking
  delegate: [
    ...defaultListFields,
    {
      name: 'Delegator',
      name_zh: '委托人',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: '',
    },
    {
      name: 'Destination Validator',
      name_zh: '目标验证人',
      field: 'tx.value.msg.0.value.validator_address',
      linkType: '',
    },
    {
      name: 'Delegation',
      name_zh: '委托内容',
      field: 'tx.value.msg.0.value.amount',
      linkType: '',
    },
  ],
  begin_redelegate: [
    ...defaultListFields,
    {
      name: 'Validator From',
      name_zh: '发送方',
      field: 'tx.value.msg.0.value.validator_src_address',
      linkType: '',
    },
    {
      name: 'Validator To',
      name_zh: '接收方',
      field: 'tx.value.msg.0.value.validator_dst_address',
      linkType: '',
    },
    {
      name: 'Delegator',
      name_zh: '委托人',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: '',
    },
    {
      name: 'Shares Amount',
      name_zh: '股份数额',
      field: 'tx.value.msg.0.value.amount',
      linkType: '',
    },
  ],
  begin_unbonding: [
    ...defaultListFields,
    {
      name: 'Validator',
      name_zh: '验证人',
      field: 'tx.value.msg.0.value.validator_address',
      linkType: '',
    },
    {
      name: 'Delegator',
      name_zh: '委托人',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: '',
    },
    {
      name: 'Amount',
      name_zh: '数量',
      field: 'tx.value.msg.0.value.amount',
      linkType: '',
    },
  ],
  create_validator: [
    ...defaultListFields,
    {
      name: 'Validator',
      name_zh: '',
      field: 'tx.value.msg.0.value.validator_address',
      linkType: '',
    },
    {
      name: 'Owner',
      name_zh: '',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: '',
    },
    {
      name: 'Self Bond',
      name_zh: '',
      field: 'tx.value.msg.0.value.value',
      linkType: '',
    },
  ],
  edit_validator: [
    ...defaultListFields,
    {
      name: 'Validator',
      name_zh: '',
      field: 'tx.value.msg.0.value.address',
      linkType: '',
    },
    {
      name: 'Moniker',
      name_zh: '',
      field: 'tx.value.msg.0.value.Description.moniker',
      linkType: '',
    },
  ],

  // slashing
  unjail: [
    ...defaultListFields,
    {
      name: 'Validator',
      name_zh: '',
      field: 'tx.value.msg.0.value.address',
      linkType: '',
    },
  ],

  // distribution
  set_withdraw_address: [
    ...defaultListFields,
    {
      name: 'Delegator Address',
      name_zh: '委托人地址',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: '',
    },
    {
      name: 'Withdraw Address',
      name_zh: '提款地址',
      field: 'tx.value.msg.0.value.withdraw_address',
      linkType: '',
    },
  ],
  withdraw_delegator_reward: [
    ...defaultListFields,
    {
      name: 'Delegator Address',
      name_zh: '委托人地址',
      field: 'tx.value.msg.0.value.delegator_address',
      linkType: '',
    },
    {
      name: 'Validator Address',
      name_zh: '验证人地址',
      field: 'tx.value.msg.0.value.validator_address',
      linkType: '',
    },
    {
      name: 'Rewards',
      name_zh: '奖赏',
      field: 'events.2.attributes.0.value',
      linkType: '',
    },
  ],
  withdraw_validator_rewards_all: [
    ...defaultListFields,
    {
      name: 'Validator Address',
      name_zh: '',
      field: 'tags.2.value',
      linkType: '',
    },
    {
      name: 'Commission',
      name_zh: '',
      field: 'tags.3.value',
      linkType: '',
    },
  ],

  // gov
  submit_proposal: [
    ...defaultListFields,
    {
      name: 'Proposal Id',
      name_zh: '提案ID',
      field: 'events.1.attributes.1.value',
      linkType: '',
    },
    {
      name: 'Proposer',
      name_zh: '提案人',
      field: 'tx.value.msg.0.value.proposer',
      linkType: '',
    },
    {
      name: 'Proposal Type',
      name_zh: '提案类型',
      field: 'tx.value.msg.0.value.content.type',
      linkType: '',
    },
    {
      name: 'Title',
      name_zh: '标题',
      field: 'tx.value.msg.0.value.content.value.title',
      linkType: '',
    },
  ],
  deposit: [
    ...defaultListFields,
    {
      name: 'Proposal Id',
      name_zh: '提案ID',
      field: 'tx.value.msg.0.value.proposal_id',
      linkType: '',
    },
    {
      name: 'Depositor',
      name_zh: '储户',
      field: 'tx.value.msg.0.value.depositor',
      linkType: '',
    },
    {
      name: 'Amount',
      name_zh: '数量',
      field: 'tx.value.msg.0.value.amount',
      linkType: '',
    },
  ],
  vote: [
    ...defaultListFields,
    {
      name: 'Proposal Id',
      name_zh: '提案ID',
      field: 'tx.value.msg.0.value.proposal_id',
      linkType: '',
    },
    {
      name: 'Option',
      name_zh: '投票状态',
      field: 'tx.value.msg.0.value.option',
      linkType: '',
    },
    {
      name: 'Voter',
      name_zh: '投票者',
      field: 'tx.value.msg.0.value.voter',
      linkType: '',
    },
  ],
  call: [
    ...defaultListFields,
    {
      name: 'Contract Address',
      name_zh: '',
      field: '',
      linkType: '',
    },
  ],
  all: [
    ...defaultListFields,
    {
      name: 'Memo',
      name_zh: '备注',
      field: 'tx.value.memo',
      linkType: '',
    },
    {
      name: 'action',
      name_zh: '类型',
      field: '',
      linkType: '',
    },
    // {
    //   name: 'Gas Used',
    //   name_zh: 'Gas Used',
    //   field: 'gas_used',
    //   linkType: ''
    // }
  ],
  deploy: [
    ...defaultListFields,
    {
      name: 'Contract Address',
      name_zh: '',
      field: '',
      linkType: '',
    },
  ],
  record: [{
      name: 'Time',
      name_zh: '上链时间',
      field: 'record_time',
      linkType: '',
    },
    {
      name: 'Record ID',
      name_zh: '存证ID',
      field: 'id',
      linkType: '',
    },
    {
      name: 'Org ID',
      name_zh: '机构ID',
      field: 'org_id',
      linkType: '',
    },
    {
      name: 'Author',
      name_zh: '操作者账户',
      field: 'owner',
      linkType: '',
    },
  ],
};
