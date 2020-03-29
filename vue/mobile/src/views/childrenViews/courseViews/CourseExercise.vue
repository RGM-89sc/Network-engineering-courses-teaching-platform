<template>
  <div class="course-exercise__wrapper gray-bg">
    <Card round>
      <div class="header">
        <span class="title">{{coursename}}</span>
        <div class="tool-bar" v-if="user && user.userType === 1">
          <!-- <md-button class="add-exercise-paper" type="link" @click="$router.push({ path: `${courseID}/addExercisePaper` })">新增试卷</md-button> -->
        </div>
      </div>

      <div class="no-exercise-paper" v-if="exercisePapers.length === 0">
        <span>暂无作业</span>
      </div>

      <md-cell-item
        v-for="exercisePaper in exercisePapers"
        :key="exercisePaper.exerciseID"
        :title="exercisePaper.exerciseName"
        arrow
        :brief="'创建时间：' + $dayjs(exercisePaper.created).format('YYYY-MM-DD')"
        @click="$router.push({ path: `/course/${courseID}/exercise/exercisePaper?id=${exercisePaper.exerciseID}` })"
      />
    </Card>

          <!-- <el-col :span="6" style="text-align: right;" v-if="user && user.userType === 1">
            <el-button type="text" @click="$router.push({ path: `/exercise/${courseID}/editExercisePaper?id=${exercisePaper.exerciseID}` })">编辑</el-button>
            <el-button type="text" @click="delExercisePaper(exercisePaper.exerciseID)">删除</el-button>
          </el-col> -->

  </div>
</template>

<script>
import Card from '@/components/Card';

export default {
  data() {
    return {
      courseID: '',
      coursename: '',
      exercisePapers: []
    };
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.courseID = this.$route.params.course_id;
    this.coursename = window.sessionStorage.getItem('exercises.current_coursename');
    this.getExercisePapers();
  },
  methods: {
    getExercisePapers() {
      this.$http
        .post('/api/getExercisePapers', { courseID: this.courseID })
        .then(res => {
          if (res.data.code === 1) {
            this.exercisePapers = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delExercisePaper(exerciseID) {
      this.$confirm('此操作将删除该作业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/api/delExercisePaper', {
              courseID: this.courseID,
              exerciseID
            })
            .then(res => {
              if (res.data.code === 1) {
                this.$router.push({ path: '/emptyPage' });
              }
              if (res.data.code === -1) {
                this.$alert('发生了错误导致删除失败', '删除失败', {
                  confirmButtonText: '确定'
                });
                console.log(res.data.errMsg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {});
    }
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped>
.course-exercise__wrapper {
  padding-top: 16px;
  min-height: calc(100vh - 7.4rem);
}
.header {
  display: table;
  width: 100%;

  .title {
    display: table-cell;
  }

  .tool-bar {
    display: table-cell;
    text-align: right;
  }
}

.no-exercise-paper {
  margin: 5rem 0;
  text-align: center;
  color: #606266;
}
</style>
