<template>
  <div
    class="course-detail"
    :class="{ 'gray-bg': courseDetail.content && courseDetail.content.length > 0 }"
  >
    <div class="header">
      <span class="course-name" v-if="courseDetail">{{courseDetail.coursename}}</span>
    </div>
    <div class="course-content">
      <Card round v-for="ch in courseDetail.content" :key="ch.id">
        <span class="ch-name">{{ch.stamp}}</span>
        <md-field-item
          v-for="part in ch.part"
          :key="part.id"
          solid
          arrow
          @click="$router.push({ path: `/course/${courseID}/pd?c=${ch.id}&p=${part.id}` })"
        >
          <div slot="default">
            {{part.title}}&nbsp;
            <md-tag
              shape="fillet"
              type="ghost"
              fill-color="rgba(103,194,58,.1)"
              font-color="#67c23a"
              v-show="lastread[0] === ch.id && lastread[1] === part.id"
            >上次看到这</md-tag>
          </div>
        </md-field-item>
      </Card>
    </div>

    <md-result-page v-show="!courseDetail.content || courseDetail.content.length === 0"></md-result-page>
  </div>

  <!-- <el-col
          :span="10"
          class="toolsbar"
          v-if="user.userType === 1 && user.id === courseDetail.tchID"
        >
          <el-button type="primary" size="small" icon="el-icon-edit" @click="addChapter = true">新建章节</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="delCourse">删除课程</el-button>
  </el-col>-->

  <!-- <el-col
                  v-if="user.userType === 1 && user.id === courseDetail.tchID"
                  :span="6"
                  class="control"
                >
                  <el-button
                    type="text"
                    @click="$router.push({ path: `/editCourse?id=${courseID}&c=${ch.id}&p=${part.id}` })"
                  >编辑</el-button>
                  <el-button type="text" @click="delPart(ch.id, part.id)">删除</el-button>
  </el-col>-->

  <!-- <el-row class="ch-control" v-if="user.userType === 1 && user.id === courseDetail.tchID">
              <el-button
                plain
                icon="el-icon-edit"
                size="small"
                @click="$router.push({ path: `/editCourse?id=${courseID}&c=${ch.id}&p=${getMaxPartID(ch.part) + 1}` })"
              >新增单元</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                @click="delChapter(ch.id)"
              >删除章节</el-button>
  </el-row>-->
  <!-- <el-col :span="6">
      <TeacherCard :tch="courseDetail.tch ? courseDetail.tch[0] : {}"/>

      <StudentsCard :stus="courseDetail.stus"/>
  </el-col>-->

  <!-- <el-dialog
      v-if="user.userType === 1 && user.id === courseDetail.tchID"
      title="添加章节"
      :visible.sync="addChapter"
      width="30%"
      :before-close="handleAddChapterClose"
    >
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form
            label-position="top"
            label-width="80px"
            :model="newChapter"
            status-icon
            ref="addChapter"
            :rules="newChapterFormRules"
          >
            <el-form-item label="章节名称：" prop="stamp">
              <el-input v-model="newChapter.stamp"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <span slot="footer">
        <el-button @click="addChapter = false">取 消</el-button>
        <el-button type="primary" @click="addChapterToCourse">确 定</el-button>
      </span>
  </el-dialog>-->
</template>

<script>
import Card from '../../components/Card';
// import TeacherCard from '../../components/TeacherCard';
// import StudentsCard from '../../components/StudentsCard';

