import Mock from 'mockjs'
import homeApi from "@/api/mockServeData/home";

/*//定义请求拦截
Mock.mock('/api/home/getData',function (){
    //拦截到请求后处理的逻辑
    console.log("拦截到了")
})*/
//定义请求拦截
Mock.mock('/api/home/getData',homeApi.getStatisticalData())

