<template>
	<div class="header-container">
		<div class="l-content">
			<el-button style="margin-right: 20px" icon="el-icon-menu" size="mini" @click="handleMenu"></el-button>
			<!--      面包屑-->
			<!--      <span class="text">首页</span>-->
			<el-breadcrumb separator="/">
				<el-breadcrumb-item v-for="item in tags" :key="item.path"
					:to="{ path: item.path }">{{ item.label }}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="r-content">
			<el-dropdown>
				<span class="el-dropdown-link">
					<img src="@/assets/user.webp" alt="">
				</span>
				<el-dropdown-menu slot="dropdown" >
					<el-dropdown-item ><el-button @click="personalCenter" style="border: 0px;">个人中心</el-button></el-dropdown-item>
					<!-- <el-dropdown-item v-on:click="logout">退出</el-dropdown-item> -->
					<el-dropdown-item><el-button @click="logout" style="border: 0px;">退出</el-button></el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>

</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: "CommonHeader",
		methods: {
			logout(){
				
				localStorage.removeItem("token")
				console.log("logout")
				this.$router.push("/login")
			},
			personalCenter(){
				this.$router.push({name: "home"})
			},
			handleMenu() {
				this.$store.commit('collapseMenu')
			}
		},
		computed: {
			...mapState({
				tags: state => state.tab.tabsList
			})
		}
	}
</script>

<style scoped lang="less">
	.header-container {
		height: 60px;
		background-color: #333;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px;

		.text {
			color: #fff;
			font-size: 14px;
			margin-left: 10px;
		}

		.r-content {
			img {
				width: 40px;
				height: 40px;
				border-radius: 50%;
			}
		}

		.l-content {
			display: flex;
			align-items: center;

			/deep/.el-breadcrumb__item {
				/*元素没有绑定data-v-5a90ec03这样的编号时候，样式不起作用，使用deep进行穿刺可解决问题*/
				.el-breadcrumb__inner {
					font-weight: normal;

					&.is-link {
						color: #666;
					}
				}

				&:last-child {
					.el-breadcrumb__inner {
						color: #fff;
					}
				}
			}
		}
	}
</style>