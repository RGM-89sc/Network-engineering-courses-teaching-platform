<template>
	<div name="qa-view" class="qa-view">
		<div class="cmt">
			<el-row class="cmt__header" type="flex" justify="space-between">
				<el-col :span="5">
					<!-- <el-select v-model="selectData.value" placeholder="请选择">
						<el-option
							v-for="item in selectData.options"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						></el-option>
					</el-select> -->
					<el-input
						placeholder="请输入搜索内容..."
						v-model="searchData.value"
						prefix-icon="el-icon-search"
					></el-input>
				</el-col>
				<el-col :span="2" >
					<el-button type="primary" @click="addQuestion">
						提问题
					</el-button>
				</el-col>
			</el-row>
			<div class="cmt-content">
				<el-row>
					<el-col>
						<div class="cmt__content__table">
							<el-table
								:data="currentPageQuestions"
								stripe
								highlight-current-row
								:loading="loading"
							>
								<el-table-column
									prop="title"
									label="标题"
									align="left"
								>
								</el-table-column>
								<el-table-column
									prop="questionerName"
									label="姓名"
									align="left"
								>
								</el-table-column>
								<el-table-column
									prop="tags"
									label="问题标签"
									align="left"
								>
								</el-table-column>
								<el-table-column
									prop="created"
									label="提出时间"
									sortable
									align="left"
								>
								</el-table-column>
								<el-table-column
									prop="replysLength"
									label="回答数"
									sortable
									align="left"
								></el-table-column>
								<el-table-column label="" align="center">
									<template slot-scope="scope">
										<el-button
											size="mini "
											@click="viewQuestionDetails(scope)"
											>查看</el-button
										>
									</template>
								</el-table-column>
							</el-table>
						</div></el-col
					>
				</el-row>
			</div>

			<el-row class="cmt-index">
				<el-col>
					<el-pagination
						:current-page.sync="currentPage"
						:page-size="pageSize"
						layout="prev, pager, next, jumper"
						:total="totalSize"
						@current-change="handlePageChange"
						background
					>
					</el-pagination>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
import { QaProvider } from '../../provider'

export default {
	name: 'qaview',
	props: {
		user: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			selectData: {
				options: [],
				value: ''
			},
			searchData: {
				value: ''
			},
			/*Questions Data STARTS*/
			questions: [],
			pageIndex: 0,
			pageSize: 8,
			/*Questions Data ENDS*/
			loading: true,
			currentPage: 1,
		};
	},

	computed: {
		totalSize() {
			return this.questions.length;
		},
		isLogin() {
			return this.user.id;
		},
		currentPageQuestions() {
			return (
				this.searchQuestions ||
				this.questions.slice(this.pageIndex, this.pageIndex + this.pageSize)
			);
		},
		searchQuestions() {
			
			return this.searchData.value && this.questions.filter(question => {
				return new RegExp(this.searchData.value, 'i').test(
					question.title
				);
			});
		}
	},
	methods: {
		handlePageChange(val) {
			this.pageIndex = (val - 1) * this.pageSize;
		},
		viewQuestionDetails(scope) {
			this.$router.push({
				path: `${this.$route.path}/question/${scope.row.qaID}`
			});
		},
		getSize() {
			QaProvider.getSize()
				.then(res => {
					if(res.data.code === 1) {
						this.totalSize = res.data.data;
					}
				})
				.catch(err => {
					console.error('获取问题总数失败！', err);
				})
		},
		getQaQuestions() {
			QaProvider.getQaQuestions().then(res => {
				if (res.data.code === 1) {
					this.questions = [...this.questions,...res.data.data];
					for (let i of this.questions) {
						i.created = this.$dayjs(i.created).format('YYYY-MM-DD');
						i['replysLength'] = i.replys.length;
					}
				}
			})
			.catch(err => {
				console.log(err);
			})
		},
		addQuestion() {
			this.$router.push({
				path: `${this.$route.path}/addQuestion`
			});
		},
	},
	created() {
		// this.getSize();
		this.getQaQuestions();
	},
};
</script>

<style lang="scss" scoped>
.cmt {
	display: flex;
	flex-direction: column;
}
.cmt__header {
	padding-bottom: 20px;
}
.cmt-index {
	margin-top: 50px;
}
.cmt__content__table {
	min-height: 490px;
}
.el-pagination {
	margin-left: -10px;
}
</style>
