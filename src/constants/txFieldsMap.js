import {
  txListFieldsMap,
} from './txListFieldsMap';

const defaultFields = [{
  name: 'Action',
  name_zh: '类型',
  field: '',
  linkType: '',
},
// {
//   name: 'Gas Used',
//   name_zh: 'gas费用',
//   field: 'gas_used',
//   linkType: ''
// },
{
  name: 'Memo',
  name_zh: '备注',
  field: 'tx.value.memo',
  linkType: '',
},
];

// eslint-disable-next-line import/prefer-default-export
export const txFieldsMap = {
  // bank
  send_bank: [
    ...txListFieldsMap.send,
    ...defaultFields,
    {
      name: 'Amount',
      name_zh: '数量',
      field: 'tx.value.msg.0.value.amount',
      linkType: '',
    },
  ],
  multisend_bank: [...txListFieldsMap.multisend, ...defaultFields],

  // staking
  delegate_staking: [...txListFieldsMap.delegate, ...defaultFields],
  begin_redelegate_staking: [
    ...txListFieldsMap.begin_redelegate,
    ...defaultFields,
    {
      name: 'End Time',
      name_zh: '结束时间',
      field: '',
      linkType: '',
    },
  ],
  begin_unbonding_staking: [
    ...txListFieldsMap.begin_unbonding,
    ...defaultFields,
    {
      name: 'End Time',
      name_zh: '结束时间',
      field: '',
      linkType: '',
    },
  ],
  create_validator_staking: [
    ...txListFieldsMap.create_validator,
    ...defaultFields,
    {
      name: 'Commission Rate',
      name_zh: 'Commission Rate',
      field: 'tx.value.msg.0.value.commission',
      linkType: '',
    },
    {
      name: 'Min Self Delegation',
      name_zh: 'Min Self Delegation',
      field: 'tx.value.msg.0.value.min_self_delegation',
      linkType: '',
    },
    {
      name: 'Description',
      name_zh: '描述',
      field: 'tx.value.msg.0.value.description',
      linkType: '',
    },
  ],
  edit_validator_staking: [
    ...txListFieldsMap.edit_validator,
    ...defaultFields,
    {
      name: 'Identity',
      name_zh: 'Identity',
      field: 'tx.value.msg.0.value.Description.identity',
      linkType: '',
    },
    {
      name: 'Website',
      name_zh: 'Website',
      field: 'tx.value.msg.0.value.Description.website',
      linkType: '',
    },
    {
      name: 'Details',
      name_zh: 'Details',
      field: 'tx.value.msg.0.value.Description.details',
      linkType: '',
    },
    {
      name: 'Commission Rate',
      name_zh: 'Commission Rate',
      field: 'tx.value.msg.0.value.commission_rate',
      linkType: '',
    },
    {
      name: 'Min Self Delegation',
      name_zh: 'Min Self Delegation',
      field: 'tx.value.msg.0.value.min_self_delegation',
      linkType: '',
    },
  ],

  // slashing
  unjail_slashing: [...txListFieldsMap.unjail, ...defaultFields],

  // distribution
  set_withdraw_address_distribution: [...txListFieldsMap.set_withdraw_address, ...defaultFields],
  withdraw_delegator_reward_distribution: [
    ...txListFieldsMap.withdraw_delegator_reward,
    ...defaultFields,
  ],
  withdraw_validator_rewards_all_distribution: [
    ...txListFieldsMap.withdraw_validator_rewards_all,
    ...defaultFields,
  ],

  // gov
  submit_proposal_governance: [
    ...txListFieldsMap.submit_proposal,
    ...defaultFields,
    {
      name: 'Name',
      name_zh: '名称',
      field: 'tx.value.msg.0.value.content.value.apply_info.name',
      linkType: '',
    },
    {
      name: 'Owner',
      name_zh: '机构管理人',
      field: 'tx.value.msg.0.value.content.value.apply_info.owner',
      linkType: '',
    },
    {
      name: 'Voter',
      name_zh: '链上治理账户',
      field: 'tx.value.msg.0.value.content.value.apply_info.voter',
      linkType: '',
    },
    {
      name: 'Supervisor',
      name_zh: '链上监管账户',
      field: 'tx.value.msg.0.value.content.value.apply_info.supervisor',
      linkType: '',
    },
    {
      name: 'Validator',
      name_zh: '记账节点账户',
      field: 'tx.value.msg.0.value.content.value.apply_info.validator',
      linkType: '',
    },
    {
      name: 'Votes',
      name_zh: '投票权重值',
      field: 'tx.value.msg.0.value.content.value.apply_info.votes',
      linkType: '',
    },
    {
      name: 'Logo url',
      name_zh: '机构 Logo',
      field: 'tx.value.msg.0.value.content.value.apply_info.logo_url',
      linkType: '',
    },
    {
      name: 'Node Id',
      name_zh: '节点ID',
      field: 'tx.value.msg.0.value.content.value.apply_info.node_id',
      linkType: '',
    },
    {
      name: 'Node Ip',
      name_zh: '节点IP',
      field: 'tx.value.msg.0.value.content.value.apply_info.node_ip',
      linkType: '',
    },
    {
      name: 'Apply Description',
      name_zh: '描述',
      field: 'tx.value.msg.0.value.content.value.description',
      linkType: '',
    },
    {
      name: 'Org Description',
      name_zh: '机构描述',
      field: 'tx.value.msg.0.value.content.value.apply_info.description',
      linkType: '',
    },
  ],
  deposit_governance: [...txListFieldsMap.deposit, ...defaultFields],
  vote_governance: [...txListFieldsMap.vote, ...defaultFields],
  call_contract: [
    ...txListFieldsMap.call,
    ...defaultFields,
    // {
    //   name: 'Contract Gas',
    //   name_zh: 'Contract Gas',
    //   field: 'tx.value.msg.0.value.contract_gas',
    //   linkType: ''
    // },
    {
      name: 'Sender',
      name_zh: '操作者',
      field: 'tx.value.msg.0.value.sender',
      linkType: '',
    },
    {
      name: 'Method',
      name_zh: '方法',
      filed: '',
      linkType: '',
    },
    {
      name: 'Params',
      name_zh: '参数',
      filed: '',
      linkType: '',
    },
  ],
  call_contract_transaction: [{
    name: 'Sender',
    name_zh: '发送发',
    field: 'sender',
    linkType: '',
  },
  {
    name: 'Recipient',
    name_zh: '接收方',
    field: 'recipient',
    linkType: '',
  },
  {
    name: 'Send Amount',
    name_zh: '数量',
    field: 'amount',
    linkType: '',
  },
  ],
  deploy_contract: [
    ...txListFieldsMap.call,
    ...defaultFields,
    // {
    //   name: 'Contract Gas',
    //   name_zh: '',
    //   field: 'tx.value.msg.0.value.contract_gas',
    //   linkType: ''
    // },
    {
      name: 'Sender',
      name_zh: '操作者',
      field: 'tx.value.msg.0.value.sender',
      linkType: '',
    },
    {
      name: 'Name',
      name_zh: '名称',
      field: 'tx.value.msg.0.value.name',
      linkType: '',
    },
  ],
  record_record: [
    ...txListFieldsMap.record,
    ...defaultFields,
    {
      name: 'Sender',
      name_zh: '操作者账户',
      field: 'tx.value.msg.0.value.sender',
      linkType: '',
    },
    {
      name: 'Org Name',
      name_zh: '机构名称',
      field: '',
      linkType: '',
    },
    {
      name: 'Org Description',
      name_zh: '机构描述',
      field: '',
      linkType: '',
    },
    {
      name: 'Org Logo Url',
      name_zh: '机构 Logo',
      field: '',
      linkType: '',
    },
    {
      name: 'Record Code',
      name_zh: '存证编码',
      field: 'tx.value.msg.0.value.params.record_code',
      linkType: '',
    },
    {
      name: 'Record Type',
      name_zh: '存证类型',
      field: 'tx.value.msg.0.value.params.record_type',
      linkType: '',
    },
    {
      name: 'Description',
      name_zh: '描述',
      field: 'tx.value.msg.0.value.params.description',
      linkType: '',
    },
    {
      name: 'Business Data Hash',
      name_zh: '存证Hash',
      field: 'tx.value.msg.0.value.params.business_data_hash',
      linkType: '',
    },
    {
      name: 'Business Data',
      name_zh: '存证数据',
      field: 'tx.value.msg.0.value.params.business_data',
      linkType: '',
    },
    {
      name: 'Encrypt Data',
      name_zh: '加密数据',
      field: 'tx.value.msg.0.value.params.encrypt_data',
      linkType: '',
    },
    {
      name: 'Encrypt Data Pub Key',
      name_zh: '国密公钥',
      field: 'tx.value.msg.0.value.params.encrypt_data_pub_key',
      linkType: '',
    },
  ],
  'record-public_record': [
    ...defaultFields,
    {
      name: 'Sender',
      name_zh: '操作者账户',
      field: 'tx.value.msg.0.value.sender',
      linkType: '',
    },
    {
      name: 'encrypt_data_private_key',
      name_zh: '国密私钥',
      field: 'tx.value.msg.0.value.params.encrypt_data_private_key',
      linkType: '',
    },
  ],
  activate_account: [
    ...defaultFields,
    {
      name: 'Sender',
      name_zh: '操作者账户',
      field: 'tx.value.msg.0.value.sender',
      linkType: '',
    },
    {
      name: 'address',
      name_zh: '激活地址',
      field: 'tx.value.msg.0.value.addresses',
      linkType: '',
    },
    {
      name: 'module_roles',
      name_zh: '功能模块权限',
      field: 'tx.value.msg.0.value.module_roles',
      linkType: '',
    },
    {
      name: 'ext_roles',
      name_zh: '机构自定义权限',
      field: 'tx.value.msg.0.value.ext_roles',
      linkType: '',
    },
  ],
  genesis_org_org: [
    ...defaultFields,
    {
      name: 'Sender',
      name_zh: '操作者账户',
      field: 'tx.value.msg.0.value.sender',
      linkType: '',
    },
    {
      name: 'genesis address',
      name_zh: '地址',
      field: 'tx.value.msg.0.value.address',
      linkType: '',
    },
  ],
  edit_org_org: [
    ...defaultFields,
    {
      name: 'Sender',
      name_zh: '操作者账户',
      field: 'tx.value.msg.0.value.sender',
      linkType: '',
    },
    {
      name: 'org id',
      name_zh: '机构ID',
      field: 'tx.value.msg.0.value.org_id',
      linkType: '',
    },
    {
      name: 'Logo url',
      name_zh: '机构 Logo',
      field: 'tx.value.msg.0.value.logo_url',
      linkType: '',
    },
    {
      name: 'edit org Description',
      name_zh: '描述',
      field: 'tx.value.msg.0.value.description',
      linkType: '',
    },
    {
      name: 'Node Id',
      name_zh: '节点ID',
      field: 'tx.value.msg.0.value.node_id',
      linkType: '',
    },
    {
      name: 'Node Ip',
      name_zh: '节点IP',
      field: 'tx.value.msg.0.value.node_ip',
      linkType: '',
    },
  ],
};
