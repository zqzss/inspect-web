import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookie from "js-cookie";

import Forbidden from "@/views/Forbidden.vue"
import Main from "@/views/Main.vue"
import Login from '@/views/login.vue'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
	routes: [{
		path: "/login",
		name: "login",
		component: Login,
		meta: {
			title: "登录"
		}
	}, {
		path: '/forbidden',
		name: 'Forbidden',
		component: Forbidden,
		meta: {
			title: "禁止访问"
		},
	}, {
		path: '/',
		name: 'Main',
		component: Main,
		children: [{
			name: "home",
			path: "home",
			component: Home,
			meta: {title: "首页"}
		}]
	}]
})


//添加全局前置导航守卫
router.beforeEach((to, from, next) => {
	//判断token存不存在
	// const token = Cookie.get('token')
	const token = Cookie.get('username')
	//token不存在，说明当前用户是未登录，应该跳转至登录页
	if (to.name == 'Forbidden' || to.name == 'login') {
		next()
		return
	}
	if (!token && to.name !== 'login') {
		next({
			name: 'login'
		})
	} else if (token && to.name == "login") { //token存在，说明用户登录，此时跳转至首页
		next({
			name: 'home'
		})
	} else {
		// 判断所有权限menu是否包含下一路径to
		// let flag = 0
		// let menu = JSON.parse(Cookie.get('menu'))
		// console.log("menu: " + menu)
		// console.log("to.path: " + to.path)
		// menu.forEach(item => {
		// 	if (item.name) {
		// 		if (item.path == to.path) {
		// 			flag = 1
		// 			console.log("flag=" + flag)
		// 		}
		// 	} else {
		// 		item.children.forEach(item2 => {
		// 			if (item2.path == to.path) {
		// 				flag = 1
		// 				console.log("flag=" + flag)
		// 			}
		// 		})
		// 	}
		// })
		// if (flag == 1) {
		// 	next()
		// } else {
		// 	next({
		// 		name: 'Forbidden'
		// 	})
		// }
		next()
	}


})
// 后置路由守卫
router.afterEach((to, from) => {
	document.title = to.meta.title || "通用后台管理系统"
})
export default router