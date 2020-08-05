// eslint-disable-next-line import/prefer-default-export
export const NetInfo = {
  get api() {
    // if (process.env.NODE_ENV === 'production') {
    // return 'https://rest.hashgard.com/marketing/api';
    // }

    // return `${location.origin}/api`;
    return `https://rest.hashgard.com/gard/api`
  },
  get node() {
    // if (process.env.NODE_ENV === 'production') {
    // return 'https://rest.hashgard.com/marketing/node';
    // }

    // return `${location.origin}/node`;
    return `https://rest.hashgard.com/gard/node`
  },
};
