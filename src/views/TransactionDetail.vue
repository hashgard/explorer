<template>
  <div>
    <sub-title
      :title="$t('tx.tx')"
      :sub="hash"
    />
    <div
      class="transaction-detail-content"
      v-if="!isEmpty(detail)"
    >
      <card :title="$t('tx.detail')">
        <data-item
          v-for="item in fields[type]"
          :key="item.name"
          :label="item.name_zh"
        >
          <hg-link
            v-if="item.linkType"
            :type="item.linkType"
            :content="get(detail, item.field)"
            :ellipsis="false"
          />
          <span v-if="!item.linkType">
            <data-amount
              v-if="
                Array.isArray(get(detail, item.field)) &&
                  [
                    'address',
                    'Node Ip',
                    'Target Address',
                    'Amount',
                    'Shares Amount',
                    'Fee Amount'
                  ].includes(item.name)
              "
              :list="get(detail, item.field)"
            />
            <data-amount
              v-else-if="
                get(detail, item.field) instanceof Object &&
                  [
                    'address',
                    'Node Ip',
                    'Target Address',
                    'Amount',
                    'Shares Amount',
                    'Fee Amount'
                  ].includes(item.name)
              "
              :list="[get(detail, item.field)]"
            />
            <span v-else-if="item.name === 'Action'">
              {{ action }}
            </span>
            <data-amount
              v-else-if="item.name === 'Amount'"
              :list="get(detail, item.field)"
            />
            <data-amount
              v-else-if="item.name === 'Shares Amount'"
              :list="get(detail, item.field)"
            />
            <data-amount
              v-else-if="item.name === 'Fee Amount'"
              :list="get(detail, item.field)"
            />
            <data-amount
              v-else-if="item.name === 'Withdraw Rewards'"
              :list="rewardList(get(detail, item.field))"
            />
            <span v-else-if="item.name === 'Lock End'">
              {{ get(detail, item.field) | formatTime }}
            </span>
            <span v-else-if="item.name === 'Description'">
              {{ description }}
            </span>
            <span v-else-if="item.name.match('Time')">
              <span v-if="action === 'begin_unbonding'">{{ completionTime | formatTime }}</span>
              <span v-else-if="action === 'begin_redelegate'">{{
                RedelegateCompletionTime | formatTime
              }}</span>
              <span v-else>{{ get(detail, item.field) | formatTime }}</span>
            </span>

            <span v-else-if="item.name === 'Proposal Type'">
              {{ get(detail, item.field).split("/")[1] }}
            </span>
            <span v-else-if="
                typeof get(detail, item.field) === 'boolean' && item.name != 'targetStatus'
              ">
              {{ get(detail, item.field).toString() }}
            </span>
            <span v-else-if="item.name === 'Contract Address'">{{ contractAddress }}</span>
            <span v-else-if="item.name === 'Method'">{{ contractMethod }}</span>
            <span v-else-if="item.name === 'Params'">{{ params }}</span>
            <span v-else-if="item.name === 'Org Name'">{{ orgName }}</span>
            <span v-else-if="item.name === 'Org Description'">{{ orgDes }}</span>
            <span v-else-if="item.name === 'Org Logo Url'">
              <span v-if="orgLogo === ''">-</span>
              <span v-else>
                <span style="display: block;">{{ orgLogo }}</span>
                <img
                  :src="orgLogo"
                  alt=""
                  style="height: 40px;"
                />
              </span>
            </span>
            <span v-else-if="item.name === 'Logo url'">
              <span v-if="get(detail, item.field) === ''">-</span>
              <span v-else>
                <span style="display: block;">{{ get(detail, item.field) }}</span>
                <img
                  :src="get(detail, item.field)"
                  alt=""
                  style="height: 40px;"
                />
              </span>
            </span>
            <span v-else-if="item.name === 'Org ID'">{{ orgId }}</span>
            <span v-else-if="item.name === 'Record Org ID'">{{ RecordOrgID }}</span>
            <span v-else-if="item.name === 'Record ID'">{{ recordId }}</span>
            <span v-else-if="['address', 'Node Ip', 'Target Address'].includes(item.name)">
              <span
                v-for="(i, index) in get(detail, item.field)"
                :key="index"
                style="margin-right: 15px;"
              >{{ i }}</span>
            </span>
            <span v-else-if="item.name === 'targetStatus'">
              <span v-if="get(detail, item.field)">已禁用</span>
              <span v-else>已启用</span>
            </span>
            <span v-else-if="item.name === 'Allow'">
              <span
                v-for="(i, index) in get(detail, item.field).split(',')"
                :key="index"
              >
                <span style="margin-right: 15px;">{{ i }}</span>
              </span>
            </span>
            <span
              @click="goEtcExplorer(item.name, get(detail, item.field))"
              style="color:blue;cursor:pointer;"
              v-else-if="
                item.name === 'erc20 Tx Hash' ||
                  item.name == 'eth Tx Hash' ||
                  item.name == 'erc20 Address'
              "
            >{{ get(detail, item.field) || "-" }}</span>
            <data-amount
              v-else-if="item.name == 'Self Bond'"
              :list="[get(detail, item.field)]"
            ></data-amount>
            <span v-else-if="
                item.name == 'Commission Max Change Rate' ||
                  item.name == 'Commission Rate' ||
                  item.name == 'Commission Max Rate'
              ">
              {{ parseFloat(get(detail, item.field)).toFixed(2) }}
            </span>
            <span v-else-if="item.name == 'erc20-migrate Sender'">
              <hg-link
                type="address"
                :content="signer"
                :ellipsis="false"
              />
            </span>
            <span v-else-if="item.name == 'erc20-migrate From'">
              <hg-link
                type="address"
                :content="erc20MigrateFromsender"
                :ellipsis="false"
              />
            </span>
            <span v-else-if="item.name == 'Migrate Reward From' && migrateRewardFrom != ''">
              <hg-link
                type="address"
                :content="migrateRewardFrom"
                :ellipsis="false"
              />
            </span>
            <span v-else-if="item.name == 'Migrate Reward'">
              <data-amount
                v-if="migrateReward != '0GARD'"
                :list="migrateReward"
              ></data-amount>
              <span v-else>-</span>
            </span>
            <span v-else-if="item.name == 'Channel'">
              <span v-if="get(detail, item.field) == ''">-</span>
              <hg-link
                v-else
                :type="address"
                :content="get(detail, item.field)"
                :ellipsis="false"
              />
            </span>
            <data-amount
              v-else-if="item.name == 'Dapp Deposit'"
              :list="[get(detail, item.field)]"
            ></data-amount>
            <span v-else-if="item.name == 'Grid Withdraw Deposit'">
              <data-amount
                v-if="gridWithdrawDeposit.length != 0"
                :list="gridWithdrawDeposit"
              ></data-amount>
              <span v-else>-</span>
            </span>
            <span v-else-if="item.name == 'Grid Withdraw Rewards'">
              <data-amount
                v-if="gridWithdrawRewards.length != 0"
                :list="gridWithdrawRewards"
              ></data-amount>
              <span v-else>-</span>
            </span>
            <span v-else-if="item.name == 'Grid Withdraw Lucky'">
              <data-amount
                v-if="gridWithdrawLucky.length != 0"
                :list="gridWithdrawLucky"
              ></data-amount>
              <span v-else>-</span>
            </span>
            <span v-else-if="item.name == 'Grid Withdraw Fee'">
              <data-amount
                v-if="gridWithdrawFee.length != 0"
                :list="gridWithdrawFee"
              ></data-amount>
              <span v-else>-</span>
            </span>
            <span v-else-if="item.name == 'Lucky Deposit'">
              <data-amount
                v-if="luckyDeposit.length != 0"
                :list="luckyDeposit"
              ></data-amount>
              <span v-else>-</span>
            </span>
            <span v-else-if="item.name == 'Deposit Fee'">
              <data-amount
                v-if="depositFee.length != 0"
                :list="depositFee"
              ></data-amount>
              <span v-else>-</span>
            </span>
            <span v-else-if="item.name == 'Owner Number'">{{ownerNumber}}</span>
            <span v-else-if="item.name == 'Total Number'">{{total_number}}</span>
            <span v-else-if="item.name == 'Create Grid ID'">{{gridID}}</span>
            <span v-else>
              {{ get(detail, item.field) || "-" }}
            </span>
          </span>
        </data-item>
      </card>
      <card
        title="DAPP INFORMATION"
        v-if="type == 'grid999_dapp_generate_grid999'"
      >
        <data-item
          v-for="item in fields['dapp_info']"
          :key="item.name"
          :label="item.name_zh"
        >
          <hg-link
            v-if="item.linkType"
            :type="item.linkType"
            :content="get(detail, item.field)"
            :ellipsis="false"
          />
          <span v-if="!item.linkType">
            <span v-if="item.name == 'Voted' || item.name == 'Only Owner Can Create Grid' || item.name == 'Grid Create Can Deposit'">{{get(detail, item.field)}}</span>
            <span v-else-if="item.name == 'Dapp Owner'">
              <hg-link
                v-if="get(detail, item.field) != ''"
                type="address"
                :content="get(detail, item.field)"
                :ellipsis="false"
              />
              <span v-else>-</span>
            </span>
            <data-amount
              v-else-if="item.name == 'Member Min Deposit' || item.name == 'Owner Min Deposit' || item.name == 'Max Per Deposit'"
              :list="[get(detail, item.field)]"
            ></data-amount>
            <data-amount
              v-else-if="item.name == 'Max Deposit Amount' || item.name == 'Min Deposit Amount'"
              :list="get(detail, item.field)"
            ></data-amount>
            <div v-else-if="item.name == 'Ranks' || item.name == 'Winner Rewards'">
              <div
                v-for="(i,index1) in Object.keys(get(detail,item.field))"
                :key="index1"
              >
                <span
                  v-for="(m,index2) in get(detail,item.field)[i]"
                  :key="index2"
                  style="margin-right: 10px;"
                >{{m}}</span>
              </div>
            </div>
            <span v-else-if="item.name == 'Dapp Icon'">
              <span v-if="get(detail, item.field) === ''">-</span>
              <span v-else>
                <span style="display: block;">{{ get(detail, item.field) }}</span>
                <img
                  :src="get(detail, item.field)"
                  alt=""
                  style="height: 40px;"
                />
              </span>
            </span>
            <span v-else-if="item.name == 'Dapp ID'">{{creatDappID}}</span>
            <span v-else>
              {{ get(detail, item.field) || "-" }}
            </span>
          </span>
        </data-item>
      </card>
      <card
        title="DEPOSIT INFORMATION"
        v-if="isSenderDepositResult"
      >
        <el-table
          :data="senderDepositResult"
          style="width: 100%"
        >
          <el-table-column label="Sender">
            <template slot-scope="scope">
              <hg-link
                type="address"
                :content="scope.row.sender"
                :ellipsis="true"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="Number"
            prop="number"
          >
          </el-table-column>
          <el-table-column label="Deposit">
            <template slot-scope="scope">
              <data-amount :list="handleAmount(scope.row.deposit)" />
            </template>
          </el-table-column>
          <el-table-column label="Deposit Fee">
            <template slot-scope="scope">
              <data-amount :list="handleAmount(scope.row.depositFee)" />
            </template>
          </el-table-column>
          <el-table-column label="Luck Deposit">
            <template slot-scope="scope">
              <data-amount :list="handleAmount(scope.row.luckDeposit)" />
            </template>
          </el-table-column>
        </el-table>
      </card>
    </div>
  </div>
