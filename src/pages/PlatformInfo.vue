<template>
	<div>
		<el-dialog title="平台信息" :visible.sync="dialogVisible" width="70%">
			<el-form :label-position="labelPosition" label-width="180px" :rules="rules" ref="platformInfoForm"
				:model="platformInfoForm" inline="inline">
				<el-form-item label="平台名称" prop="platform_name">
					<el-input v-model="platformInfoForm.platform_name"></el-input>
				</el-form-item>
				<el-form-item label="登录地址" prop="login_html">
					<el-input v-model="platformInfoForm.login_html"></el-input>
				</el-form-item>
				<el-form-item label="登录接口" prop="login_itf">
					<el-input v-model="platformInfoForm.login_itf"></el-input>
				</el-form-item>
				<el-form-item label="账号" prop="username">
					<el-input v-model="platformInfoForm.username"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="platformInfoForm.password"></el-input>
				</el-form-item>
				<el-form-item label="认证字段" prop="auth_name">
					<el-input v-model="platformInfoForm.auth_name"></el-input>
				</el-form-item>
				<el-form-item label="token字段名称(路径)" prop="token_name">
					<el-input v-model="platformInfoForm.token_name"></el-input>
				</el-form-item>
				<el-form-item label="通知间隔时间(单位:分钟)" prop="interval_time">
					<el-input v-model="platformInfoForm.interval_time"></el-input>
				</el-form-item>
				<el-form-item label="最大请求重试次数" prop="max_retry_num">
					<el-input v-model="platformInfoForm.max_retry_num"></el-input>
				</el-form-item>
			</el-form>
			<el-form :label-position="labelPosition" label-width="120px" :model="dynamicHeaders" class="demo-dynamic">
				<el-button class="el-button" type="primary" @click="addHeader" icon="el-icon-circle-plus-outline"
					style="margin-top: 5;">新增header字段</el-button>
				<el-form-item v-for="(header,index) in dynamicHeaders.headers" :label="'键'+(index+1)+':' "
					:key="header.id" :prop="'headers.'+index+'.key'" class="headerItems">
					<div class="input-row">
						<el-input class="input-item" v-model="header.key" ></el-input> <el-input class="input-item" v-model="header.value"></el-input>
						<el-button @click="removeHeader(header)" icon="el-icon-circle-close" type="danger" 
							circle></el-button>
					</div>

				</el-form-item>
				<!-- <el-form-item v-for="(val,index) in headers.vals" :label="'值'+index">
					<el-input v-model="headers.val"></el-input>
				</el-form-item> -->

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrEditPlatformInfo('platformInfoForm')">确 定</el-button>
			</span>
		</el-dialog>
		<div style="display: flex; justify-content: space-between;">
			<el-button class="el-button-my" type="primary"  icon="el-icon-plus" @click="addPlatformInfoClick">新添</el-button>
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
			<el-table-column type="index" label="序号" align="center">
			</el-table-column>
			<el-table-column prop="platform_name" label="平台名称" align="center"></el-table-column>
			<el-table-column prop="login_html" label="登录地址" align="center"></el-table-column>
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
						<p v-if="scope.row.enabled == 0">原因: {{ scope.row.disabled_reason }}</p>

						<div slot="reference" class="name-wrapper">
							<el-tag size="medium" v-if="scope.row.enabled == 0" type="danger">不可用</el-tag>
							<el-tag size="medium" v-if="scope.row.enabled == 1" type="success">可用</el-tag>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="editPlatformInfoClick(scope.$index, scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="deletePlatformInfoById(scope.row)">删除</el-button>
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
				labelPosition: 'right',
				inline: true,
				platformInfoForm: {
					platform_name: '',
					login_html: '',
					login_itf: '',
					username: '',
					password: '',
					auth_name: '',
					token_name: '',
					interval_time: null,
					max_retry_num: null
				},
				rules: {
					platform_name: [{
						required: true,
						message: '请输入平台名称',
						trigger: 'blur'
					}, ],
					login_html: [{
						required: true,
						message: '请输入登录地址',
						trigger: 'blur'
					}, ],
					login_itf: [{
						required: true,
						message: '请输入登录接口',
						trigger: 'blur'
					}, ],
					username: [{
						required: true,
						message: '请输入账号',
						trigger: 'blur'
					}, ],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, ],
					auth_name: [{
						required: true,
						message: '请输入认证字段名',
						trigger: 'blur'
					}, ],
					token_name: [{
						required: true,
						message: '请输入token字段名',
						trigger: 'blur'
					}, ],
				},
				formInline: {
					user: '',
					region: ''
				},
				tableData: []
			}
		},
		mounted() {
			this.getPlatformInfo()
		},
		methods: {
			async editPlatformInfoClick(index, row) {
				this.isEdit = 1,
					await this.getPlatformInfoById(row)
				this.dialogVisible = true
				console.log(index, row);
			},
			deletePlatformInfoById(row) {
				var data = {
					id: row.id
				}
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					requests.delete("/platform_info", {
							data
						}).then(response => {
							if (response.data.code == 200) {
								this.$message({
									message: response.data.message,
									type: 'success',
									showIcon: true
								})
								this.getPlatformInfo()
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
			getPlatformInfoById(row) {
				var data = {
					id: row.id
				}
				requests.get("/getPlatfromById", {
						params: data
					}).then(response => {
						console.log("response.data.data", response.data.data)
						this.platformInfoForm = response.data.data;

						if (response.data.code == 200) {
							console.log("response.data.code", response.data.code)
							this.platformInfoForm = response.data.data
							console.log("response.data.data.headers", response.data.data.headers)
							console.log("json response.data.data.headers", JSON.parse(response.data.data.headers
								.replace(/'/g, '"')))
							var index = 1
							var headers = JSON.parse(response.data.data.headers.replace(/'/g, '"'))
							console.log("headers: ", headers)
							console.log("type headers ", typeof(headers))
							this.dynamicHeaders.headers.splice(0)
							for (var key in headers) {
								var header = {}
								console.log("key: ", key)
								console.log("value: ", headers[key])
								header["id"] = index
								header["key"] = key
								header["value"] = headers[key]
								this.dynamicHeaders.headers.push(header)
								index = index + 1
							}
							console.log("this.dynamicHeaders.headers", this.dynamicHeaders.headers)
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
			handleDelete(index, row) {
				console.log(index, row);
			},
			addPlatformInfoClick() {
				this.isEdit = 0
				this.dialogVisible = true
				this.platformInfoForm = {
					platform_name: '',
					login_html: '',
					login_itf: '',
					username: '',
					password: '',
					auth_name: 'Authorization',
					token_name: 'token',
					interval_time: null,
					max_retry_num: null
				}
				this.dynamicHeaders = {
					headers: [{
						id: 1,
						key: "",
						value: ""
					}],

				}
			},
			searchByPlatformName() {
				this.currentPage = 1
				this.getPlatformInfo()
			},
			addHeader() {
				var id = this.dynamicHeaders.headers.length + 1;
				this.dynamicHeaders.headers.push({
					key: "",
					value: "",
					id: id
				});

			},
			removeHeader(header) {
				var index = this.dynamicHeaders.headers.indexOf(header)
				if (index !== -1) {
					this.dynamicHeaders.headers.splice(index, 1)
				}
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
			getPlatformInfo() {
				const data = {
					"currentPage": this.currentPage,
					"pageSize": this.pageSize,
					"platformName": this.platformName
				}
				this.loading = true
				requests.get("/platform_info", {
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
			addOrEditPlatformInfo(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var data = this.platformInfoForm
						var headers = {}
						console.log("dynamicHeaders.headers", this.dynamicHeaders.headers)
						for (var index in this.dynamicHeaders.headers) {
							var header = this.dynamicHeaders.headers[index]
							console.log("header", header)
							headers[header.key] = header.value
						}
						console.log("headers", headers)
						data['headers'] = headers
						console.log("data", data)
						// 判断是编辑 还是 新添
						// 新添
						if (this.isEdit == 0) {
							requests.post("/platform_info", data).then(response => {
								if (response.data.code == 200) {
									this.getPlatformInfo()
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
							requests.put("/platform_info", data).then(response => {
								if (response.data.code == 200) {
									this.getPlatformInfo()
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
		width: 36%;
		margin-right: 15px;
	}
	.headerItems {
		margin-top: 20px;
	}
</style>