<template>
  <div name="qa-view" class="qa-view">
    <div class="cmt">
      <el-row class="cmt__header" type="flex" justify="space-between">
        <el-col :span="5">
          <el-select v-model="selectData.value" placeholder="请选择">
            <el-option
              v-for="item in selectData.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input
            placeholder="请输入搜索内容..."
            v-model="searchData.value"
            prefix-icon="el-icon-search"
          ></el-input>
        </el-col>
      </el-row>
      <div class="cmt-content">
        <el-row>
          <el-col>
            <div class="cmt__content__table">
              <el-table
                :data="singlePageQuestions"
                border
                stripe
                highlight-current-row
                :loading="loading"
              >
                <el-table-column prop="title" label="标题" align="left">
                </el-table-column>
                <!-- <el-table-column prop="specialty" label="专业" align="left">
                </el-table-column> -->
                <el-table-column
                  prop="questionerName"
                  label="姓名"
                  align="left"
                >
                </el-table-column>
                <el-table-column prop="tag" label="问题标签" align="left">
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
                    <el-button size="mini " @click="viewQuestionDetails(scope)"
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
            :page-size="this.offset"
            layout="prev, pager, next, jumper"
            :total="totalItems"
            @current-change="handleCurPageChange"
            background
          >
          </el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
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
      index: 0,
      offset: 8,
      /*Questions Data ENDS*/
      loading: true,
      isLogin: false,
      currentPage: 1
    };
  },

  computed: {
    totalItems() {
      return this.questions.length;
    },
    singlePageQuestions() {
      return (
        this.searchQuestions ||
        this.questions.slice(this.index, this.index + this.offset)
      );
    },
    searchQuestions() {
      return this.questions.filter(question => {
        return new RegExp(this.searchData.value, 'i').test(question.title);
      });
    }
  },
  methods: {
    handleCurPageChange(val) {
      this.index = (val - 1) * this.offset;
    },
    viewQuestionDetails(scope) {
      this.$router.push({ path: `${this.$route.path}/${scope.row.qaID}` });
    },
    loadQuestions() {
      const url = '/api/loadQuestions';
      let data = [];
      this.$http
        .get(url)
        .then(res => {
          if (res.data.code === 1) {
            this.questions = res.data.data;
            for (let i of this.questions) {
              i.created = this.$dayjs(i.created).format('YYYY-MM-DD');
              i['replysLength'] = i.replys.length;
            }
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {});
    }
  },
  created() {
    this.loadQuestions();
  }
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
