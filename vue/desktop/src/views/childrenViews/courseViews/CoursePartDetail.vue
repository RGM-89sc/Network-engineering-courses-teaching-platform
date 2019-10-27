<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="part-title">{{ partTitle }}</span>
      </div>
      <CPContent v-if="content" :content="content"></CPContent>
    </el-card>
  </div>
</template>

<script>
import {CoursesProvider} from '@/provider/index';
import {UserProvider} from '@/provider/index';
import CPContent from '@/components/CPContent';
console.log(CoursesProvider);
export default {
  data() {
    return {
      courseID: '',
      chapter: '',
      part: '',
      partTitle: '',
      content: ''
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
    this.chapter = parseInt(this.$route.query.c);
    this.part = parseInt(this.$route.query.p);
    this.getPartDetailNoAuth();
    if (this.user.userType === 0 && !this.isStudiedOrStudying()) {
      this.startStudy();
    }
  },
  beforeRouteLeave(to, from, next) {
    window.localStorage.setItem(
      `course.${this.courseID}.${this.user.id}.lastread.part`,
      `[${this.chapter},${this.part}]`
    );
    next();
  },
  methods: {
    startStudy() {
      UserProvider.student
        .startStudy({
          courseID: this.courseID
        })
        .then(res => {
          if (res.data.code === 1) {
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    isStudiedOrStudying() {
      if (!this.user.study) {
        return false;
      }
      return this.user.study.some(s => {
        return s.courseID === this.courseID;
      });
    },
    getPartDetailNoAuth() {
      CoursesProvider.getPartDetailNoAuth({
        courseID: this.courseID,
        chapter: this.chapter,
        part: this.part
      })
        .then(res => {
          if (res.data.code === 1) {
            this.partTitle = res.data.data.title;
            this.content = res.data.data.content;
          }
          if (res.data.code === -1) {
            console.log(res.data.errMsg);
            this.$confirm('加载失败, 是否重新加载?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.$router.push({path: '/emptyPage'});
              })
              .catch(() => {});
          }
        })
        .catch(err => {
          console.log(err);
          this.$confirm('加载失败, 是否重新加载?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$router.push({path: '/emptyPage'});
            })
            .catch(() => {});
        });
    }
  },
  components: {
    CPContent
  }
};
</script>

<style lang="scss" scoped>
.part-title {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
