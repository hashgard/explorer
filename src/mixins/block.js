import dayjs from 'dayjs';
import moment from 'dayjs';
// import {
//   createDecipher
// } from 'crypto';
// import zh from 'dayjs/locale/zh-cn';
// import en from 'dayjs/locale/en-gb';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import updateLocale from 'dayjs/plugin/updateLocale';
import ajax from '@/utils/ajax';

// dayjs.extend(updateLocale);

// dayjs.extend(relativeTime, {
//   thresholds: [{
//       l: 's',
//       r: 1
//     },
//     {
//       l: 'ss',
//       r: 59,
//       d: 'second'
//     },
//     {
//       l: 'm',
//       r: 1
//     },
//     {
//       l: 'mm',
//       r: 59,
//       d: 'minute'
//     },
//     {
//       l: 'h',
//       r: 1
//     },
//     {
//       l: 'hh',
//       r: 23,
//       d: 'hour'
//     },
//     {
//       l: 'd',
//       r: 1
//     },
//     {
//       l: 'dd',
//       r: 29,
//       d: 'day'
//     },
//     {
//       l: 'M',
//       r: 1
//     },
//     {
//       l: 'MM',
//       r: 11,
//       d: 'month'
//     },
//     {
//       l: 'y'
//     },
//     {
//       l: 'yy',
//       d: 'year'
//     },
//   ],
// });

export default {
  data() {
    return {
      // diff: 0,
    };
  },
  methods: {
    // formatTime(time) {
    //   return dayjs(time).subtract(this.diff).fromNow();
    // },
    formatTime(time, currentTime) {
      const blockTime = moment(time).format('YYYY-MM-DD HH:mm:ss')
      const second = dayjs(currentTime).diff(blockTime, 'second');
      if (second < 60) {
        return `${second}${this.$t('time.second')}`
      } else if (second >= 60 && second < 3600) {
        const minute = parseInt(second / 60)
        return `${minute}${this.$t('time.minute')}`
      } else if (second >= 3600 && second < 3600 * 24) {
        const hour = parseInt(second / 3600)
        return `${hour}${this.$t('time.hour')}`
      } else if (second >= 3600 * 24) {
        const day = parseInt(second / (3600 * 24))
        return `${day}${this.$t('time.day')}`
      }
    },
    async fetchCurrentTime() {
      const {
        data
      } = await ajax.get('https://quan.suning.com/getSysTime.do');
      return data.sysTime2
    }
  },
  // async created() {
  //   if (this.$i18n.locale === 'zh') {
  //     dayjs.locale(zh);

  //     dayjs.updateLocale('zh-cn', {
  //       relativeTime: {
  //         future: '%s内',
  //         past: '%s前',
  //         s: '%d 秒',
  //         m: '1 分钟',
  //         mm: '%d 分钟',
  //         h: '1 小时',
  //         hh: '%d 小时',
  //         d: '1 天',
  //         dd: '%d 天',
  //         M: '1 个月',
  //         MM: '%d 个月',
  //         y: '1 年',
  //         yy: '%d 年',
  //       },
  //     });
  //   } else {
  //     dayjs.locale(en);

  //     dayjs.updateLocale('zh-cn', {
  //       relativeTime: {
  //         future: 'in %s',
  //         past: '%s ago',
  //         s: '%d seconds',
  //         m: 'a minute',
  //         mm: '%d minutes',
  //         h: 'an hour',
  //         hh: '%d hours',
  //         d: 'a day',
  //         dd: '%d days',
  //         M: 'a month',
  //         MM: '%d months',
  //         y: 'a year',
  //         yy: '%d years',
  //       },
  //     });
  //   }

  //   const {
  //     data
  //   } = await ajax.get('https://quan.suning.com/getSysTime.do');

  //   this.diff = dayjs().diff(data.sysTime2);
  // }
};
