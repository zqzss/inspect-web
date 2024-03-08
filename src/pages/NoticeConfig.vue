<template>
	<div>
		<el-dialog title="通知配置" :visible.sync="dialogVisible" width="70%">
			<el-form :label-position="labelPosition" label-width="180px" :rules="rules" ref="noticeConfigForm"
				:model="noticeConfigForm" :inline="inline">

				<el-form-item label="通知类型" prop="notice_type_name">
					<el-select v-model="noticeConfigForm.notice_type_name" placeholder="请选择">
						<el-option v-for="item in noticeTypeNameOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="通知等级" prop="notice_code">
					<el-select v-model="noticeConfigForm.notice_code" placeholder="请选择通知等级" aria-label="通知等级">
						<el-option v-for="item in noticeCodeOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="收件人邮箱" prop="receiver_email" v-if="noticeConfigForm.notice_type_name == '邮箱'">
					<el-input v-model="noticeConfigForm.receiver_email"></el-input>
				</el-form-item>
				<el-form-item label="webhook地址" prop="webhook" v-if="noticeConfigForm.notice_type_name == '企业微信'">
					<el-input v-model="noticeConfigForm.webhook"></el-input>
				</el-form-item>

			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrEditNoticeConfig('noticeConfigForm')">确
					定</el-button>
			</span>
		</el-dialog>
		<div style="display: flex; justify-content: space-between;">
			<el-button class="el-button-my" type="primary" icon="el-icon-plus" @click="addNoticeConfigClick">新添</el-button>
			<!-- <el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="">
					<el-input v-model="platformName" placeholder="平台名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button class="el-button" type="primary" @click="searchByPlatformName">查询</el-button>
				</el-form-item>
			</el-form> -->
		</div>

		<el-table :data="tableData" style="width: 100%" v-loading="loading">
			<!-- <el-table-column label="日期" width="180">
				<template slot-scope="scope">
					<i class="el-icon-time"></i>
					<span style="margin-left: 10px">{{ scope.row.date }}</span>
				</template>
			</el-table-column> -->
			<el-table-column type="index" label="序号" align="center"></el-table-column>
			<el-table-column prop="notice_type_name" label="通知类型" align="center"></el-table-column>
			<el-table-column prop="receiver_email" label="收件人邮箱" align="center"></el-table-column>
			<el-table-column prop="webhook" label="webhook地址" align="center"></el-table-column>


			<el-table-column label="操作" align="center"> 
				<template slot-scope="scope">
					<el-button size="mini" @click="editNoticeConfigClick(scope.$index, scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="deleteNoticeConfigById(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--分页-->
		<!-- <el-pagination :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :total="total" :current-page="currentPage"
			@current-change="handleCurrentChange" @size-change="handleSizeChange"
			layout="total, sizes, prev, pager, next, jumper" style="margin-top: 20px;padding-bottom: 20px;">
		</el-pagination> -->
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
				loading: true,
				noticeTypeNameOptions: [],
				labelPosition: 'right',
				inline: false,
				noticeCodeOptions: [{
					value: 200,
					label: '可用'
				}, {
					value: 201,
					label: '告警'
				},{
					value: 500,
					label: '不可用'
				}],
				noticeConfigForm: {
					notice_type_name: '',
					receiver_email: '',
					webhook: '',
					notice_code: null
				},
				rules: {
					notice_type_name: [{
						required: true,
						message: '请输入平台名称',
						trigger: 'blur'
					}, ],
					receiver_email: [{
						required: true,
						message: '请输入巡检类型',
						trigger: 'blur'
					}, ],
					webhook: [{
						required: true,
						message: '请输入页面地址',
						trigger: 'blur'
					}, ],
					notice_code: [{
						required: true,
						message: '请输入页面地址',
						trigger: 'blur'
					}, ],
				},

				tableData: []
			}
		},
		mounted() {
			this.getNoticeConfig()
		},
		methods: {
			editNoticeConfigClick(index, row) {
				this.isEdit = 1
				this.getNoticeConfigById(row)
				this.getNoticeTypeNameAll()
				this.dialogVisible = true
				console.log(index, row);
			},
			getNoticeTypeNameAll() {
				requests.get("/getNoticeTypeNameAll").then(response => {
						if (response.data.code == 200) {
							this.noticeTypeNameOptions = []
							for (var name of response.data.data) {
								var option = {
									label: name,
									value: name
								}
								console.log("name: ", name)
								this.noticeTypeNameOptions.push(option)
							}
							console.log("noticeTypeNameOptions: ", this.noticeTypeNameOptions)
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
			deleteNoticeConfigById(row) {
				var data = {
					id: row.id
				}
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					requests.delete("/noticeConfig", {
							data
						}).then(response => {
							if (response.data.code == 200) {
								this.$message({
									message: response.data.message,
									type: 'success',
									showIcon: true
								})
								this.getNoticeConfig()
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
			getNoticeConfigById(row) {
				var data = {
					id: row.id
				}
				requests.get("/getNoticeConfigById", {
						params: data
					}).then(response => {

						if (response.data.code == 200) {
							this.noticeConfigForm = response.data.data

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
			addNoticeConfigClick() {
				this.getNoticeTypeNameAll()
				this.isEdit = 0
				this.dialogVisible = true
				this.noticeConfigForm = {
						notice_type_name: '',
						receiver_email: '',
						webhook: '',
						notice_code: null
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
			getNoticeConfig() {
				// const data = {
				// 	"currentPage": this.currentPage,
				// 	"pageSize": this.pageSize,
				// 	"platformName": this.platformName
				// }
				this.loading = true
				requests.get("/noticeConfig", {
						// params: data
					}).then(response => {
						// console.log("this.tableData",this.tableData)
						if (response.data.code == 200) {
							this.tableData = response.data.data
							// this.tableData = response.data.data.page_list;
							// this.total = response.data.data.total;
							// console.log("this.tableData", this.tableData)
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
			addOrEditNoticeConfig(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						var data = this.noticeConfigForm
						console.log("data", data)
						// 判断是编辑 还是 新添
						// 新添
						if (this.isEdit == 0) {
							requests.post("/noticeConfig", data).then(response => {
								if (response.data.code == 200) {
									this.getNoticeConfig()
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
							requests.put("/noticeConfig", data).then(response => {
								if (response.data.code == 200) {
									this.getNoticeConfig()
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