<template>
  <div>
    <Card class="course-detail" round>
      <div class="header">
        <md-icon 
            class="return-button"
            name="arrow-left" 
            size="sm"
            color="#409eff"
            @click="
              $emit('changeCourseComponent', {
                from: 'myCourseDetail',
                to: 'myCourses'
              })
          "></md-icon>
        <span>统计信息 - {{courseName}}</span>
      </div>

      <div class="no-exam" v-if="courseExams.length === 0">
        <span>暂无数据</span>
      </div>

      <div class="exam" v-for="(exam, index) in courseExams" :key="index">
        <md-detail-item title="试卷" :content="exam.examName"/>
        <md-detail-item title="成绩" :content="exam.examScore"/>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from './Card';

export default {
  data() {
    return {
      loadingData: true,
      courseName: '',
      courseExams: []
    };
  },
  props: {
    user: {
      type: Object,
      default: {}
    },
    courseID: {
      type: String,
      default: ''
    }
  },
  created() {
    this.getMyCourseExams();
  },
  methods: {
    getMyCourseExams() {
      this.$http
        .post('getMyCourseExams', { courseID: this.courseID })
        .then(res => {
          if (res.data.code === 1) {
            this.courseName = res.data.data.course.coursename;
            res.data.data.exams.forEach(exam => {
              let score = '-';
              res.data.data.stu.exams.some(e => {
                if (e.examID === exam.examID) {
                  score = e.examScore;
                  return true;
                }
                return false;
              });
              this.courseExams.push({
                examName: exam.examName,
                examScore: score
              });
            });
            this.loadingData = false;
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
            this.$toast.failed('加载失败');
          }
        })
        .catch(err => {
          console.log(err);
          this.$toast.failed('加载失败');
        });
    }
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped>
.course-detail {
  margin-top: 1rem;
}

.header {
  margin-bottom: 20px;
}

.no-exam {
  padding: 3rem;
  text-align: center;
  color: #606266;
}

.exam {
  border-bottom: 1px solid #eee;
}
.return-button {
  margin-right: 0.5rem;
}
</style>
