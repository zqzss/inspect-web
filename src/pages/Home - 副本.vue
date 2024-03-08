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
						<p>上次登录的时间：<span>2023-08-30</span></p>
						<p>上次登录的地点：<span>北京</span></p>
					</div>
				</el-card>
				<el-card style="margin-top: 20px;height: 460px;">
					<el-table :data="tableData" style="width: 100%;">
						<el-table-column v-for="(val,key) in tableLabel" :prop="key" :label="val" />
					</el-table>
				</el-card>
			</el-col>
			<el-col :span="16" style="padding-left: 10px">
				<div class="num">
					<el-card v-for="item in countData" :key="item.name" :body-style="{display:'flex',padding:0}">
						<i class="icon" :class="`el-icon-${item.icon}`" :style="{background:item.color}"></i>
						<div class="detail">
							<p class="price">￥{{item.value}}</p>
							<p class="desc">{{item.name}}</p>
						</div>
					</el-card>
				</div>
				<el-card style="height: 280px">
					<!--          折线图-->
					<div ref="echarts1" style="height: 280px"></div>
				</el-card>
				<div class="graph">
					<el-card style="height: 260px;">
						<!--            柱状图-->
						<div ref="echarts2" style="height: 260px;"></div>
					</el-card>
					<el-card style="height: 260px;">
						<!--            饼状图-->
						<div ref="echarts3" style="height: 240px"></div>
					</el-card>
				</div>
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

				//   基于准备好的dom,初始化echarts实例
				const echarts1 = echarts.init(this.$refs.echarts1)
				//   指定图表的配置项和数据
				var lineOption = {}
				//   处理数据
				const {
					orderData,
					userData,
					videoData
				} = data.data
				const xAxis = orderData.date
				const xMore = Object.keys(orderData.data[0])
				lineOption.xAxis = {
					data: xAxis
				}
				lineOption.yAxis = {
					type: "value",
					axisLine: {
						lineStyle: {
							color: "#17b3a3",
						},
					},
				}
				lineOption.legend = {
					data: xMore
				}
				lineOption.tooltip = {
					trigger: 'axis'
				}
				lineOption.series = []
				console.log(lineOption)
				xMore.forEach(key => {
					lineOption.series.push({
						name: key,
						data: orderData.data.map(item => item[key]),
						type: 'line'
					})
				})
				// console.log(lineOption)
				//   使用刚指定的配置项和数据显示图表
				echarts1.setOption(lineOption)

				//柱状图
				const echarts2 = echarts.init(this.$refs.echarts2)
				var barOption = {
					legend: {
						// 图例文字颜色
						textStyle: {
							color: "#333",
						},
					},
					grid: {
						left: "20%",
					},
					// 提示框
					tooltip: {
						trigger: "axis",
					},
					xAxis: {
						type: "category", // 类目轴
						data: userData.map(item => item.date),
						axisLine: {
							lineStyle: {
								color: "#17b3a3",
							},
						},
						axisLabel: {
							interval: 0,
							color: "#333",
						},
					},
					yAxis: [{
						type: "value",
						axisLine: {
							lineStyle: {
								color: "#17b3a3",
							},
						},
					}, ],
					color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
					series: [{
							name: "新增用户",
							data: userData.map(item => item.new),
							type: 'bar'
						},
						{
							name: "活跃用户",
							data: userData.map(item => item.active),
							type: 'bar'
						}
					],
				}

				echarts2.setOption(barOption)


				//饼状图
				const echarts3 = echarts.init(this.$refs.echarts3)

				var pieOption = {
					tooltip: {
						trigger: "item",
					},
					color: [
						"#0f78f4",
						"#dd536b",
						"#9462e5",
						"#a6a6a6",
						"#e1bb22",
						"#39c362",
						"#3ed1cf",
					],
					series: [{
						data: videoData,
						type: 'pie'
					}],
				}
				echarts3.setOption(pieOption)

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