</template>
<script>
import { isEmpty, get, find, findLast } from "lodash";
import { mapState } from "vuex";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import { NetInfo } from "@/constants";
import axios from "axios";
import $ajax from "@/utils/ajax";
import Big from "big.js";
import numeral from "numeral";
export default {
  data() {
    const defaultFields = [
      {
        name: "Time",
        name_zh: this.$t("tx.time"),
        field: "timestamp",
        linkType: ""
      },
      {
        name: "Txhash",
        name_zh: this.$t("tx.tx"),
        field: "txhash",
        linkType: "tx"
      },
      {
        name: "Block",
        name_zh: this.$t("tx.block"),
        field: "height",
        linkType: "block"
      },
      {
        name: "Memo",
        name_zh: this.$t("tx.memo"),
        field: "tx.value.memo",
        linkType: ""
      },
      {
        name: "Action",
        name_zh: this.$t("tx.action"),
        field: "",
        linkType: ""
      },
      {
        name: "Fee Amount",
        name_zh: "Fee",
        field: "tx.value.fee.amount",
        linkType: ""
      }
    ];

    const txListFieldsMap = {
      // bank
      send: [
        ...defaultFields,
        {
          name: "From",
          name_zh: this.$t("send.from"),
          field: "tx.value.msg.0.value.from_address",
          linkType: "address"
        },
        {
          name: "To",
          name_zh: this.$t("send.to"),
          field: "tx.value.msg.0.value.to_address",
          linkType: "address"
        }
      ],
      multisend: [
        ...defaultFields,
        {
          name: "Inputs",
          name_zh: "Inputs",
          field: "tx.value.msg.0.value.inputs",
          linkType: ""
        },
        {
          name: "Outputs",
          name_zh: "Outputs",
          field: "tx.value.msg.0.value.outputs",
          linkType: ""
        }
      ],

      // staking
      delegate: [
        ...defaultFields,
        {
          name: "Delegator",
          name_zh: "Delegator Address",
          field: "tx.value.msg.0.value.delegator_address",
          linkType: "address"
        },
        {
          name: "Destination Validator",
          name_zh: "Validator Address",
          field: "tx.value.msg.0.value.validator_address",
          linkType: "validator"
        },
        {
          name: "Amount",
          name_zh: "Amount",
          field: "tx.value.msg.0.value.amount",
          linkType: ""
        }
      ],
      begin_redelegate: [
        ...defaultFields,
        {
          name: "Validator From",
          name_zh: "Validator From",
          field: "tx.value.msg.0.value.validator_src_address",
          linkType: "validator"
        },
        {
          name: "Validator To",
          name_zh: "Validator To",
          field: "tx.value.msg.0.value.validator_dst_address",
          linkType: "validator"
        },
        {
          name: "Delegator",
          name_zh: "Delegator Address",
          field: "tx.value.msg.0.value.delegator_address",
          linkType: "address"
        },
        {
          name: "Shares Amount",
          name_zh: "Shares Amount",
          field: "tx.value.msg.0.value.amount",
          linkType: ""
        }
      ],
      begin_unbonding: [
        ...defaultFields,
        {
          name: "Validator",
          name_zh: "Validator Address",
          field: "tx.value.msg.0.value.validator_address",
          linkType: "validator"
        },
        {
          name: "Delegator",
          name_zh: "Delegator Address",
          field: "tx.value.msg.0.value.delegator_address",
          linkType: "address"
        },
        {
          name: "Amount",
          name_zh: "Amount",
          field: "tx.value.msg.0.value.amount",
          linkType: ""
        }
      ],
      create_validator: [
        ...defaultFields,
        {
          name: "Validator",
          name_zh: this.$t("block.validators"),
          field: "tx.value.msg.0.value.validator_address",
          linkType: "validator"
        },
        {
          name: "Owner",
          name_zh: "Owner",
          field: "tx.value.msg.0.value.delegator_address",
          linkType: "address"
        },
        {
          name: "Self Bond",
          name_zh: "Self Bond",
          field: "tx.value.msg.0.value.value",
          linkType: ""
        }
      ],
      edit_validator: [
        ...defaultFields,
        {
          name: "Validator",
          name_zh: this.$t("block.validators"),
          field: "tx.value.msg.0.value.address",
          linkType: "validator"
        },
        {
          name: "Moniker",
          name_zh: "Moniker",
          field: "tx.value.msg.0.value.Description.moniker",
          linkType: ""
        }
      ],

      // slashing
      unjail: [
        ...defaultFields,
        {
          name: "Validator",
          name_zh: this.$t("block.validators"),
          field: "tx.value.msg.0.value.address",
          linkType: "validator"
        }
      ],

      // distribution
      set_withdraw_address: [
        ...defaultFields,
        {
          name: "Delegator Address",
          name_zh: "Delegator Address",
          field: "tx.value.msg.0.value.delegator_address",
          linkType: "address"
        },
        {
          name: "Withdraw Address",
          name_zh: "Withdraw Address",
          field: "tx.value.msg.0.value.withdraw_address",
          linkType: "address"
        }
      ],
      withdraw_delegator_reward: [
        ...defaultFields,
        {
          name: "Delegator Address",
          name_zh: "Delegator Address",
          field: "tx.value.msg.0.value.delegator_address",
          linkType: "address"
        },
        {
          name: "Validator Address",
          name_zh: "Validator Address",
          field: "tx.value.msg.0.value.validator_address",
          linkType: "validator"
        },
        {
          name: "Withdraw Rewards",
          name_zh: "Rewards",
          field: "events.2.attributes.0.value",
          linkType: ""
        }
      ],
      withdraw_validator_rewards_all: [
        ...defaultFields,
        {
          name: "Validator Address",
          name_zh: "Validator Address",
          field: "tags.2.value",
          linkType: "validator"
        },
        {
          name: "Commission",
          name_zh: "Commission",
          field: "tags.3.value",
          linkType: ""
        }
      ],

      // gov
      submit_proposal: [
        ...defaultFields,
        {
          name: "Proposal Id",
          name_zh: `${this.$t("proposals.proposals")} ID`,
          field: "events.1.attributes.1.value",
          linkType: ""
        },
        {
          name: "Proposer",
          name_zh: this.$t("proposals.proposer"),
          field: "tx.value.msg.0.value.proposer",
          linkType: "address"
        },
        {
          name: "Proposal Type",
          name_zh: this.$t("proposals.type"),
          field: "tx.value.msg.0.value.content.type",
          linkType: ""
        },
        {
          name: "Title",
          name_zh: this.$t("proposals.title"),
          field: "tx.value.msg.0.value.content.value.title",
          linkType: ""
        }
      ],
      deposit: [
        ...defaultFields,
        {
          name: "Proposal Id",
          name_zh: `${this.$t("proposals.proposals")} ID`,
          field: "tx.value.msg.0.value.proposal_id",
          linkType: ""
        },
        {
          name: "Depositor",
          name_zh: "Depositor",
          field: "tx.value.msg.0.value.depositor",
          linkType: "address"
        },
        {
          name: "Amount",
          name_zh: this.$t("send.amount"),
          field: "tx.value.msg.0.value.amount",
          linkType: ""
        }
      ],
      vote: [
        ...defaultFields,
        {
          name: "Proposal Id",
          name_zh: `${this.$t("proposals.proposals")} ID`,
          field: "tx.value.msg.0.value.proposal_id",
          linkType: ""
        },
        {
          name: "Option",
          name_zh: this.$t("proposals.status"),
          field: "tx.value.msg.0.value.option",
          linkType: ""
        },
        {
          name: "Voter",
          name_zh: this.$t("proposals.voter"),
          field: "tx.value.msg.0.value.voter",
          linkType: "address"
        }
      ],
      call: [...defaultFields],
      all: [...defaultFields],
      deploy: [
        ...defaultFields,
        {
          name: "Contract Address",
          name_zh: this.$t("contract.contractAddress"),
          field: "",
          linkType: ""
        }
      ],
      record: [
        // {
        //   name: "Time",
        //   name_zh: this.$t("record.chainTime"),
        //   field: "timestamp",
        //   linkType: ""
        // },
        {
          name: "Record ID",
          name_zh: this.$t("record.recordId"),
          field: "",
          linkType: ""
        },
        {
          name: "Record Org ID",
          name_zh: this.$t("record.orgId"),
          field: "",
          linkType: ""
        },
        {
          name: "Sender",
          name_zh: this.$t("tx.sender"),
          field: "tx.value.msg.0.value.sender",
          linkType: ""
        }
      ]
    };

    const txFieldsMap = {
      // bank
      send_bank: [
        ...txListFieldsMap.send,
        {
          name: "Amount",
          name_zh: this.$t("send.amount"),
          field: "tx.value.msg.0.value.amount",
          linkType: ""
        }
      ],
      multisend_bank: [...txListFieldsMap.multisend],

      // staking
      delegate_staking: [...txListFieldsMap.delegate],
      begin_redelegate_staking: [
        ...txListFieldsMap.begin_redelegate,
        {
          name: "End Time",
          name_zh: this.$t("tx.endTime"),
          field: "",
          linkType: ""
        }
      ],
      begin_unbonding_staking: [
        ...txListFieldsMap.begin_unbonding,
        {
          name: "End Time",
          name_zh: this.$t("tx.endTime"),
          field: "",
          linkType: ""
        }
      ],
      create_validator_staking: [
        ...txListFieldsMap.create_validator,
        {
          name: "Commission Rate",
          name_zh: "Commission Rate",
          field: "tx.value.msg.0.value.commission.rate",
          linkType: ""
        },
        {
          name: "Commission Max Change Rate",
          name_zh: "Commission Max Change Rate",
          field: "tx.value.msg.0.value.commission.max_change_rate",
          linkType: ""
        },
        {
          name: "Commission Max Rate",
          name_zh: "Commission Max Rate",
          field: "tx.value.msg.0.value.commission.max_rate",
          linkType: ""
        },
        {
          name: "Min Self Delegation",
          name_zh: "Min Self Delegation",
          field: "tx.value.msg.0.value.min_self_delegation",
          linkType: ""
        },
        {
          name: "Description",
          name_zh: this.$t("proposals.description"),
          field: "tx.value.msg.0.value.description.details",
          linkType: ""
        }
      ],
      edit_validator_staking: [
        ...txListFieldsMap.edit_validator,
        {
          name: "Identity",
          name_zh: "Identity",
          field: "tx.value.msg.0.value.Description.identity",
          linkType: ""
        },
        {
          name: "Website",
          name_zh: "Website",
          field: "tx.value.msg.0.value.Description.website",
          linkType: ""
        },
        {
          name: "Details",
          name_zh: "Details",
          field: "tx.value.msg.0.value.Description.details",
          linkType: ""
        },
        {
          name: "Commission Rate",
          name_zh: "Commission Rate",
          field: "tx.value.msg.0.value.commission_rate",
          linkType: ""
        },
        {
          name: "Min Self Delegation",
          name_zh: "Min Self Delegation",
          field: "tx.value.msg.0.value.min_self_delegation",
          linkType: ""
        }
      ],

      // slashing
      unjail_slashing: [...txListFieldsMap.unjail],

      // distribution
      set_withdraw_address_distribution: [
        ...txListFieldsMap.set_withdraw_address
      ],
      withdraw_delegator_reward_distribution: [
        ...txListFieldsMap.withdraw_delegator_reward
      ],
      withdraw_validator_rewards_all_distribution: [
        ...txListFieldsMap.withdraw_validator_rewards_all
      ],

      // gov
      submit_proposal_governance: [
        ...txListFieldsMap.submit_proposal,
        {
          name: "Name",
          name_zh: this.$t("record.name"),
          field: "tx.value.msg.0.value.content.value.apply_info.name",
          linkType: ""
        },
        {
          name: "Owner",
          name_zh: this.$t("record.owner"),
          field: "tx.value.msg.0.value.content.value.apply_info.owner",
          linkType: ""
        },
        {
          name: "Voter",
          name_zh: this.$t("record.voter"),
          field: "tx.value.msg.0.value.content.value.apply_info.voter",
          linkType: ""
        },
        {
          name: "Supervisor",
          name_zh: this.$t("record.supervisor"),
          field: "tx.value.msg.0.value.content.value.apply_info.supervisor",
          linkType: ""
        },
        {
          name: "Validator",
          name_zh: this.$t("record.validator"),
          field: "tx.value.msg.0.value.content.value.apply_info.validator",
          linkType: ""
        },
        {
          name: "Votes",
          name_zh: this.$t("record.votes"),
          field: "tx.value.msg.0.value.content.value.apply_info.votes",
          linkType: ""
        },
        {
          name: "Logo url",
          name_zh: this.$t("record.orgLogoUrl"),
          field: "tx.value.msg.0.value.content.value.apply_info.logo_url",
          linkType: ""
        },
        {
          name: "Node Id",
          name_zh: this.$t("editOrg.nodeId"),
          field: "tx.value.msg.0.value.content.value.apply_info.node_id",
          linkType: ""
        },
        {
          name: "Node Ip",
          name_zh: this.$t("editOrg.nodeIp"),
          field: "tx.value.msg.0.value.content.value.apply_info.node_ip",
          linkType: ""
        },
        {
          name: "Apply Description",
          name_zh: this.$t("proposals.description"),
          field: "tx.value.msg.0.value.content.value.description",
          linkType: ""
        },
        {
          name: "OrgDescription",
          name_zh: this.$t("record.orgDescription"),
          field: "tx.value.msg.0.value.content.value.apply_info.description",
          linkType: ""
        }
      ],
      deposit_governance: [...txListFieldsMap.deposit],
      vote_governance: [...txListFieldsMap.vote],
      call_contract: [
        ...txListFieldsMap.call,
        {
          name: "Contract Address",
          name_zh: this.$t("contract.contractAddress"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Name",
          name_zh: this.$t("contract.name"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Org Id",
          name_zh: this.$t("record.orgId"),
          field: "",
          linkType: ""
        },
        {
          name: "Method",
          name_zh: this.$t("contract.method"),
          filed: "",
          linkType: ""
        },
        {
          name: "Params",
          name_zh: this.$t("contract.params"),
          filed: "",
          linkType: ""
        }
      ],
      call_contract_transaction: [
        {
          name: "Sender",
          name_zh: this.$t("tx.sender"),
          field: "sender",
          linkType: ""
        },
        {
          name: "Recipient",
          name_zh: this.$t("contract.recipient"),
          field: "recipient",
          linkType: ""
        },
        {
          name: "Contract Send Amount",
          name_zh: this.$t("send.amount"),
          field: "amount",
          linkType: ""
        }
      ],
      deploy_: [
        ...txListFieldsMap.call,
        {
          name: "Contract Address",
          name_zh: this.$t("contract.contractAddress"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Name",
          name_zh: this.$t("contract.name"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Org Id",
          name_zh: this.$t("record.orgId"),
          field: "",
          linkType: ""
        },
        {
          name: "Method",
          name_zh: this.$t("contract.method"),
          filed: "",
          linkType: ""
        },
        {
          name: "Params",
          name_zh: this.$t("contract.params"),
          filed: "",
          linkType: ""
        }
      ],
      call_: [
        ...txListFieldsMap.call,
        {
          name: "Contract Address",
          name_zh: this.$t("contract.contractAddress"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Name",
          name_zh: this.$t("contract.name"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Org Id",
          name_zh: this.$t("record.orgId"),
          field: "",
          linkType: ""
        },
        {
          name: "Method",
          name_zh: this.$t("contract.method"),
          filed: "",
          linkType: ""
        },
        {
          name: "Params",
          name_zh: this.$t("contract.params"),
          filed: "",
          linkType: ""
        }
      ],
      "call-job_": [
        ...txListFieldsMap.call,
        {
          name: "Contract Address",
          name_zh: this.$t("contract.contractAddress"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Name",
          name_zh: this.$t("contract.name"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Org Id",
          name_zh: this.$t("record.orgId"),
          field: "",
          linkType: ""
        },
        {
          name: "Method",
          name_zh: this.$t("contract.method"),
          filed: "",
          linkType: ""
        },
        {
          name: "Params",
          name_zh: this.$t("contract.params"),
          filed: "",
          linkType: ""
        }
      ],
      job_: [
        ...txListFieldsMap.call,
        {
          name: "Contract Address",
          name_zh: this.$t("contract.contractAddress"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Name",
          name_zh: this.$t("contract.name"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Org Id",
          name_zh: this.$t("record.orgId"),
          field: "",
          linkType: ""
        },
        {
          name: "Method",
          name_zh: this.$t("contract.method"),
          filed: "",
          linkType: ""
        },
        {
          name: "Params",
          name_zh: this.$t("contract.params"),
          filed: "",
          linkType: ""
        }
      ],
      "job-add_": [
        ...txListFieldsMap.call,
        {
          name: "Contract Address",
          name_zh: this.$t("contract.contractAddress"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Name",
          name_zh: this.$t("contract.name"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Org Id",
          name_zh: this.$t("record.orgId"),
          field: "",
          linkType: ""
        },
        {
          name: "Method",
          name_zh: this.$t("contract.method"),
          filed: "",
          linkType: ""
        },
        {
          name: "Params",
          name_zh: this.$t("contract.params"),
          filed: "",
          linkType: ""
        }
      ],
      "job-update_": [
        ...txListFieldsMap.call,
        {
          name: "Contract Address",
          name_zh: this.$t("contract.contractAddress"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Name",
          name_zh: this.$t("contract.name"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Org Id",
          name_zh: this.$t("record.orgId"),
          field: "",
          linkType: ""
        },
        {
          name: "Method",
          name_zh: this.$t("contract.method"),
          filed: "",
          linkType: ""
        },
        {
          name: "Params",
          name_zh: this.$t("contract.params"),
          filed: "",
          linkType: ""
        }
      ],
      assetPower_: [
        ...txListFieldsMap.call,
        {
          name: "From Address",
          name_zh: this.$t("contract.fromAddress"),
          field: "tx.value.msg.0.value.from_address",
          linkType: ""
        },
        {
          name: "ContractAddress",
          name_zh: this.$t("contract.contractAddress"),
          field: "tx.value.msg.0.value.contract_address",
          linkType: ""
        },
        {
          name: "Contract Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Name",
          name_zh: this.$t("contract.name"),
          field: "",
          linkType: ""
        },
        {
          name: "Contract Org Id",
          name_zh: this.$t("record.orgId"),
          field: "",
          linkType: ""
        },
        {
          name: "Method",
          name_zh: this.$t("contract.method"),
          filed: "",
          linkType: ""
        },
        {
          name: "Params",
          name_zh: this.$t("contract.params"),
          filed: "",
          linkType: ""
        }
      ],
      record_record: [
        ...defaultFields,
        ...txListFieldsMap.record,
        {
          name: "Name",
          name_zh: this.$t("record.name"),
          field: "tx.value.msg.0.value.params.name",
          linkType: ""
        },
        {
          name: "Author",
          name_zh: this.$t("record.author"),
          field: "tx.value.msg.0.value.params.author",
          linkType: ""
        },
        {
          name: "Org Name",
          name_zh: this.$t("record.orgName"),
          field: "",
          linkType: ""
        },
        {
          name: "Org Description",
          name_zh: this.$t("record.orgDescription"),
          field: "",
          linkType: ""
        },
        {
          name: "Org Logo Url",
          name_zh: this.$t("record.orgLogoUrl"),
          field: "",
          linkType: ""
        },
        {
          name: "Record Code",
          name_zh: this.$t("record.recordCode"),
          field: "tx.value.msg.0.value.params.record_code",
          linkType: ""
        },
        {
          name: "Record Type",
          name_zh: this.$t("record.recordType"),
          field: "tx.value.msg.0.value.params.record_type",
          linkType: ""
        },
        {
          name: "Record Description",
          name_zh: this.$t("record.description"),
          field: "tx.value.msg.0.value.params.description",
          linkType: ""
        },
        {
          name: "Business Data Hash",
          name_zh: this.$t("record.businessDataHash"),
          field: "tx.value.msg.0.value.params.business_data_hash",
          linkType: ""
        },
        {
          name: "Business Data",
          name_zh: this.$t("record.businessData"),
          field: "tx.value.msg.0.value.params.business_data",
          linkType: ""
        },
        {
          name: "Encrypt Data",
          name_zh: this.$t("record.encryptData"),
          field: "tx.value.msg.0.value.params.encrypt_data",
          linkType: ""
        },
        {
          name: "Encrypt Data Pub Key",
          name_zh: this.$t("record.encryptDataPubKey"),
          field: "tx.value.msg.0.value.params.encrypt_data_pub_key",
          linkType: ""
        }
      ],
      "record-auth_record": [
        ...defaultFields,
        ...txListFieldsMap.record,
        {
          name: "Name",
          name_zh: this.$t("record.name"),
          field: "tx.value.msg.0.value.name",
          linkType: ""
        },
        {
          name: "Author",
          name_zh: this.$t("record.author"),
          field: "tx.value.msg.0.value.author",
          linkType: ""
        },
        {
          name: "Org Name",
          name_zh: this.$t("record.orgName"),
          field: "",
          linkType: ""
        },
        {
          name: "Org Description",
          name_zh: this.$t("record.orgDescription"),
          field: "",
          linkType: ""
        },
        {
          name: "Org Logo Url",
          name_zh: this.$t("record.orgLogoUrl"),
          field: "",
          linkType: ""
        },
        {
          name: "Record Code",
          name_zh: this.$t("record.recordCode"),
          field: "tx.value.msg.0.value.record_code",
          linkType: ""
        },
        {
          name: "Record Type",
          name_zh: this.$t("record.recordType"),
          field: "tx.value.msg.0.value.record_type",
          linkType: ""
        },
        {
          name: "Record Description",
          name_zh: this.$t("record.description"),
          field: "tx.value.msg.0.value.description",
          linkType: ""
        },
        {
          name: "Business Data Hash",
          name_zh: this.$t("record.businessDataHash"),
          field: "tx.value.msg.0.value.business_data_hash",
          linkType: ""
        },
        {
          name: "Business Data",
          name_zh: this.$t("record.businessData"),
          field: "tx.value.msg.0.value.business_data",
          linkType: ""
        },
        {
          name: "Encrypt Data Pub Key",
          name_zh: this.$t("record.encryptDataPubKey"),
          field: "tx.value.msg.0.value.encrypt_data_pub_key",
          linkType: ""
        },
        {
          name: "Pre Auth Address",
          name_zh: this.$t("record.preAuthAddress"),
          field: "tx.value.msg.0.value.pre_auth_address",
          linkType: ""
        },
        {
          name: "senderKey",
          name_zh: this.$t("record.senderKey"),
          field: "tx.value.msg.0.value.encrypt_data_owner_pub_key",
          linkType: ""
        },
        {
          name: "Encrypt Data",
          name_zh: this.$t("record.encryptData"),
          field: "tx.value.msg.0.value.encrypt_data",
          linkType: ""
        },
        {
          name: "Pre Auth encryptDataKey",
          name_zh: this.$t("record.encryptDataKey"),
          field: "tx.value.msg.0.value.encrypt_data_owner_encrypt_key",
          linkType: ""
        },
        {
          name: "preAuthAddressKey",
          name_zh: this.$t("record.preAuthAddressKey"),
          field:
            "tx.value.msg.0.value.encrypt_data_pre_auth_address_encrypt_key",
          linkType: ""
        }
      ],
      "record-public_record": [
        ...defaultFields,
        ...txListFieldsMap.record,
        {
          name: "encrypt_data_private_key",
          name_zh: this.$t("record.encryptDataPrivateKey"),
          field: "tx.value.msg.0.value.params.encrypt_data_private_key",
          linkType: ""
        },
        {
          name: "record-public Info Data",
          name_zh: this.$t("record.recordInformation"),
          field: "",
          linkType: ""
        },
        {
          name: "record-public Name",
          name_zh: this.$t("record.name"),
          field: "tx.value.msg.0.value.params.name",
          linkType: ""
        },
        {
          name: "record-public Author",
          name_zh: this.$t("record.author"),
          field: "tx.value.msg.0.value.params.author",
          linkType: ""
        },
        {
          name: "Org Name",
          name_zh: this.$t("record.orgName"),
          field: "",
          linkType: ""
        },
        {
          name: "Org Description",
          name_zh: this.$t("record.orgDescription"),
          field: "",
          linkType: ""
        },
        {
          name: "Org Logo Url",
          name_zh: this.$t("record.orgLogoUrl"),
          field: "",
          linkType: ""
        },
        {
          name: "record-public Record Code",
          name_zh: this.$t("record.recordCode"),
          field: "tx.value.msg.0.value.params.record_code",
          linkType: ""
        },
        {
          name: "record-public Record Type",
          name_zh: this.$t("record.recordType"),
          field: "tx.value.msg.0.value.params.record_type",
          linkType: ""
        },
        {
          name: "record-public Record Description",
          name_zh: this.$t("record.description"),
          field: "tx.value.msg.0.value.params.description",
          linkType: ""
        },
        {
          name: "record-public Business Data Hash",
          name_zh: this.$t("record.businessDataHash"),
          field: "tx.value.msg.0.value.params.business_data_hash",
          linkType: ""
        },
        {
          name: "record-public Business Data",
          name_zh: this.$t("record.businessData"),
          field: "tx.value.msg.0.value.params.business_data",
          linkType: ""
        },
        {
          name: "record-public Encrypt Data",
          name_zh: this.$t("record.encryptData"),
          field: "tx.value.msg.0.value.params.encrypt_data",
          linkType: ""
        },
        {
          name: "record-public Encrypt Data Pub Key",
          name_zh: this.$t("record.encryptDataPubKey"),
          field: "tx.value.msg.0.value.params.encrypt_data_pub_key",
          linkType: ""
        }
      ],
      "record-file_record": [
        ...defaultFields,
        {
          name: "Record ID",
          name_zh: this.$t("record.recordId"),
          field: "",
          linkType: ""
        },
        {
          name: "Org ID",
          name_zh: this.$t("record.orgId"),
          field: "",
          linkType: ""
        },
        {
          name: "File Record Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "File Record Name",
          name_zh: this.$t("record.name"),
          field: "",
          linkType: ""
        },
        {
          name: "File Record Author",
          name_zh: this.$t("record.author"),
          field: "",
          linkType: ""
        },
        {
          name: "Org Name",
          name_zh: this.$t("record.orgName"),
          field: "",
          linkType: ""
        },
        {
          name: "Org Description",
          name_zh: this.$t("record.orgDescription"),
          field: "",
          linkType: ""
        },
        {
          name: "Org Logo Url",
          name_zh: this.$t("record.orgLogoUrl"),
          field: "",
          linkType: ""
        },
        // {
        //   name: "Record Code",
        //   name_zh: this.$t("record.recordCode"),
        //   field: "",
        //   linkType: ""
        // },
        // {
        //   name: "Record Type",
        //   name_zh: this.$t("record.recordType"),
        //   field: "",
        //   linkType: ""
        // },
        // {
        //   name: "Record Description",
        //   name_zh: this.$t("record.description"),
        //   field: "",
        //   linkType: ""
        // },
        // {
        //   name: "Business Data Hash",
        //   name_zh: this.$t("record.businessDataHash"),
        //   field: "",
        //   linkType: ""
        // },
        {
          name: "File Record Business Data",
          name_zh: this.$t("record.businessData"),
          field: "",
          linkType: ""
        },
        {
          name: "File md5",
          name_zh: this.$t("record.fileMd5"),
          field: "",
          linkType: ""
        }
        // {
        //   name: "Encrypt Data",
        //   name_zh: this.$t("record.encryptData"),
        //   field: "",
        //   linkType: ""
        // },
        // {
        //   name: "Encrypt Data Pub Key",
        //   name_zh: this.$t("record.encryptDataPubKey"),
        //   field: "",
        //   linkType: ""
        // }
      ],
      activate_account: [
        ...defaultFields,
        {
          name: "Sender",
          name_zh: this.$t("record.author"),
          field: "tx.value.msg.0.value.sender",
          linkType: ""
        },
        {
          name: "address",
          name_zh: this.$t("activateAccount.address"),
          field: "tx.value.msg.0.value.addresses",
          linkType: ""
        },
        {
          name: "module_roles",
          name_zh: this.$t("activateAccount.moduleRoles"),
          field: "tx.value.msg.0.value.module_roles",
          linkType: ""
        },
        {
          name: "ext_roles",
          name_zh: this.$t("activateAccount.extRoles"),
          field: "tx.value.msg.0.value.ext_roles",
          linkType: ""
        }
      ],
      genesis_org_org: [
        {
          name: "Sender",
          name_zh: this.$t("record.author"),
          field: "tx.value.msg.0.value.sender",
          linkType: ""
        },
        {
          name: "genesis address",
          name_zh: "genesis address",
          field: "tx.value.msg.0.value.address",
          linkType: ""
        }
      ],
      edit_org_org: [
        {
          name: "Sender",
          name_zh: this.$t("record.author"),
          field: "tx.value.msg.0.value.sender",
          linkType: ""
        },
        {
          name: "org id",
          name_zh: this.$t("record.orgId"),
          field: "tx.value.msg.0.value.org_id",
          linkType: ""
        },
        {
          name: "Logo url",
          name_zh: this.$t("record.orgLogoUrl"),
          field: "tx.value.msg.0.value.logo_url",
          linkType: ""
        },
        {
          name: "edit org Description",
          name_zh: this.$t("record.description"),
          field: "tx.value.msg.0.value.description",
          linkType: ""
        },
        {
          name: "Node Id",
          name_zh: this.$t("editOrg.nodeId"),
          field: "tx.value.msg.0.value.node_id",
          linkType: ""
        },
        {
          name: "Node Ip",
          name_zh: this.$t("editOrg.nodeIp"),
          field: "tx.value.msg.0.value.node_ip",
          linkType: ""
        }
      ],
      disable_account: [
        ...defaultFields,
        {
          name: "Sender",
          name_zh: this.$t("tx.sender"),
          field: "tx.value.msg.0.value.sender",
          linkType: "address"
        },
        {
          name: "Target Address",
          name_zh: this.$t("tx.Target"),
          field: "tx.value.msg.0.value.addresses",
          linkType: ""
        },
        {
          name: "targetStatus",
          name_zh: this.$t("proposals.status"),
          field: "tx.value.msg.0.value.disable",
          linkType: ""
        }
      ],
      "erc20-migrate-exchange_none": [
        ...defaultFields,
        {
          name: "erc20-migrate Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "Allow",
          name_zh: this.$t("tx.allow"),
          field: "tx.value.msg.0.value.allows",
          linkType: ""
        },
        {
          name: "Exchange From",
          name_zh: this.$t("tx.exchangeFrom"),
          field: "tx.value.msg.0.value.exchange_from",
          linkType: ""
        }
      ],
      "erc20-migrate_none": [
        ...defaultFields,
        {
          name: "erc20-migrate Sender",
          name_zh: this.$t("tx.sender"),
          field: "",
          linkType: ""
        },
        {
          name: "erc20 Tx Hash",
          name_zh: this.$t("tx.erc20TxHash"),
          field: "tx.value.msg.0.value.erc20_tx_hash",
          linkType: ""
        },
        {
          name: "eth Tx Hash",
          name_zh: this.$t("tx.ethTxHash"),
          field: "tx.value.msg.0.value.eth_tx_hash",
          linkType: ""
        },
        {
          name: "erc20 Address",
          name_zh: this.$t("tx.erc20Address"),
          field: "tx.value.msg.0.value.erc20_address",
          linkType: ""
        },
        {
          name: "erc20-migrate From",
          name_zh: "From",
          field: "",
          linkType: ""
        },
        {
          name: "To",
          name_zh: this.$t("tx.to"),
          field: "tx.value.msg.0.value.to",
          linkType: "address"
        },
        {
          name: "Amount",
          name_zh: this.$t("send.amount"),
          field: "tx.value.msg.0.value.amount",
          linkType: ""
        },
        {
          name: "Migrate Reward",
          name_zh: "Rewards",
          field: "",
          linkType: ""
        },
        {
          name: "Migrate Reward From",
          name_zh: "Rewards From",
          field: "",
          linkType: ""
        },
        {
          name: "Channel",
          name_zh: this.$t("tx.channel"),
          field: "tx.value.msg.0.value.channel",
          linkType: ""
        }
      ],
      grid999_dapp_generate_grid999: [
        ...defaultFields,
        {
          name: "Sender",
          name_zh: this.$t("tx.sender"),
          field: "tx.value.msg.0.value.sender",
          linkType: "address"
        }
      ],
      dapp_info: [
        {
          name: "Dapp Name",
          name_zh: "Dapp Name",
          field: "tx.value.msg.0.value.dapp.name",
          linkType: ""
        },
        {
          name: "Dapp Desc",
          name_zh: "Dapp Desc",
          field: "tx.value.msg.0.value.dapp.desc",
          linkType: ""
        },
        {
          name: "Dapp ID",
          name_zh: "Dapp ID",
          field: "",
          linkType: ""
        },
        {
          name: "Dapp Icon",
          name_zh: "Dapp Icon",
          field: "tx.value.msg.0.value.dapp.icon",
          linkType: ""
        },
        {
          name: "Deposit To Lucky Pool Digit",
          name_zh: "Deposit To Lucky Pool Digit",
          field: "tx.value.msg.0.value.dapp.deposit_to_lucky_pool_digit",
          linkType: ""
        },
        {
          name: "End Height",
          name_zh: "End Height",
          field: "tx.value.msg.0.value.dapp.end_height",
          linkType: ""
        },
        {
          name: "Grid Create Can Deposit",
          name_zh: "Grid Create Can Deposit",
          field: "tx.value.msg.0.value.dapp.grid_create_can_deposit",
          linkType: ""
        },
        {
          name: "Lucky Pool Ratio",
          name_zh: "Lucky Pool Ratio",
          field: "tx.value.msg.0.value.dapp.lucky_pool_ratio",
          linkType: ""
        },
        {
          name: "Lucky Pool Rewards Digit",
          name_zh: "Lucky Pool Rewards Digit",
          field: "tx.value.msg.0.value.dapp.lucky_pool_rewards_digit",
          linkType: ""
        },
        {
          name: "Max Blocks Grid Create",
          name_zh: "Max Blocks Grid Create",
          field: "tx.value.msg.0.value.dapp.max_blocks_grid_create",
          linkType: ""
        },
        {
          name: "Max Blocks Grid Deposit",
          name_zh: "Max Blocks Grid Deposit",
          field: "tx.value.msg.0.value.dapp.max_blocks_grid_deposit",
          linkType: ""
        },
        {
          name: "Max Blocks Grid Deposit Withdraw",
          name_zh: "Max Blocks Grid Deposit Withdraw",
          field: "tx.value.msg.0.value.dapp.max_blocks_grid_deposit_withdraw",
          linkType: ""
        },
        {
          name: "Max Blocks Grid Rewards Withdraw",
          name_zh: "Max Blocks Grid Rewards Withdraw",
          field: "tx.value.msg.0.value.dapp.max_blocks_grid_rewards_withdraw",
          linkType: ""
        },
        {
          name: "Only Owner Can Create Grid",
          name_zh: "Only Owner Can Create Grid",
          field: "tx.value.msg.0.value.dapp.only_owner_can_create_grid",
          linkType: ""
        },
        {
          name: "Dapp Owner",
          name_zh: "Owner",
          field: "tx.value.msg.0.value.dapp.owner",
          linkType: ""
        },
        {
          name: "Owner Rewards Ratio",
          name_zh: "Owner Rewards Ratio",
          field: "tx.value.msg.0.value.dapp.owner_rewards_ratio",
          linkType: ""
        },
        {
          name: "Per Grid Max Deposits",
          name_zh: "Per Grid Max Deposits",
          field: "tx.value.msg.0.value.dapp.per_grid_max_deposits",
          linkType: ""
        },
        {
          name: "Rand Number Negative Critical Value",
          name_zh: "Rand Number Negative Critical Value",
          field:
            "tx.value.msg.0.value.dapp.rand_number_negative_critical_value",
          linkType: ""
        },
        {
          name: "Rank Type",
          name_zh: "Rank Type",
          field: "tx.value.msg.0.value.dapp.rank_type",
          linkType: ""
        },
        {
          name: "Ree Ratio",
          name_zh: "Ree Ratio",
          field: "tx.value.msg.0.value.dapp.ree_ratio",
          linkType: ""
        },
        {
          name: "Voted",
          name_zh: "Voted",
          field: "tx.value.msg.0.value.dapp.voted",
          linkType: ""
        },
        {
          name: "Max Deposit Amount",
          name_zh: "Max Deposit Amount",
          field: "tx.value.msg.0.value.dapp.max_deposit_amount",
          linkType: ""
        },
        {
          name: "Min Deposit Amount",
          name_zh: "Min Deposit Amount",
          field: "tx.value.msg.0.value.dapp.min_deposit_amount",
          linkType: ""
        },
        {
          name: "Max Per Deposit",
          name_zh: "Max Per Deposit",
          field: "tx.value.msg.0.value.dapp.max_per_deposit",
          linkType: ""
        },
        {
          name: "Member Min Deposit",
          name_zh: "Member Min Deposit",
          field: "tx.value.msg.0.value.dapp.member_min_deposit",
          linkType: ""
        },
        {
          name: "Owner Min Deposit",
          name_zh: "Owner Min Deposit",
          field: "tx.value.msg.0.value.dapp.owner_min_deposit",
          linkType: ""
        },
        {
          name: "Ranks",
          name_zh: "Ranks",
          field: "tx.value.msg.0.value.dapp.ranks",
          linkType: ""
        },
        {
          name: "Winner Rewards",
          name_zh: "Winner Rewards",
          field: "tx.value.msg.0.value.dapp.winner_rewards",
          linkType: ""
        }
      ],
      grid999_dapp_create_grid_grid999: [
        ...defaultFields,
        {
          name: "Sender",
          name_zh: this.$t("tx.sender"),
          field: "tx.value.msg.0.value.sender",
          linkType: "address"
        },
        {
          name: "Dapp ID",
          name_zh: "Dapp ID",
          field: "tx.value.msg.0.value.dapp_id",
          linkType: ""
        },
        {
          name: "Create Grid ID",
          name_zh: "Grid ID",
          field: "",
          linkType: ""
        },
        {
          name: "Locked",
          name_zh: "Locked",
          field: "tx.value.msg.0.value.locked",
          linkType: ""
        },
        {
          name: "Zero Valued",
          name_zh: "Zero Valued",
          field: "tx.value.msg.0.value.zero_valued",
          linkType: ""
        },
        {
          name: "Dapp Deposit",
          name_zh: "Deposit",
          field: "tx.value.msg.0.value.deposit",
          linkType: ""
        },
        {
          name: "Owner Number",
          name_zh: "Owner Number",
          field: "",
          linkType: ""
        },
        {
          name: "Total Number",
          name_zh: "Total Number",
          field: "",
          linkType: ""
        }
      ],
      grid999_dapp_deposit_grid999: [
        ...defaultFields,
        {
          name: "Sender",
          name_zh: this.$t("tx.sender"),
          field: "tx.value.msg.0.value.sender",
          linkType: "address"
        },
        {
          name: "Dapp ID",
          name_zh: "Dapp ID",
          field: "tx.value.msg.0.value.dapp_id",
          linkType: ""
        },
        {
          name: "Grid ID",
          name_zh: "Grid ID",
          field: "tx.value.msg.0.value.grid_id",
          linkType: ""
        },
        {
          name: "Index",
          name_zh: "Index",
          field: "tx.value.msg.0.value.index",
          linkType: ""
        },
        {
          name: "Dapp Deposit",
          name_zh: "Deposit",
          field: "tx.value.msg.0.value.deposit",
          linkType: ""
        },
        {
          name: "Lucky Deposit",
          name_zh: "Lucky Deposit",
          field: "",
          linkType: ""
        },
        {
          name: "Deposit Fee",
          name_zh: "Deposit Fee",
          field: "",
          linkType: ""
        }
      ],
      grid999_dapp_withdraw_grid999: [
        ...defaultFields,
        {
          name: "Sender",
          name_zh: this.$t("tx.sender"),
          field: "tx.value.msg.0.value.sender",
          linkType: "address"
        },
        {
          name: "Dapp ID",
          name_zh: "Dapp ID",
          field: "tx.value.msg.0.value.dapp_id",
          linkType: ""
        },
        {
          name: "Grid ID",
          name_zh: "Grid ID",
          field: "tx.value.msg.0.value.grid_id",
          linkType: ""
        },
        {
          name: "Grid Withdraw Deposit",
          name_zh: "Deposit",
          field: "",
          linkType: ""
        },
        {
          name: "Grid Withdraw Rewards",
          name_zh: "Rewards",
          field: "",
          linkType: ""
        },
        {
          name: "Grid Withdraw Lucky",
          name_zh: "Lucky",
          field: "",
          linkType: ""
        },
        {
          name: "Grid Withdraw Fee",
          name_zh: "Dapp Fee",
          field: "",
          linkType: ""
        }
      ]
    };

    return {
      showPrivateDialog: false,
      privateKey: "",
      fields: txFieldsMap,
      orgName: "",
      orgDes: "",
      orgLogo: "",
      contractSender: "",
      contractName: "",
      contractOrgId: "",
      RecordOrgID: "",
      recordData: {
        owner: "",
        id: "",
        record_time: "",
        org_id: "",
        name: "",
        author: "",
        description: "",
        record_code: "",
        record_type: "",
        business_data: "",
        encrypt_data: "",
        business_data_hash: "",
        encrypt_data_pub_key: "",
        data_private_key: "",
        visible: true,
        txHash: ""
      },
      total_number: "",
      senderDepositResult: [],
      isSenderDepositResult: false
    };
  },
  methods: {
    isEmpty,
    get,
    rewardList(val) {
      const list = val.split(",");
      const result = [];
      list.forEach(i => {
        const denom = i.replace(/[^a-z]/gi, "");
        const amount = i.replace(/[^0-9]/gi, "");
        result.push({ denom, amount });
      });
      return result;
    },
    submitPrivateKey() {
      this.$emit("submit-private-key");
    },
    async downLoad() {
      let downUrl = `${NetInfo.api}/record/file/${this.hash}?download=true`;

      if (this.recordData.encrypt_file_data_pub_key) {
        this.showPrivateDialog = true;
        this.privateKey = "";

        await new Promise(resolve => {
          this.$once("submit-private-key", () => {
            downUrl += `&owner-private-key=${this.privateKey}`;
            resolve();
          });
        });

        this.showPrivateDialog = false;
      }

      window.open(downUrl);
    },
    async goEtcExplorer(type, value) {
      let lang = navigator.language || navigator.userLanguage;
      if (lang.match("zh")) {
        if (type.match("Hash")) {
          window.open(`https://cn.etherscan.com/tx/${value}`);
        } else {
          window.open(`https://cn.etherscan.com/address/${value}`);
        }
      } else {
        if (type.match("Hash")) {
          window.open(`https://etherscan.io/tx/${value}`);
        } else {
          window.open(`https://etherscan.io/address/${value}`);
        }
      }
    }
  },
  computed: {
    ...mapState("transactions", ["details", "load"]),
    parseValue() {
      return value => {
        if (!isEmpty(value)) {
          return JSON.parse(value);
        }

        return value;
      };
    },
    hash() {
      return this.$route.params.hash;
    },
    detail() {
      const detail = this.details[this.hash];

      return isEmpty(detail) ? {} : detail;
    },
    description() {
      const str = get(
        this.detail,
        get(
          this.fields[this.type].find(f => f.name === "Description"),
          "field"
        )
      );

      if (!str) {
        return "-";
      }

      try {
        return Utf8.stringify(Base64.parse(str));
      } catch (e) {
        return str;
      }
    },
    type() {
      // issue 模块交易失败的时候 tags 中不包含 category 字段。
      // if (action && action.value.match("issue")) {
      //   return action && action.value;
      // }
      if (this.$route.query.type === "contract") {
        return `${this.action && this.action}_`;
      }
      return `${this.action && this.action}_${this.module && this.module}`;
    },
    ownerNumber() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "grid_create"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "owner_number"
        }) || {};
      if (!isEmpty(action)) {
        return numeral(action.value.toString()).format("0,0.[0000]");
      } else {
        return "-";
      }
    },
    gridID() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "grid_create"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "grid_id"
        }) || {};
      if (!isEmpty(action)) {
        return action.value;
      } else {
        return "-";
      }
    },
    creatDappID() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "message"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "dapp_id"
        }) || {};
      if (!isEmpty(action)) {
        return action.value;
      } else {
        return "-";
      }
    },
    luckyDeposit() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "grid_deposit"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "lucky_deposit"
        }) || {};
      if (!isEmpty(action)) {
        if (action.value) {
          const denom = action.value.replace(/[^a-z]/gi, "");
          const amount = action.value.replace(/[^0-9]/gi, "");
          return [{ denom, amount }];
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    depositFee() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "grid_deposit"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "fee"
        }) || {};
      if (!isEmpty(action)) {
        if (action.value) {
          const denom = action.value.replace(/[^a-z]/gi, "");
          const amount = action.value.replace(/[^0-9]/gi, "");
          return [{ denom, amount }];
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    gridWithdrawDeposit() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "grid_withdraw"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "deposit"
        }) || {};
      if (!isEmpty(action)) {
        if (action.value) {
          const denom = action.value.replace(/[^a-z]/gi, "");
          const amount = action.value.replace(/[^0-9]/gi, "");
          return [{ denom, amount }];
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    gridWithdrawRewards() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "grid_withdraw"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "rewards"
        }) || {};
      if (!isEmpty(action)) {
        if (action.value) {
          const list = action.value.split(",");
          const result = [];
          list.forEach(i => {
            const denom = i.replace(/[^a-z]/gi, "");
            const amount = i.replace(/[^0-9]/gi, "");
            result.push({ denom, amount });
          });
          return result;
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    gridWithdrawLucky() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "grid_withdraw"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "lucky"
        }) || {};
      if (!isEmpty(action)) {
        if (action.value) {
          const denom = action.value.replace(/[^a-z]/gi, "");
          const amount = action.value.replace(/[^0-9]/gi, "");
          return [{ denom, amount }];
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    gridWithdrawFee() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "grid_withdraw"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "fee"
        }) || {};
      if (!isEmpty(action)) {
        if (action.value) {
          const denom = action.value.replace(/[^a-z]/gi, "");
          const amount = action.value.replace(/[^0-9]/gi, "");
          return [{ denom, amount }];
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
    handleAmount() {
      return function(val) {
        const denom = val.replace(/[^a-z]/gi, "");
        const amount = val.replace(/[^0-9]/gi, "");
        return [{ denom, amount }];
      };
    },
    migrateRewardFrom() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "message"
      );
      const senderArr = get(eventsMessage[0], "attributes").filter(i => {
        return i.key == "sender";
      });
      if (!isEmpty(senderArr) && senderArr.length >= 2) {
        return senderArr[1].value;
      } else {
        return "";
      }
    },
    migrateReward() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "transfer"
      );
      const amountArr = get(eventsMessage[0], "attributes").filter(i => {
        return i.key == "amount";
      });
      if (!isEmpty(amountArr) && amountArr.length >= 2) {
        const denom = amountArr[1].value.replace(/[^a-z]/gi, "");
        const amount = amountArr[1].value.replace(/[^0-9]/gi, "");
        return [{ denom, amount }];
      } else {
        return "0GARD";
      }
    },
    signer() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "erc20_migrate"
      );
      const action =
        findLast(get(eventsMessage[0], "attributes"), {
          key: "signer"
        }) || {};
      return action.value;
    },
    sender() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "message"
      );
      const action =
        findLast(get(eventsMessage[0], "attributes"), {
          key: "sender"
        }) || {};
      return action.value;
    },
    erc20MigrateFromsender() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "message"
      );
      const action =
        find(get(eventsMessage[0], "attributes"), {
          key: "sender"
        }) || {};
      return action.value;
    },
    action() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "message"
      );
      const action =
        findLast(get(eventsMessage[0], "attributes"), {
          key: "action"
        }) || {};

      return action.value;
    },
    module() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "message"
      );
      const moduleObj =
        findLast(get(eventsMessage[0], "attributes"), {
          key: "module"
        }) || {};

      return moduleObj.value || "none";
    },
    completionTime() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "unbond"
      );
      const unbondObj =
        find(get(eventsMessage[0], "attributes"), {
          key: "completion_time"
        }) || {};

      return unbondObj.value;
    },
    RedelegateCompletionTime() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "redelegate"
      );

      const redelegateObj =
        find(get(eventsMessage[0], "attributes"), {
          key: "completion_time"
        }) || {};

      return redelegateObj.value;
    },
    contractAddress() {
      const result = [];

      get(this.detail, "events", []).forEach(i => {
        i.attributes.forEach(k => {
          result.push(k);
        });
      });

      const address = find(result, i => i.key === "contract_address");

      return !isEmpty(address)
        ? address.value
        : get(this.detail, "tx.value.msg.0.value.contract_address");
    },
    contract_param() {
      const param =
        get(this.detail, "tx.value.msg.0.value.contract_param") || "";

      if (param.indexOf(",[") !== -1) {
        return param.split(",[");
      }

      if (param.includes(", [")) {
        return param.split(", [");
      }

      return [param];
    },
    contractMethod() {
      return this.contract_param[0]
        ? this.contract_param[0].split(":")[1]
        : "-";
    },
    params() {
      return this.contract_param[1]
        ? this.contract_param[1].split("]")[0]
        : "-";
    },
    callIsTransfer() {
      const eventsMessage =
        get(this.detail, "events", []).filter(
          item => item.type === "transfer"
        ) || [];

      return !!eventsMessage.length;
    },
    recipient() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "transfer"
      );
      const result =
        find(get(eventsMessage[0], "attributes"), {
          key: "recipient"
        }) || {};

      return result.value;
    },
    callAmount() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "transfer"
      );
      const result =
        find(get(eventsMessage[0], "attributes"), {
          key: "amount"
        }) || {};

      return result.value;
    },
    callSend() {
      return [
        {
          sender: get(this.detail, "tx.value.msg.0.value.sender"),
          recipient: this.recipient,
          amount: this.callAmount
        }
      ];
    },
    orgId() {
      return find(get(this.detail, "events.0.attributes"), { key: "org-id" })
        ?.value;
    },
    recordId() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item =>
          item.type === "record-auth" ||
          item.type === "record-file" ||
          item.type === "record-public" ||
          item.type === "record"
      );

      const record =
        findLast(get(eventsMessage[0], "attributes"), {
          key: "record-id"
        }) || {};

      return record.value;
      // return this.$route.query.id;
    },
    isImg() {
      return pathImg => {
        const ImgObj = new Image();

        ImgObj.src = pathImg;

        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
          return true;
        }

        return false;
      };
    },
    fileRecordName() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "record" || item.type === "record-auth"
      );

      const record =
        findLast(get(eventsMessage[0], "attributes"), {
          key: "name"
        }) || {};

      return record.value;
    },
    fileRecordAuthor() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "record" || item.type === "record-auth"
      );

      const record =
        findLast(get(eventsMessage[0], "attributes"), {
          key: "author"
        }) || {};

      return record.value;
    },
    fileRecordSender() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "message"
      );
      const record =
        findLast(get(eventsMessage[0], "attributes"), {
          key: "sender"
        }) || {};

      return record.value;
    },
    fileMd5() {
      const eventsMessage = get(this.detail, "events", []).filter(
        item => item.type === "record"
      );
      const record =
        findLast(get(eventsMessage[0], "attributes"), {
          key: "file-md5"
        }) || {};

      return record.value;
    }
  },
  watch: {
    detail() {
      if (isEmpty(this.detail)) {
        return;
      }

      // fetch token detail
      let denom = "";

      if (this.action.match("issue")) {
        denom = get(this.detail, "tags.2.value");
      }

      if (this.action.match("inject")) {
        denom = get(this.detail, "tx.value.msg.0.value.amount.denom");
      }

      if (this.action.match("create")) {
        denom = get(
          this.detail,
          "tx.value.msg.0.value.params.total_amount.token.denom"
        );
      }

      if (this.action.match("take")) {
        denom = get(this.detail, "tx.value.msg.0.value.value.denom");
      }

      if (denom && denom.match(/^coin.{10}$/)) {
        this.$store.dispatch("tokens/fetchDetail", denom);

        return;
      }

      if (this.action.match("send")) {
        const coins = get(this.detail, "tx.value.msg.0.value.amount");

        coins.forEach(i => {
          if (i.denom.match(/^coin.{10}$/)) {
            this.$store.dispatch("tokens/fetchDetail", i.denom);
          }
        });
      }

      if (this.action === "make") {
        const coins = [
          get(this.detail, "tx.value.msg.0.value.target"),
          get(this.detail, "tx.value.msg.0.value.supply")
        ];

        coins.forEach(i => {
          if (i.denom.match(/^coin.{10}$/)) {
            this.$store.dispatch("tokens/fetchDetail", i.denom);
          }
        });
      }
    }
  },
  async mounted() {
    await this.$store.dispatch("transactions/fetch", this.hash);

    if (
      this.action === "record" ||
      this.action === "record-auth" ||
      this.action === "record-public" ||
      this.action === "record-file"
    ) {
      const recordDetail = await this.$store.dispatch(
        "transactions/fetchRecordDetail",
        this.recordId
      );

      this.recordData = recordDetail.result;

      if (!isEmpty(this.orgId)) {
        this.RecordOrgID = this.orgId;
      } else {
        this.RecordOrgID = get(recordDetail, "result.org_id") || "";
      }

      const { result } = await this.$store.dispatch(
        "transactions/fetchOrgDetail",
        this.RecordOrgID
      );

      this.orgName = result.name;
      this.orgDes = result.description;
      this.orgLogo = result.logo_url;
    }
    if (
      this.action == "grid999_dapp_create_grid" ||
      this.action == "grid999_dapp_deposit"
    ) {
      if (this.action == "grid999_dapp_create_grid") {
        const dappId = get(this.detail, "tx.value.msg.0.value.dapp_id");
        const gridId = this.gridID;
        const params = { dappId, gridId };
        const gridDetail = await this.$store.dispatch(
          "transactions/fetchGridDetail",
          params
        );
        const items = get(gridDetail, "result.items");
        const itemSender = items.filter(i => {
          return get(this.detail, "tx.value.msg.0.value.sender") == i.owner;
        });
        this.total_number = numeral(
          itemSender[0].total_number.toString()
        ).format("0,0.[0000]");
      }
      if (this.action == "grid999_dapp_deposit") {
        this.isSenderDepositResult = true;
        const dappId = get(this.detail, "tx.value.msg.0.value.dapp_id");
        const gridId = get(this.detail, "tx.value.msg.0.value.grid_id");
        const params = { dappId, gridId };
        const gridDetail = await this.$store.dispatch(
          "transactions/fetchGridDetail",
          params
        );
        const items = get(gridDetail, "result.items");
        const itemIndex = items.filter(i => {
          return i.index == get(this.detail, "tx.value.msg.0.value.index");
        });
        const senderDeposit = itemIndex[0].deposits.filter(i => {
          return (
            i.split("_")[0] == get(this.detail, "tx.value.msg.0.value.sender")
          );
        });
        const senderDepositResult = [];
        senderDeposit.forEach(i => {
          const formatValue = i.split("_");
          const sender = formatValue[0];
          const number = formatValue[1];
          const deposit = formatValue[2];
          const depositFee = formatValue[3];
          const luckDeposit = formatValue[4];
          senderDepositResult.push({
            sender,
            number,
            deposit,
            depositFee,
            luckDeposit
          });
        });
        this.senderDepositResult = senderDepositResult;
      }
    }
    // 如果是合约交易，获取合约地址信息
    if (this.$route.query.type === "contract") {
      let contractAddress;
      const version =
        get(this.detail, "tx.value.msg.0.value.version") ||
        get(this.detail, "tx.value.msg.0.value.contract_version");

      if (!version) {
        return;
      }

      if (this.contractAddress !== "") {
        contractAddress = this.contractAddress;
      } else {
        contractAddress = get(
          this.detail,
          "tx.value.msg.0.value.contract_address"
        );
      }

      const { result } = await this.$store.dispatch(
        "transactions/fetchContractAddress",
        {
          address: contractAddress,
          version
        }
      );

      this.contractSender =
        get(result, "contracts.0.sender") || get(result, "contract.sender");
      this.contractName =
        get(result, "contracts.0.name") || get(result, "contract.name");
      this.contractOrgId =
        get(result, "contracts.0.org_id") ||
        get(result, "contract.org_id") ||
        this.orgId;
    }
  }
};
</script>
