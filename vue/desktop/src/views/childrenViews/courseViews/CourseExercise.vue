<template>
  <div>
    <el-row class="header">
      <el-col :span="12">
        <span class="course-name">{{ coursename }}</span>
      </el-col>
      <el-col class="toolsbar" v-if="user && user.userType === 1 && user.id === tchID">
        <el-button
          type="primary"
          @click="$router.push({path: `${$route.path}/addExercisePaper`})"
          >新增试卷</el-button
        >
      </el-col>
    </el-row>
    <el-row v-if="exercisePapers.length === 0" class="no-exercise-paper">
      <span>暂无作业</span>
    </el-row>
    <el-row>
      <el-card
        v-for="exercisePaper in exercisePapers"
        :key="exercisePaper.exerciseID"
        class="exercise-paper"
      >
        <el-row>
          <el-col :span="18">
            <span
              class="exercise-name"
              @click="
                $router.push({
                  path: `${$route.path}/exercisePaper?id=${exercisePaper.exerciseID}`
                })
              "
              >{{ exercisePaper.exerciseName }}</span
            >
          </el-col>
          <el-col
            :span="6"
            style="text-align: right;"
            v-if="user && user.userType === 1 && user.id === tchID"
          >
            <el-button
              type="text"
              @click="
                $router.push({
                  path: `${$route.path}/editExercisePaper?id=${exercisePaper.exerciseID}`
                })
              "
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="delExercisePaper(exercisePaper.exerciseID)"
              >删除</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <span class="created-time"
              >创建时间：{{
                $dayjs(exercisePaper.created).format('YYYY-MM-DD')
              }}</span
            >
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { ExercisesProvider } from '@/provider/index';
import { CoursesProvider } from '@/provider';
export default {
  data() {
    return {
      courseID: '',
      coursename: '',
      exercisePapers: [],
      tchID: ''
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
    this.coursename = window.sessionStorage.getItem(
      'exercises.current_coursename'
    );
    this.getTchID();
    this.getExercisePapers();
  },
  methods: {
    getTchID() {
      CoursesProvider.getCourseDetail({
        courseID: this.courseID
      })
        .then(res => {
          if (res.data.code === 1) {
            this.tchID = res.data.data.tchID;
          }
          if (res.data.code === -1) {
            console.log('获取课程对应的教师ID失败');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getExercisePapers() {
      ExercisesProvider.getExercisePapers({courseID: this.courseID})
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
          ExercisesProvider.delExercisePaper({
            courseID: this.courseID,
            exerciseID
          })
            .then(res => {
              if (res.data.code === 1) {
                this.$router.push({path: '/emptyPage'});
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
  }
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 20px;

  .course-name {
    font-size: 1.2rem;
    line-height: 40px;
  }

  .toolsbar {
    text-align: right;
  }
}

.no-exercise-paper {
  padding: 5rem;
  text-align: center;
  color: #909090;
}

.exercise-paper {
  margin-bottom: 20px;

  .exercise-name {
    line-height: 40px;
    cursor: pointer;
  }
  .created-time {
    display: block;
    padding-bottom: 10px;
    font-size: 0.8rem;
    color: #777;
  }
}
</style>