export default {
  data() {
    return {
      courseID: '',
      courseDetail: {},
      newChapter: {
        stamp: '',
        part: []
      },
      addChapter: false,
      lastread: []
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
    this.getCourseDetail();
  },
  methods: {
    getMaxPartID(part) {
      let ids = [];
      part.forEach(p => {
        ids.push(p.id);
      });
      if (ids.length === 0) {
        return -1;
      }
      return Math.max(...ids);
    },
    getMaxChapterID() {
      let ids = [];
      this.courseDetail.content.forEach(c => {
        ids.push(c.id);
      });
      if (ids.length === 0) {
        return -1;
      }
      return Math.max(...ids);
    },
    getCourseDetail() {
      this.$http
        .post('/api/getCourseDetail', {
          courseID: this.courseID
        })
        .then(res => {
          if (res.data.code === 1) {
            this.courseDetail = res.data.data;
            const lastread = JSON.parse(
              window.localStorage.getItem(
                `course.${this.courseID}.${this.user.id}.lastread.part`
              )
            );
            if (lastread) {
              this.lastread = lastread;
            }
          }
          if (res.data.code === -1) {
            this.$toast.failed('加载失败');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addChapterToCourse() {
      this.$http
        .post('/api/addChapterToCourse', {
          courseID: this.courseID,
          tchID: this.courseDetail.tchID,
          newChapter: {
            id: this.getMaxChapterID() + 1,
            stamp: this.newChapter.stamp,
            part: this.newChapter.part
          }
        })
        .then(res => {
          if (res.data.code === 1) {
            this.addChapter = false;
            this.$router.push({ path: '/emptyPage' });
          }
          if (res.data.code === 0) {
            this.$toast.failed(res.data.info);
          }
          if (res.data.code === -1) {
            this.$dialog.failed({
              title: '添加失败',
              content: '发生了错误导致章节添加失败',
              confirmText: '确定'
            });
            console.log(res.data.errMsg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delCourse() {
      this.$dialog.confirm({
        title: '提示',
        content: '此操作将删除该课程及其所有内容, 是否继续?',
        confirmText: '确定',
        onConfirm: () => {
          this.$http
            .post('/api/delCourse', {
              courseID: this.courseID,
              tchID: this.courseDetail.tchID
            })
            .then(res => {
              if (res.data.code === 1) {
                this.$router.push({ path: '/emptyPage' });
              }
              if (res.data.code === 0) {
                this.$toast.failed(res.data.info);
              }
              if (res.data.code === -1) {
                this.$dialog.failed({
                  title: '删除失败',
                  content: '发生了错误导致课程删除失败',
                  confirmText: '确定'
                });
                console.log(res.data.errMsg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    delChapter(chapter) {
      this.$dialog.confirm({
        title: '提示',
        content: '此操作将删除该章节, 是否继续?',
        confirmText: '确定',
        onConfirm: () => {
          this.$http
            .post('/api/delChapter', {
              courseID: this.courseID,
              tchID: this.courseDetail.tchID,
              chapter
            })
            .then(res => {
              if (res.data.code === 1) {
                this.$router.push({ path: '/emptyPage' });
              }
              if (res.data.code === 0) {
                this.$toast.failed(res.data.info);
              }
              if (res.data.code === -1) {
                this.$dialog.failed({
                  title: '删除失败',
                  content: '发生了错误导致课程删除失败',
                  confirmText: '确定'
                });
                console.log(res.data.errMsg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    delPart(chapter, part) {
      this.$dialog.confirm({
        title: '提示',
        content: '此操作将删除该单元, 是否继续?',
        confirmText: '确定',
        onConfirm: () => {
          this.$http
            .post('/api/delPart', {
              courseID: this.courseID,
              tchID: this.courseDetail.tchID,
              chapter,
              part
            })
            .then(res => {
              if (res.data.code === 1) {
                this.$router.push({ path: '/emptyPage' });
              }
              if (res.data.code === 0) {
                this.$toast.failed(res.data.info);
              }
              if (res.data.code === -1) {
                this.$dialog.failed({
                  title: '删除失败',
                  content: '发生了错误导致删除失败',
                  confirmText: '确定'
                });
                console.log(res.data.errMsg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    handleAddChapterClose() {
      this.$refs.addChapter.resetFields();
      this.addChapter = false;
    }
  },
  components: {
    Card
    // TeacherCard,
    // StudentsCard
  }
};
</script>

<style lang="scss" scoped>
.header {
  padding: 0 1rem;
  text-align: center;

  .course-name {
    line-height: 4.5rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: #606266;
  }
}

.ch-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #606266;
}
</style>
