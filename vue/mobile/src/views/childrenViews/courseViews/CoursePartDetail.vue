<template>
  <div class="cpd gray-bg">
    <Card round style="margin: 0">
      <div class="header">
        <span class="part-title">{{partTitle}}</span>
        <div class="tool-bar" v-if="user && user.userType === 1">
          <md-button class="edit-btn" type="link">编辑</md-button>
        </div>
      </div>
      <CPContent v-if="content" :content="content"></CPContent>
    </Card>
  </div>
</template>

<script>
import Card from '@/components/Card';
import CPContent from '@/components/CPContent';

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
      this.$http
        .post('startStudy', {
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
      this.$http
        .post('getPartDetailNoAuth', {
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
            this.$dialog.confirm({
              title: '提示',
              content: '加载失败, 是否重新加载?',
              confirmText: '确定',
              onConfirm: () => {
                this.$router.push({ path: '/emptyPage' });
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$dialog.confirm({
            title: '提示',
            content: '加载失败, 是否重新加载?',
            confirmText: '确定',
            onConfirm: () => {
              this.$router.push({ path: '/emptyPage' });
            }
          });
        });
    }
  },
  components: {
    CPContent,
    Card
  }
};
</script>

<style lang="scss" scoped>
.cpd {
  padding: 1rem;
  min-height: calc(100vh - 11.83333rem);

}
.header {
  display: table;
  margin: 0 0 1.5rem;
  width: 100%;
  vertical-align: middle;
  border-bottom: 1px solid #eee;
  overflow: hidden;

  .part-title {
    display: table-cell;
    padding: 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
    word-break:break-all;
  }

  .tool-bar {
    display: table-cell;
    vertical-align: middle;
    text-align: right;
  }
}
</style>
