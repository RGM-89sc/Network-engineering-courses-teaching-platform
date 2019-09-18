<template>
  <div class="news-detail">
    <article class="news-article">
      <h1 class="article__title">{{ article.title }}</h1>
      <el-row type="flex" class="article__meta normal-font_sub" :gutter="1">
        <el-link class="article__author-avatar" :underline="false">
          <img :src="article.avatarURL" :alt="article.authorName" />
        </el-link>

        <div class="article__author-name-time">
          <el-link type="primary">{{ article.authorName }}</el-link>

          <div class="article__meta-detail">
            <div class="article__created item_padding">
              {{ formatDate(article.created, $dayjs(Date.now())) }}
            </div>
            <span class="item_padding"
              >{{ article.views }}次浏览&nbsp;&nbsp;&nbsp;·</span
            >
            <span
              class="article__good-btn item_padding"
              @click="goodClickHandler"
            >
              {{ article.goods }}次点赞
            </span>
          </div>
        </div>
      </el-row>
      <div class="article__content" v-html="article.content"></div>
    </article>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {},
      isGood: false
    };
  },
  methods: {
    formatDate(date, now) {
      const created = this.$dayjs(date);
      const sss = now.diff(created);
      const minute = Math.floor(sss / 1000 / 60);
      const hour = Math.floor(minute / 60);
      const day = Math.floor(hour / 24);
      return minute > 59
        ? hour > 23
          ? day > 29
            ? created.format('YYYY-MM-DD')
            : `${day}天前`
          : `${hour}小时前`
        : `${minute}分钟前`;
    },
    getArticle() {
      const url = '';
      this.$http
        .post(`/api/getArticle`, {
          articleID: this.$route.params.article_id
        })
        .then(res => {
          if (res.data.code === 1) {
            this.article = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    incInfo(infoType, count = 1) {
      this.$http
        .post('/api/updateArticleInfo', {
          articleID: this.$route.params.news_id,
          infoType
        })
        .then(() => {})
        .catch(err => {
          console.log(err);
        });
    },
    goodClickHandler() {
      !this.isGood
        ? ++this.article.goods && this.incInfo('goods')
        : --this.article.goods && this.incInfo('goods', -1);
      this.isGood = !this.isGood;
    }
  },
  computed: {},
  created() {
    this.getNewsArticle();
  },
  mounted() {
    this.incInfo('views');
  }
};
</script>

<style lang="scss" scoped>
.item_padding {
  padding-right: 15px;
}
.normal-font_sub {
  font-size: 14px;
  color: #999;
}
.news-article {
  > .article__title {
    font-size: 36px;
  }
}
.article__author-avatar {
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  padding-right: 10px;
}
.article__meta-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.article__good-btn:hover {
  cursor: pointer;
}
.article__content {
  margin-top: 50px;
}
</style>