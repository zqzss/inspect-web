import axios from 'axios'
import { Button, Message } from 'element-ui'
import router from '@/router'
const request = axios.create({
	// baseURL: "http://192.168.1.147:8088/api",
	baseURL: "http://localhost:8000",
})

// 请求拦截器

request.interceptors.request.use(
    // config：请求报文信息
    function (config) {
        // 在发送请求之前做些什么
        // 如果有token,就在请求头中添加token
        if (localStorage.getItem('token')) {
            config.headers.Authorization = localStorage.getItem('token')
        }
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)
// http response 拦截器
request.interceptors.response.use(

  response => {
	  console.log("response.data",response.data);
    if (response.data.code == 401) {
      router.push({name:'Login'})
	  // this.$router.push('/');
      console.log("token过期");
	  localStorage.removeItem("token")
	  Message({
	  	message: "请登录",
	  	type: 'warning',
	  	showIcon: true
	  })
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default request