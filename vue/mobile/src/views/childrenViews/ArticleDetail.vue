<template>
  <div class="article-detail">
    <article class="article-main">
      <h1 class="article__title">{{ article.title }}</h1>
      <div class="article__meta sub-font_sub" >
        <p class="article__author-avatar">
          <img :src="article.avatarURL" :alt="article.authorName" />
        </p>

        <div class="article__author-name-time">
          <p>{{ article.authorName }}</p>

          <div class="article__meta-detail">
            <div class="article__created item_padding">
              {{ formatDate(article.created, dayjsNowTime) }}
            </div>
            <span class="item_padding"
              >{{ article.views }}次浏览&nbsp;&nbsp;&nbsp;·</span
            >
            <span
              class="article__good-btn item_padding"
              @click="likeArticleHandler"
            >
              {{ article.goods }}次点赞
            </span>
          </div>
        </div>
      </div>
      <div class="article__content" v-html="article.content"></div>
    </article>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {},
      articleType: 'news',
      isGood: false,
      replyContent: '',
      currentReply: '',
      dayjsNowTime: {}
    };
  },
  methods: {
    formatDate(date, now) {
      const created = this.$dayjs(date);
      const sss = now.diff(created);
      const minute = Math.ceil(sss / 1000 / 60);
      const hour = Math.ceil(minute / 60);
      const day = Math.ceil(hour / 24);
      return minute > 59
        ? hour > 23
          ? day > 29
            ? created.format('YYYY-MM-DD')
            : `${day}天前`
          : `${hour}小时前`
        : `${minute}分钟前`;
    },
    getArticle() {
     const url = '/api/getArticle';
     this.$http.post(url,{
        articleID: this.$route.params.article_id,
        articleType: this.articleType
      })
        .then(res => {
          if (res.data.code === 1) {
            this.article = res.data.data;
            // this.comments = this.article.comments;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    incInfo(infoType, count = 1) {
      ArticleProvider.updateArticleInfo({
        articleID: this.$route.params.news_id,
        infoType
      })
        .then(() => {})
        .catch(err => {
          console.error(err);
        });
    },
    likeArticleHandler() {
      !this.isGood
        ? ++this.article.goods && this.incInfo('goods')
        : --this.article.goods && this.incInfo('goods', -1);
      this.isGood = !this.isGood;
    },
    handler(e) {
      const index = e.currentTarget.dataset.index;
      if (this.currentReply === index) {
        return;
      }
      this.replyContent = '';
      this.currentReply = index;
    },
    updateComments() {
      ArticleProvider.updateArticle({
        type: 'comment',
        articleID: this.$route.params.article_id
      }).then(res => {
        if (res.data.code === 1) {
          this.$message({});
        }
      });
    },
    updateReplys() {},
    starClickHandler() {}
  },
  computed: {},
  created() {
    this.articleType = this.$route.query.articleType;
    this.getArticle();
    this.dayjsNowTime = this.$dayjs(Date.now());
  },
  mounted() {
    this.incInfo('views');
  }
};
</script>

<style lang="scss" scoped>
.article-detail {
  padding: 1rem;
}
.icon-left {
  margin-right: 2px;
}
.display-info_sub {
  font-size: 14px;
  color: #909399 !important;
}
.display-info_normal {
  font-size: 16px;
  color: #000 !important;
}
.comment__item_wrapper {
  border-bottom: 1px solid #eee;
}
.item_padding {
  padding-right: 0.5rem;
}
.sub-font_sub {
  font-size: 14px;
  color: #999;
}
.article-main {
  > .article__title {
    font-size: 1.8rem;
  }
}
.article__author-avatar {
  img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
  padding-right: 10px;
}
.article__author-name-time {
  > p {
    color: #409eff;
  }
  
}
.article__title {
  padding-bottom: 0.5rem;
  border-bottom:  1px solid #dcdfe6;
}
.article__meta {
  display: flex;

}
.article__meta-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.article__content {
  margin-top: 2rem;
  padding-top: 0.5rem;
}
</style>