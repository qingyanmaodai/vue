import store from '@/store';
import { getToken } from '@/utils/auth';
import axios from 'axios';
let base_url;

//http://127.0.0.1                --本机
//http://192.168.1.166:9998       --EK测试地址
//http://192.168.1.166            --EK生产地址
//https://aps.eklights.cn         --EK生产地址
//http://192.168.18.82:9998       --易事特测试地址
//http://192.168.18.82            --易事特地址
//http://121.9.64.70:9998         --恒美外网访问地址
//http://121.9.64.70:9992         --帕尔福访问地址
//http://192.168.30.23:9999       --美特
//http://192.168.128.160          --金羚内网
//http://jinlingfan.gicp.net:5999 --金羚外网
//http://10.50.18.130             --佛照内网
//http://112.15.190.218:9999       --瑞能
//http://172.16.30.212       --tenpao
//http://172.16.30.212:9998       --tenpao测试
//http://10.8.0.18:9998       --金星徽
//http://192.168.99.252       --百威

let apsUrl = ''; //isgo 外网 http://3nr9908182.zicp.vip  qf http://a493486951.wocp.fun
apsUrl = apsUrl.trim();
localStorage.setItem('apsurl', apsUrl);
let _this = this;
if (process.env.NODE_ENV === 'production') {
  base_url = localStorage.getItem('apsurl');
} else if (process.env.NODE_ENV === 'development') {
  // base_url = 'http://192.168.119.99:9998' 10.0.17.70  121.9.64.70:9999 10.0.16.170 10.0.67.10  2.0-http://192.168.1.166
  base_url = localStorage.getItem('apsurl');
}
// http://192.168.119.34:9802/
// create an axios instance
const service = axios.create({
  baseURL: base_url, // api 的 base_url
  timeout: 20 * 60 * 1000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (config.url == '/Login/CheckAccount') {
      config.url = config.url + '?eipaulg=' + config.data.eipaulg;
    }
    // do something before request is sent
    else if (
      config.url != '/Login/CheckAccountJson' &&
      config.url != '/Login/CheckAccount' &&
      store.getters.token
    ) {
      // please modify it according to the actual situation
      config.headers.common['token'] = getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.statusText == 'OK') {
      return response;
    } else {
      return Promise.reject(response.data.msg);
    }
  },
  (error) => {
    return Promise.reject({
      data: {
        data: [],
        dataFooter: null,
        result: false,
        msg: '与服务器通讯失败，请稍后再试',
        count: 1,
        Columns: [],
        request: {},
      },
    });
  },
);

export default service;
