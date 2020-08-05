// eslint-disable-next-line import/prefer-default-export
export const txTypes = {
  bank: {
    send: 'send'
  },
  declarations: {
    create_validator: 'Create Validator',
    edit_validator: 'Edit Validator',
    unjail: 'Unjail',
  },
  staking: {
    delegate: '委托',
    begin_redelegate: '重新委托',
    begin_unbonding: '质押赎回',
    set_withdraw_address: '设置领取收益地址',
    withdraw_delegator_reward: '领取质押收益',
  },
  governance: {
    submit_proposal: '提交提案',
    deposit: '存款',
    vote: '投票',
  },
  all: {
    all: 'All',
  },
  migrate: {
    "erc20-migrate": "erc20-migrate",
    "erc20-migrate-exchange": "erc20-migrate-exchange"
  }
};
