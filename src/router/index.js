import VueRouter from "vue-router";
import Login from "@/pages/Login.vue";
import Users from "@/pages/Users.vue";
import Main from '@/pages/Main.vue'
import Home from "@/pages/Home.vue";
import Mall from "@/pages/Mall.vue";
import PageOne from "@/pages/PageOne.vue";
import PageTwo from "@/pages/PageTwo.vue";
import PlatformInfo from "@/pages/PlatformInfo.vue"
import PlatformInspectItem from "@/pages/PlatformInspectItem.vue"
import InspectResult from "@/pages/InspectResult.vue"
import NoticeConfig from "@/pages/NoticeConfig.vue"
import {
	Message
} from 'element-ui'

// 检查 token 是否过期
function isTokenExpired() {
	const expiryTime = localStorage.getItem('expiryTime');
	if (!expiryTime) {
		return true; // 如果没有设置过期时间，默认认为 token 已过期
	}
	const currentTime = new Date().getTime();
	return currentTime > parseInt(expiryTime);
}

// 获取存储的 token
function getToken() {
	if (isTokenExpired()) {
		return null; // 如果 token 过期了，则返回 null
	}
	return localStorage.getItem('token');
}

const router = new VueRouter({
	// 浏览器模式设置，设置为history模式
	mode: 'history',
	routes: [{
			path: "/login",
			component: Login,
			name: "Login",
			meta: {
				title: "登录"
			},
		},
		{
			// 子路由
			name: "main",
			path: '/',
			redirect: "/home", //重定向 当路径为/，则重定向home
			component: Main,
			children: [{
					name: "user",
					path: "user",
					component: Users,
					meta: {
						title: "用户管理"
					}
				},
				{
					name: "home",
					path: "home",
					component: Home,
					meta: {
						title: "首页"
					}
				},
				{
					name: "mall",
					path: "mall",
					component: Mall,
					meta: {
						title: "商品管理"
					}
				},
				{
					name: "page1",
					path: "page1",
					component: PageOne,
					meta: {
						title: "页面1"
					}
				},
				{
					name: "page2",
					path: "page2",
					component: PageTwo,
					meta: {
						title: "页面2"
					}
				},
				{
					name: "platformInfo",
					path: "platformInfo",
					component: PlatformInfo,
					meta: {
						title: "平台信息"
					}
				},
				{
					name: "platformInspectItem",
					path: "platformInspectItem",
					component: PlatformInspectItem,
					meta: {
						title: "平台巡检项"
					}
				},
				{
					name: "inspectResult",
					path: "inspectResult",
					component: InspectResult,
					meta: {
						title: "巡检记录"
					}
				},
				{
					name: "noticeConfig",
					path: "noticeConfig",
					component: NoticeConfig,
					meta: {
						title: "通知配置"
					}
				}
			]
		}

	]
})

router.beforeEach((to, from, next) => {
	//这里的to 就是要去哪里 相当于 this.$Router.push()
	//from表示从哪个页面来  next 表示下一步去执行什么操作
	//这里用道德token是后端提供的 我们在登录页登录的时候获取到token存放到本地缓存里
	// 或者存放在vuex中都可以看自己的需要，放在vuex中需要考虑页面刷新vuex中的数据消失的问题
	const token = localStorage.getItem('token');
	// path: '/login',
	//   name: 'Login',
	//   component:'../../src/login/login.vue' 这个是页面的路径
	if(isTokenExpired()){
		localStorage.removeItem("token")
	}
	
	//这个name就是路由中的name属性
	if (to.name !== 'Login' && !token) {
		//如果要跳转的页面不是登录页面 并且没有token就直接跳转登录页
		next({
			name: 'Login'
		})
		Message({
			message: "请登录",
			type: 'warning',
			showIcon: true
		})
	} else if (to.name == 'Login' && token) {
		next({
			name: "home"
		})
	} else {
		next()
	}
})


// 后置路由守卫
router.afterEach((to, from) => {
	document.title = to.meta.title || "通用后台管理系统"
})
export default router