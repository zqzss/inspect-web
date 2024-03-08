<template>
	<div class="tabs">
		<el-tag v-for="(item,index) in tags" :key="item.path" :closable="item.name!=='home'"
			:effect="$route.name===item.name?'dark':'plain'" @click="changeMenu(item)" @close="handleClose(item,index)"
			size="small">
			{{ item.label }}
		</el-tag>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: "CommonTag",
		data() {
			return {}
		},
		computed: {
			...mapState({
				tags: state => state.tab.tabsList
			})
		},
		methods: {
			...mapMutations(['closeTag']),
			//  点击tag跳转的功能
			changeMenu(item) {
				if (this.$route.path !== item.path && !(this.$route.path === '/home' && (item.path === '/'))) {
					this.$router.push({
						name: item.name
					})
				}
			},
			//点击tag删除的功能
			handleClose(item, index) {
				//调用store中的mutation
				this.closeTag(item)
				const length = this.tags.length;
				//跳转之后的逻辑
				if (item.name !== this.$route.name) {
					return
				}
				//表示删除的是最后一项
				if (index === length) {
					this.$router.push({
						name: this.tags[index - 1].name
					})
				} else {
					this.$router.push({
						name: this.tags[index].name
					})
				}
			}
		}
	}
</script>

<style scoped lang='less'>
	.tabs {
		padding: 20px;

		.el-tag {
			margin-right: 15px;
			cursor: pointer;
		}
	}
</style>