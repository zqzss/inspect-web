<template>
	<div>
		<el-row>
			<el-col :span="8" style="padding-right: 10px">
				<el-card class="box-card">
					<div class="user">
						<img src="@/assets/user.webp" alt="">
						<div class="userinfo">
							<p class="name">Admin</p>
							<p class="access">超级管理员</p>
						</div>
					</div>
					<div class="login-info">
						<p>上次登录的时间：<span>2023-10-30</span></p>
						<p>上次登录的地点：<span>北京</span></p>
					</div>
				</el-card>
				
			</el-col>
			
		</el-row>
	</div>

</template>

<script>
	import {
		getData
	} from "@/api";
	import * as echarts from 'echarts'
	export default {
		name: "Home",
		data() {
			return {
				tableData: [],
				tableLabel: {
					name: '课程',
					todayBuy: '今日购买',
					monthBuy: '本月购买',
					totalBuy: '总共购买'
				},
				countData: [{
						name: "今日支付订单",
						value: 1234,
						icon: "success",
						color: "#2ec7c9",
					},
					{
						name: "今日收藏订单",
						value: 210,
						icon: "star-on",
						color: "#ffb980",
					},
					{
						name: "今日未支付订单",
						value: 1234,
						icon: "s-goods",
						color: "#5ab1ef",
					},
					{
						name: "本月支付订单",
						value: 1234,
						icon: "success",
						color: "#2ec7c9",
					},
					{
						name: "本月收藏订单",
						value: 210,
						icon: "star-on",
						color: "#ffb980",
					},
					{
						name: "本月未支付订单",
						value: 1234,
						icon: "s-goods",
						color: "#5ab1ef",
					},
				],
			}
		},
		mounted() {
			getData().then(({
				data
			}) => {
				console.log(data)
				// data.data
				const {
					tableData
				} = data.data
				this.tableData = tableData

				

			})
		}
	}
</script>

<style scoped lang="less">
	.user {
		display: flex;
		align-items: center;
		padding-bottom: 20px;
		margin-bottom: 20px;
		border-bottom: 1px solid #ccc;

		img {
			margin-right: 40px;
			width: 150px;
			height: 150px;
			border-radius: 50%;
		}

		.userinfo {
			.name {
				font-size: 32px;
				margin-bottom: 10px;
			}

			.access {
				color: #999;
			}
		}
	}

	.login-info {
		p {
			line-height: 28px;
			font-size: 14px;
			color: #999;

			span {
				color: #666;
				margin-left: 60px;
			}
		}
	}

	.num {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.icon {
			width: 80px;
			height: 80px;
			color: #fff;
			line-height: 80px;
			text-align: center;
			font-size: 30px;
		}

		.detail {
			margin-left: 15px;
			display: flex;
			flex-direction: column;
			justify-content: center;

			.price {
				font-size: 30px;
				margin-bottom: 10px;
				line-height: 30px;
			}

			.desc {
				color: #999;
				font-size: 14px;
				text-align: center;
			}
		}

		.el-card {
			margin-bottom: 20px;
			width: 32%;
		}
	}

	.graph {
		display: flex;
		margin-top: 20px;
		justify-content: space-between;

		.el-card {
			width: 48%;
		}
	}
</style>