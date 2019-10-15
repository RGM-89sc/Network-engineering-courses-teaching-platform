<template>
  <div>
    <span class="selections-title">选项：</span>
    <div
      v-for="selection in practiceSelections"
      :key="selection.id"
      shadow="never"
      class="selection"
    >
      <el-input placeholder="请输入选项内容（必填）" v-model="selection.content" @blur="setPractice">
        <template slot="prepend">{{selection.id}}.</template>
      </el-input>
    </div>
    <el-row class="control">
      <el-button type="primary" @click="addSelection">添加选项</el-button>
      <el-button type="danger" @click="delLastSelection" v-if="practiceSelections.length > 2">删除最后一项</el-button>
    </el-row>
    <el-form label-width="100px">
      <el-form-item label="正确答案：" class="answer-setting">
        <el-select
          v-model="practiceAnswer"
          placeholder="请选择（必填）"
          @change="setPractice"
          v-if="questionType === 'Exclusive'"
        >
          <el-option
            v-for="selection in practiceSelections"
            :key="selection.id"
            :label="selection.id"
            :value="selection.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="practiceAnswers"
          placeholder="请选择（必填）"
          @change="setPractice"
          multiple
          v-if="questionType === 'Multiple'"
        >
          <el-option
            v-for="selection in practiceSelections"
            :key="selection.id"
            :label="selection.id"
            :value="selection.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row class="upload-img">
      <el-upload
        :action="$apiBaseUrl + 'uploadExamQuestionImg'"
        :data="{ courseID: courseid, exerciseID: exerciseid,  questionID: questionid }"
        accept=".jpg, .png"
        :with-credentials="true"
        :before-upload="beforeImgUpload"
        :on-remove="removeImg"
        :on-success="imgUploadScuess"
        :file-list="uploadImgs"
        list-type="picture"
      >
        <el-button type="primary">上传配图</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-row>
  </div>
</template>

<script>
import { ExamsProvider } from '../provider/index'

export default {
  data() {
    return {
      practiceSelections: [{ id: 'A', content: '' }, { id: 'B', content: '' }],
      practiceAnswer: '',
      practiceAnswers: [],
      uploadImgs: []
    };
  },
  watch: {
    questionType(oldValue, newValue) {
      this.setPractice();
    },
  },
  model: {
    prop: 'detail',
    event: 'setPractice'
  },
  props: {
    questionType: {
      type: String,
      default: 'Exclusive'
    },
    detail: {
      type: Object,
      default: {}
    },
    courseid: {
      type: String,
      require: true
    },
    exerciseid: {
      type: String,
      require: true
    },
    questionid: {
      type: Number,
      require: true
    }
  },
  created() {
    this.practiceSelections = this.detail.selections || [{ id: 'A', content: '' }, { id: 'B', content: '' }];
    this.uploadImgs = this.detail.imgs || [];
    if (this.questionType === 'Exclusive' && this.detail.selections) {
      this.detail.selections.some(selection => {
        if (selection.isAnswer) {
          this.practiceAnswer = selection.id;
          return true;
        }
        return false;
      });
    } else if (this.questionType === 'Multiple' && this.detail.selections) {
      let practiceAnswers = [];
      this.detail.selections.forEach(selection => {
        if (selection.isAnswer) {
          practiceAnswers.push(selection.id);
        }
      });
      this.practiceAnswers = practiceAnswers;
    }
  },
  methods: {
    setPractice() {
      if (this.questionType === 'Exclusive') {
        this.practiceSelections = this.practiceSelections.map(selection => {
          if (selection.id === this.practiceAnswer) {
            selection.isAnswer = true;
          } else {
            selection.isAnswer = false;
          }
          return selection;
        });
      }
      if (this.questionType === 'Multiple') {
        this.practiceSelections = this.practiceSelections.map(selection => {
          if (this.practiceAnswers.indexOf(selection.id) >= 0) {
            selection.isAnswer = true;
          } else {
            selection.isAnswer = false;
          }
          return selection;
        });
      }
      this.$emit('setPractice', {
        selections: this.practiceSelections,
        imgs: this.uploadImgs
      });
    },
    beforeImgUpload(file) {
      const isLt500k = file.size < 500 * 1024;
      if (!isLt500k) {
        this.$message.error('上传图片大小不能超过 500KB!');
      }
      return isLt500k;
    },
    removeImg(file, fileList) {
      if (file.status !== 'success') {
        return null;
      }
      // 只要用户点击了删除，进入了这个文件，文件都会消失，但数据还在，所以下面这两行代码是为了更新一下响应，躲过这个“bug”
      this.uploadImgs.push({});
      this.uploadImgs.pop();

      this.$confirm('此操作将删除图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ExamsProvider.delQuestionImg({ filename: file.name })
            .then(res => {
              if (res.code === 1) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.uploadImgs = this.uploadImgs.filter(img => {
                  if (img.name === file.name) {
                    return false;
                  }
                  return true;
                });
                this.setPractice();
              }
              if (res.code === -1) {
                this.$alert('发生了错误导致删除失败', '删除失败', {
                  confirmButtonText: '确定'
                });
                console.log(res.errMsg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {});
    },
    imgUploadScuess(response, file, fileList) {
      if (response.code === 1) {
        this.uploadImgs.push({
          name: response.data.filename,
          url: response.data.url
        });
        this.setPractice();
      }
    },
    delLastSelection() {
      this.practiceAnswer = '';
      this.practiceAnswers = [];
      this.practiceSelections.pop();
      this.setPractice();
    },
    genLetters() {
      let arr = [];
      for (let i = 65; i < 91; i++) {
        arr.push(String.fromCharCode(i));
      }
      return arr;
    },
    addSelection() {
      let ids = this.genLetters();
      this.practiceSelections.push({
        id: ids[this.practiceSelections.length],
        content: ''
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.selections-title {
  display: block;
  margin-bottom: 10px;
}
.selection {
  margin-bottom: 5px;
  padding: 5px 0;
}
.control {
  padding: 10px 0 0;
}
.upload-img {
  padding: 20px 0 0;
}
.answer-setting {
  margin: 25px 0 0;
}
</style>
