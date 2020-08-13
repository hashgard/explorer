import moment from 'dayjs';
import numeral from 'numeral';
import Big from 'big.js';

export const upper = s => s.toUpperCase();

export const formatTime = time =>
  time && time.match(/\d{10}/) ? moment.unix(time).format('YYYY-MM-DD HH:mm:ss') : moment(time).format('YYYY-MM-DD HH:mm:ss');

export const formatAGARD = (agard) => {
  const n = Big(agard).div(10 ** 18);

  return numeral(n.toString()).format('0,0.[0000]');
};

export const formatShares = (shares) => {
  const n = Big(shares).div(10 ** 6);

  return numeral(n.toString()).format('0,0.[0000]');
};