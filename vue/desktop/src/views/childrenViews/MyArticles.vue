<template>
  <div>
    <el-card
      v-for="article in articles"
      :key="article.articleID"
      class="article"
      shadow="always"
    >
      <el-row type="flex">
        <el-col :span="18" class="article-name">
          <h3 type="text"
            @click="
              $router.push({
                path: `/${article.articleType}/article/${article.articleID}?articleType=${article.articleType}`
              })
            "
          >
            {{ article.title }}
          </h3>
          <div class="article-date">
            {{ $dayjs(article.created).format('YYYY-MM-DD') }}
          </div>
        </el-col>
        <el-col :span="6" class="manipulate">
          <el-button type="danger" @click="delArticle(article)">删除</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-row v-if="articles.length === 0" class="article_empty">
      <span v-if="user">
        您还没有发布过文章，去
        <el-button type="text" @click="$router.push({path: '/news'})"
          >&nbsp;发布文章</el-button
        >吧
      </span>
    </el-row>
  </div>
</template>
    
<script>
import {UserProvider} from '@/provider/index';
import {ArticleProvider} from '@/provider/index';
export default {
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      articles: []
    };
  },
  methods: {
    getMyArticles() {
      const type = this.user.userType === 0 ? 'student' : 'teacher';
      UserProvider[type]
        .getMyArticles()
        .then(res => {
          if (res.data.code === 1) {
            this.articles = res.data.data;
          } else {
            this.$message({
              message: '获取信息失败!',
              type: 'fail'
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delArticle(article) {
      this.$confirm('是否确认删除文章?', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ArticleProvider.delArticle({
            articleType: article.articleType,
            articleID: article.articleID,
            authorID: article.authorID
          })
            .then(res => {
              if (res.data.code === 1) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getMyArticles();
              } else if (res.data.code === 0) {
                this.$message.error({
                  message: res.data.info
                });
              } else {
                this.$message.error({
                  message: '删除失败！'
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    }
  },
  created() {
    this.getMyArticles();
  }
};
</script>
    
<style lang="scss" scoped>
.article {
  margin-bottom: 20px;

  .article-name {
    h3 {
      line-height: 40px;
      margin: 0;
      cursor: pointer;
    }
    > .article-date {
      color: #909090;
      font-size: 14px;
      align-self: center;
    }
  }

  .manipulate {
    padding-right: 20px;
    text-align: right;
  }
}
.article_empty {
  padding: 5rem;
  text-align: center;
  color: #909090;

  font-size: 16px;
}
</style>