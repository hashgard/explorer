import axios from 'axios';
import { Message } from 'element-ui';
import { NetInfo } from '@/constants';

const $ajax = axios.create({ baseURL: NetInfo.api });

$ajax.interceptors.response.use(
  config => config,
  (error) => {
    if (error.message !== 'Request failed with status code 400') {
      Message({
        type: 'error',
        message: 'Network Error',
        center: true,
      });
    }

    return Promise.reject(error);
  },
);

export default $ajax;
