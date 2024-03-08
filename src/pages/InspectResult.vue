<template>
	<div>
		<div style="background-color: white;border: rgb(230, 235, 245) solid;box-shadow:rgba(0, 0, 0, 0.1)">
			<div class="select_div">
				<el-form ref="formData" :model="formData">
					<el-row align="center">
						<el-col :span="5">
							<el-form-item label="平台" prop="platformName">
								<el-input v-model="formData.platformName" placeholder="请输入平台名称" style="width: 180px;"
									clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="日期范围">
								<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formData.dateRange"
									type="daterange" start-placeholder="开始日期" range-separator="一" end-placeholder="结束日期"
									:picker-options="pickerOptions"></el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="时间范围">
								<!-- <el-time-select placeholder="起始时间"  v-model="formData.startTime" :picker-options="{
		                  start: '00:00',
		                  step: '00:15',
		                  end: '23:59'
		                }">
		            </el-time-select>
		            <el-time-select placeholder="结束时间" v-model="formData.endTime" :picker-options="{
		                  start: '00:00',
		                  step: '00:15',
		                  end: '23:59',
		                  minTime: startTime
		                }">
		            </el-time-select> -->
								<el-time-picker is-range v-model="formData.timeRange" range-separator="一"
									start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss"
									placeholder="选择时间范围">
								</el-time-picker>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col>
							<el-select v-model="formData.status" placeholder="请选择状态" aria-label="状态">
								<el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
							<el-select v-model="formData.inspectTypeName" placeholder="请选择巡检类型"
								style="margin-left: 30px;">
								<el-option v-for="item in inspectTypeNameOptions" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</el-col>

					</el-row>
					<el-row>
						<el-col>
							<el-form-item style="text-align: right;">
								<el-button type="primary" @click="clickQuery"
									style="color: #fff;background-color: #409eff;border-color: #409eff;margin-bottom:0px;">查询</el-button>
								<el-button @click="resetForm">重置</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</div>
		<el-table :data="tableData" style="width: 100%" v-loading="loading">
			<el-table-column label="巡检时间" align="center">
				<template slot-scope="scope">
					<!-- <i class="el-icon-time"></i> -->
					<span style="margin-left: 10px">{{ scope.row.inspect_time }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column type="index" label="序号" width="200px"> -->
			</el-table-column>
			<el-table-column prop="platformName" label="平台名称" align="center"></el-table-column>
			<el-table-column prop="inspectTypeName" label="巡检类型" align="center"></el-table-column>
			<el-table-column prop="webUrl" label="页面地址" align="center"></el-table-column>
			<el-table-column prop="dataItf" label="数据接口" align="center"></el-table-column>
			<!-- <el-table-column label="状态" align="center" prop="enabled">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>姓名: {{ scope.row.platform_name }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{ scope.row.platform_name }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column> -->
			<el-table-column label="状态"  align="center">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p v-if="scope.row.response_code == 500 || scope.row.response_code == 201">原因:
							{{ scope.row.response_message }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium" v-if="scope.row.response_code == 200" type="success">可用</el-tag>
							<el-tag size="medium" v-if="scope.row.response_code == 201" type="warning">告警</el-tag>
							<el-tag size="medium" v-if="scope.row.response_code == 500" type="danger">不可用</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>

		</el-table>
		<!--分页-->
		<el-pagination :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :total="total" :current-page="currentPage"
			@current-change="handleCurrentChange" @size-change="handleSizeChange"
			layout="total, sizes, prev, pager, next, jumper" style="margin-top: 20px;padding-bottom: 20px;">
		</el-pagination>
	</div>
</template>

<script>
	import requests from "@/requests"
	export default {
		data() {
			return {
				status: null,
				currentPage: 1, // 当前页码
				pageSize: 10, // 每页显示条数
				total: 0, // 总条数
				loading: false,
				inspectTypeNameOptions: [],
				statusOptions: [{
					value: 200,
					label: '可用'
				}, {
					value: 201,
					label: '告警'
				}, {
					value: 500,
					label: '不可用'
				}],
				tableData: [{
					inspect_time: null,
					platformName: null,
					webUrl: null,
					dataItf: null,
					response_code: null,
					response_message: null,
					inspectTypeName: null
				}],
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				dateRange: '',
				formData: {
					platformName: '',
					timeRange: '',

					dateRange: '',
					status: null
				},
			}
		},
		mounted() {
			this.getInspectResultByMulQuery()
			this.getInspectTypeNames()
		},
		methods: {
			getInspectTypeNames() {
				requests.get("/getInspectTypeNames").then(response => {
						if (response.data.code == 200) {
							this.inspectTypeNameOptions = []
							for (var name of response.data.data) {
								var option = {
									label: name,
									value: name
								}
								console.log("name: ", name)
								this.inspectTypeNameOptions.push(option)
							}
							console.log("inspectTypeNameOptions: ", this.inspectTypeNameOptions)
						} else {
							this.$message({
								message: response.data.message,
								type: 'error',
								showIcon: true
							})
						}

					})
					.catch(error => {
						if (error.response) {
							this.$message({
								message: error.response.data.message,
								type: 'error',
								showIcon: true
							});
						}
						if (error.message == 'Network Error') {
							this.$message({
								message: "无法连接服务器！",
								type: 'error',
								showIcon: true
							});
						}
					})
			},
			handleCurrentChange(newPage) {
				this.currentPage = newPage;
				this.getInspectResultByMulQuery()
			},
			handleSizeChange(newSize) {
				this.pageSize = newSize;
				this.currentPage = 1;
				this.getInspectResultByMulQuery()
			},
			clickQuery() {
				console.log(this.formData)
				this.getInspectResultByMulQuery()
			},
			resetForm() {
				this.formData = {
					platformName: '',
					timeRange: '',
					startTime: '',
					endTime: '',
					dateRange: '',
					status: null
				}
			},
			getInspectResultByMulQuery() {
				this.loading = true
				var data = {
					params: {
						formData: this.formData,
						currentPage: this.currentPage,
						pageSize: this.pageSize
					}
				}
				requests.get("/getInspectResultByMulQuery", data).then(response => {
					if (response.data.code == 200) {
						this.tableData = response.data.data.page_list
						this.total = response.data.data.total
					} else {
						this.$message({
							message: response.data.message,
							type: 'error',
							showIcon: true
						})
					}
				}).catch(error => {
					if (error.response) {
						this.$message({
							message: error.response.data.message,
							type: 'error',
							showIcon: true
						});
					}
					if (error.message == 'Network Error') {
						this.$message({
							message: "无法连接服务器！",
							type: 'error',
							showIcon: true
						});
					}
				})
				this.loading = false
			}
		}
	}
</script>

<style scoped lang="less">
	.el-form {
		padding: 0 10px;
	}

	// .el-date-editor {
	//   width: 100% !important;
	// }
	.table {
		width: 100% !important;
	}

	.my-date-picker {
		/* 重新定义样式，确保不受其他 CSS 样式影响 */

	}

	.my-button {
		/* 只作用于当前组件的样式 */

	}

	.select_div {
		padding-bottom: 0px;
		padding-top: 20px;
		padding-left: 16px;
		padding-right: 16px;
		padding-bottom: 0px;
		margin-bottom: 0px;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>