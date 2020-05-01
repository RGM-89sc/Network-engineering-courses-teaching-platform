<template>
  <div>
    <Card
      v-for="article in articles"
      :key="article.articleID"
      class="article"
      shadow="always">
      <div type="flex">
        <div class="article-name">
          <h3 
            @click="
              $router.push({
                path: `/${article.articleType}/article/${article.articleID}?articleType=${article.articleType}`
              })">
            {{ article.title }}
          </h3>
        </div>
        <div class="article__footer">
            <div class="article-date">
            {{ $dayjs(article.created).format('YYYY-MM-DD') }}
            </div>
            <div class="manipulate">
            <md-button @click="delArticle(article)" inline size="small" type="primary">删除</md-button>
            </div>
        </div>

      </div>
    </Card>
    <div v-if="articles.length === 0" class="article_empty">
      <span v-if="user">
        您还没有发布过文章，去
        <md-button type="link" @click="$router.push({path: '/news'})" inline
          >&nbsp;发布文章</md-button
        >吧
      </span>
    </div>
  </div>
</template>
    
<script>
import Card from '@/components/Card';
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
      const type = this.user.userType === 0 ? 'stu' : 'tch';
      this.$http.get(`${type}GetMyArticles`)
        .then(res => {
          console.log(res);
          if (res.data.code === 1) {
            this.articles = res.data.data;
          } else {
            this.$toast.failed('获取信息失败!');
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    delArticle(article) {
      this.$dialog.confirm({
        title: '确认删除',
        content: '是否确认删除文章?',
        confirmText: '确定',
        cancelText: '取消',
        onConfirm: () => {
          this.$http.post(`delArticle`, {
            articleType: article.articleType,
            articleID: article.articleID,
            authorID: article.authorID
          })
            .then(res => {
              if (res.data.code === 1) {
                this.$toast.succeed( '删除成功');
                this.getMyArticles();
              } else if (res.data.code === 0) {
                this.$toast.failed(res.data.info);
              } else {
                this.$toast.failed('删除失败！');
              }

            })
            .catch(err => {
              console.log(err);
            });
        },
      })
    }
  },
  created() {
    this.getMyArticles();
  },
  components: {
      Card
  }
};
</script>
    
<style lang="scss" scoped>
.article {
  margin: 1rem;

  .article-name {
    h3 {
      line-height: 1.5;
      font-size: 1rem;
      margin: 0;
      cursor: pointer;
    }
  }
  .article__footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    > .article-date {
        color: #909090;
        font-size: 0.8rem;
        align-self: center;
    }
  .manipulate {
    padding-right: 20px;
    text-align: right;
  }
  }

}
.article_empty {
  padding: 5rem;
  text-align: center;
  color: #909090;

  font-size: 16px;
}
</style>