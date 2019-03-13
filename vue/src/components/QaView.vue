<template>
    <div name="qa-view" class="qa-view">
      <div class="cmt">
          <div class="cmt-content">
            <div class="cmt-content--table">
              <el-table :data="singlePageComments"
                        border
                        stripe
                        highlight-current-row
                        :loading="loading">
              <el-table-column prop="title"
                               label="标题"
                               align="left">
              </el-table-column>
              <el-table-column prop="specialty"
                               label="专业"
                               align="left">
              </el-table-column>
              <el-table-column prop="name"
                               label="姓名"
                               align="left">
              </el-table-column>
              <el-table-column prop="issueTime"
                               label="提出时间"
                               sortable
                               align="right">

              </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="cmt-index">
            <el-pagination
              :current-page.sync="currentPage"
              :page-size="this.offset"
              layout="prev, pager, next, jumper"
              :total="totalItems"
              @current-change="handleCurPageChange"
              background>
              </el-pagination>
          </div>  
      </div>
      <div class="rich-text">
        <ckeditor :editor="editor" 
                  v-model="editorData" 
                  :config="editorConfig"
                  :disabled="editorDisabled"/>
      </div>
    </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
export default {
    name:'qaview',
    data(){  
      return{
        /*Comments Data STARTS*/
        comments:[
          {title:'1',specialty:'a',name:'a1',issueTime:'2016-05-04'},
          {title:'2',specialty:'b',name:'b2',issueTime:'2016-01-01'},
          {title:'3',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'4',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'5',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'6',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'7',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'8',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'9',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'10',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'11',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'12',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'13',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'14',specialty:'c',name:'c3',issueTime:'2016-07-07'},
          {title:'15',specialty:'c',name:'c3',issueTime:'2016-07-07'}
        ],
        index:0,
        offset:8,
        /*Comments Data ENDS*/
        loading:true,
        /*Editor Data STARTS*/ 
        editor: ClassicEditor,
        editorData: '<p>输入问题内容...</p>',
        editorConfig: {
          language: 'zh-cn'
        },
        editorDisabled:true,
        /*Editor Data ENDS*/
        currentPage : 1
      }
    },
    // created(){
    //   this.$http.get('')
    //     .then((res)=>{
    //       this.comments = res;
    //       this.loading = false;
    //     })
    //     .catch((err)=>{
    //       console.log(error)
    //     });
    // },
    computed:{
      totalItems(){
        return this.comments.length;
      },
      singlePageComments(){
        return this.comments.slice(this.index,this.index+this.offset);
      }
    },
    methods:{
      handleCurPageChange(val){
        this.index = (val-1)*this.offset;
      }
    }

}
</script>

<style lang="scss" scoped>
  .cmt-content{
    min-height: 444px;
  }
  .cmt-index{
    margin-top:5vh;
  }
  // .cmt-content{
  //   height: 30vh;
  // }
  .rich-text{
    margin-top: 5vh;
  }
  .el-pagination{
    width:50%;
    margin: 0 auto;
  }
</style>
