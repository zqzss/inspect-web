<template>
	<div>
		<el-dialog title="平台巡检项" :visible.sync="dialogVisible" width="70%">
			<el-form :label-position="labelPosition" label-width="210px" :rules="rules" ref="platformInspectItemForm"
				:model="platformInspectItemForm" :inline="inline">
				<el-form-item label="平台名称" prop="platformName">
					<el-select v-model="platformInspectItemForm.platformName" placeholder="请选择">
						<el-option v-for="item in platformNameOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="平台巡检项名称" prop="platform_inspect_inspect_name" >
					<el-input v-model="platformInspectItemForm.platform_inspect_inspect_name"></el-input>
				</el-form-item>
				<el-form-item label="巡检类型" prop="inspectTypeName">
					<el-select v-model="platformInspectItemForm.inspectTypeName" placeholder="请选择">
						<el-option v-for="item in inspectTypeNameOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="页面地址" prop="webUrl" v-if="platformInspectItemForm.inspectTypeName == '页面'">
					<el-input v-model="platformInspectItemForm.webUrl"></el-input>
				</el-form-item>
				<el-form-item label="数据接口" prop="dataItf" v-if="platformInspectItemForm.inspectTypeName == '接口' || platformInspectItemForm.inspectTypeName == '设备在线'">
					<el-input v-model="platformInspectItemForm.dataItf"></el-input>
				</el-form-item>
				<el-form-item label="请求方法" prop="request_method" v-if="platformInspectItemForm.inspectTypeName == '接口' || platformInspectItemForm.inspectTypeName == '设备在线'">
					<el-input v-model="platformInspectItemForm.request_method"></el-input>
				</el-form-item>
				<el-form-item label="设备名称字段" prop="device_name" v-if="platformInspectItemForm.inspectTypeName == '设备在线'">
					<el-input v-model="platformInspectItemForm.device_name"></el-input>
				</el-form-item>
				<el-form-item label="设备在线字段(路径)" prop="device_online_field" v-if="platformInspectItemForm.inspectTypeName == '设备在线'">
					<el-input v-model="platformInspectItemForm.device_online_field"></el-input>
				</el-form-item>
				<el-form-item label="设备在线判定值" prop="device_online_value" v-if="platformInspectItemForm.inspectTypeName == '设备在线'">
					<el-input v-model="platformInspectItemForm.device_online_value"></el-input>
				</el-form-item>
				<el-form-item label="通知忽略设备(数组格式)" prop="ignore_devices" v-if="platformInspectItemForm.inspectTypeName == '设备在线'">
					<el-input v-model="platformInspectItemForm.ignore_devices"></el-input>
				</el-form-item>
				<el-form-item label="通知忽略设备后不在线设备个数" prop="notice_ignore_not_online_num" v-if="platformInspectItemForm.inspectTypeName == '设备在线'">
					<el-input v-model="platformInspectItemForm.notice_ignore_not_online_num"></el-input>
				</el-form-item>
				<el-form-item label="通知间隔时间(单位:分钟)" prop="interval_time" >
					<el-input v-model="platformInspectItemForm.interval_time"></el-input>
				</el-form-item>
				
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrEditPlatformInspectItem('platformInspectItemForm')">确
					定</el-button>
			</span>
		</el-dialog>
		<div style="display: flex; justify-content: space-between;">
			<el-button class="el-button-my" type="primary" icon="el-icon-plus"
				@click="addPlatformInspectItemClick">新添</el-button>
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="">
					<el-input v-model="platformName" placeholder="平台名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button class="el-button-my" type="primary" @click="searchByPlatformName">查询</el-button>
				</el-form-item>
			</el-form>
		</div>

		<el-table :data="tableData" style="width: 100%" v-loading="loading">
			<!-- <el-table-column label="日期" width="180">
				<template slot-scope="scope">
					<i class="el-icon-time"></i>
					<span style="margin-left: 10px">{{ scope.row.date }}</span>
				</template>
			</el-table-column> -->
			<!-- <el-table-column type="index" label="序号" align="center" > 
			</el-table-column> -->
			<el-table-column prop="platformName" label="平台名称" align="center"></el-table-column>
			<el-table-column prop="platform_inspect_inspect_name" label="平台巡检项名称" align="center"></el-table-column>
			<el-table-column prop="inspectTypeName" label="巡检类型" align="center"></el-table-column>
			<el-table-column prop="webUrl" label="页面地址" align="center"></el-table-column>
			<el-table-column prop="dataItf" label="数据接口" align="center"></el-table-column>
			<!-- <el-table-column label="状态" width="180" prop="enabled">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>姓名: {{ scope.row.platform_name }}</p>
						<div slot="reference" class="name-wrapper">
							<el-tag size="medium">{{ scope.row.platform_name }}</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column> -->
			<el-table-column label="状态" align="center">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p v-if="scope.row.enabled == 0 || scope.row.enabled == 2">原因: {{ scope.row.disabled_reason }}</p>

						<div slot="reference" class="name-wrapper">
							<el-tag size="medium" v-if="scope.row.enabled == 0" type="danger">不可用</el-tag>
							<el-tag size="medium" v-if="scope.row.enabled == 1" type="success">可用</el-tag>
							<el-tag size="medium" v-if="scope.row.enabled == 2" type="warning">告警</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="操作"  align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="editPlatformInspectItemClick(scope.$index, scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="deletePlatformInpectItemById(scope.row)">删除</el-button>
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
				isEdit: 0, //是否编辑
				currentPage: 1, // 当前页码
				pageSize: 10, // 每页显示条数
				total: 0, // 总条数
				dialogVisible: false, //是否显示对话框
				platformName: "",
				loading: true,
				dynamicHeaders: {
					headers: [{
						id: 1,
						key: "",
						value: ""
					}],

				},
				platformNameOptions: [],
				inspectTypeNameOptions: [],
				labelPosition: 'right',
				inline: false,
				platformInspectItemForm: {
					platform_inspect_inspect_name: null,
					platformName: '',
					webUrl: '',
					dataItf: '',
					inspectTypeName: "",
					interval_time: 0,
					request_method: "",
					device_name: null,
					device_online_field: null,
					device_online_value: null,
					ignore_devices: null,
					notice_ignore_not_online_num: null
				},
				rules: {
					platformName: [{
						required: true,
						message: '请输入平台名称',
						trigger: 'blur'
					}, ],
					inspectTypeName: [{
						required: true,
						message: '请输入巡检类型',
						trigger: 'blur'
					}, ],
					webUrl: [{
						required: true,
						message: '请输入页面地址',
						trigger: 'blur'
					}, ],
					dataItf: [{
						required: true,
						message: '请输入数据接口',
						trigger: 'blur'
					}, ],
					request_method: [{
						required: true,
						message: '请输入请求方法',
						trigger: 'blur'
					}, ],
					device_online_field: [{
						required: true,
						message: '请输入设备在线字段',
						trigger: 'blur'
					}, ],
					device_online_value: [{
						required: true,
						message: '请输入设备在线判定值',
						trigger: 'blur'
					}, ],
					device_name: [{
						required: true,
						message: '请输入设备在线判定值',
						trigger: 'blur'
					}, ]
				},
				formInline: {
					user: '',
					region: ''
				},
				tableData: []
			}
		},
		mounted() {
			this.getPlatformInspectItem()
		},
		methods: {
			editPlatformInspectItemClick(index, row) {
				this.isEdit = 1
				this.getPlatformInspectItemById(row)
				this.getInspectTypeNames()
				this.getPlatformInfoNamesAll()
				this.dialogVisible = true
				console.log(index, row);
			},
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
			getPlatformInfoNamesAll() {
				requests.get("/getPlatformInfoNamesAll").then(response => {
						if (response.data.code == 200) {
							this.platformNameOptions = []
							for (var name of response.data.data) {
								var option = {
									label: name,
									value: name
								}
								console.log("name: ", name)
								this.platformNameOptions.push(option)
							}
							console.log("platformNameOptions: ", this.platformNameOptions)
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
			deletePlatformInpectItemById(row) {
				var data = {
					id: row.id
				}
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					requests.delete("/platformInspectItem", {
							data
						}).then(response => {
							if (response.data.code == 200) {
								this.$message({
									message: response.data.message,
									type: 'success',
									showIcon: true
								})
								this.getPlatformInspectItem()
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
				}).catch(() => {

				});
			},
			getPlatformInspectItemById(row) {
				var data = {
					id: row.id
				}
				requests.get("/getPlatformInspectItemById", {
						params: data
					}).then(response => {
						console.log("response.data.data", response.data.data)
						this.platformInspectItemForm = response.data.data;

						if (response.data.code == 200) {
							this.platformInspectItemForm = response.data.data

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
			addPlatformInspectItemClick() {
				this.getPlatformInfoNamesAll()
				this.getInspectTypeNames()
				this.isEdit = 0
				this.dialogVisible = true
				this.platformInspectItemForm = {
					platformInspectItemForm: null,
					platformName: '',
					webUrl: '',
					dataItf: '',
					inspectTypeName: "",
					interval_time: 0,
					request_method: "GET",
					device_name: "name",
					device_online_field: "/data/rows/status",
					device_online_value: 1,
					ignore_devices: null,
					notice_ignore_not_online_num: null
				}

			},
			searchByPlatformName() {
				this.currentPage = 1
				this.getPlatformInspectItem()
			},

			handleCurrentChange(newPage) {
				this.currentPage = newPage;
				this.getPlatformInfo();
			},
			handleSizeChange(newSize) {
				this.pageSize = newSize;
				this.currentPage = 1;
				this.getPlatformInfo();
			},
			getPlatformInspectItem() {
				const data = {
					"currentPage": this.currentPage,
					"pageSize": this.pageSize,
					"platformName": this.platformName
				}
				this.loading = true
				requests.get("/platformInspectItem", {
						params: data
					}).then(response => {
						console.log("response.data.data.page_list", response.data.data.page_list)
						this.tableData = response.data.data.page_list;
						this.total = response.data.data.total;
						// console.log("this.tableData",this.tableData)
						if (response.data.code == 200) {
							this.tableData = response.data.data.page_list;
							this.total = response.data.data.total;
							console.log("this.tableData", this.tableData)
						} else {
							this.$message({
								message: response.data.message,
								type: 'error',
								showIcon: true
							})
						}
						this.loading = false
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
						this.loading = false
					})
			},
			addOrEditPlatformInspectItem(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var data = this.platformInspectItemForm
						console.log("data", data)
						// 判断是编辑 还是 新添
						// 新添
						if (this.isEdit == 0) {
							requests.post("/platformInspectItem", data).then(response => {
								if (response.data.code == 200) {
									this.getPlatformInspectItem()
									this.dialogVisible = false
									this.$message({
										message: response.data.message,
										type: 'success',
										showIcon: true
									})
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
								this.loading = false
							})
						} else {
							requests.put("/platformInspectItem", data).then(response => {
								if (response.data.code == 200) {
									this.getPlatformInspectItem()
									this.dialogVisible = false
									this.$message({
										message: response.data.message,
										type: 'success',
										showIcon: true
									})
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
						}

					} else {

					}
				})

			},
		}
	}
</script>

<style scoped>
	.el-button-my {
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		/* margin-top: 4px; */
	}

	.input-row {
		display: flex;
	}

	.input-item {
		width: 150px;
	}
	
</style>