<template>
  <div class="news-list__wrapper">
    <el-card class="news-list">
      <div class="news-item" v-for="(article, index) in newsList" :key="index">
        <article class="news-article">
          <div class="news-article__title">
            <h3>
              <el-link
                @click="
                  $router.push({ path: `/news/article/${article.articleID}` })
                "
                >{{ article.title }}</el-link
              >
            </h3>
          </div>

          <p class="news-article__content">{{ article.summary }}</p>
          <el-row
            type="flex"
            class="news-article__info normal-info-font normal-margin__tb"
            justify="space-between"
          >
            <div class="news-article-author">
              <el-link href="">{{ article.authorName }} </el-link>
            </div>
            <div class="news-article-vg">
              <span> 浏览：{{ article.views }} </span>
              <span>
                点赞：{{ article.goods }}
                <span></span>
              </span>
            </div>
          </el-row>
          <el-row
            type="flex"
            justify="space-between"
            class="news-article__meta"
          >
            <div class="news-article__tags">
              <el-tag
                size="small"
                v-for="(tag, index) in article.tags"
                :key="index"
                >{{ tag }}</el-tag
              >
            </div>
            <div class="news-article__date">
              {{ article.created }}
            </div>
          </el-row>
        </article>
      </div>
      <div v-if="newsList.length === 0" class="article_empty">
        暂时还没有任何文章！
      </div>
    </el-card>
    <div class="post-news">
      <el-button
        class="post-news-btn"
        type="primary"
        @click="
          $router.push({ path: `/news/addArticle?articleID=${articleID}` })
        "
        >发布文章</el-button
      >
    </div>
  </div>
</template>

<script>
import uuid from 'uuid/v4';
export default {
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      newsList: [],
      //要发布的文章ID
      articleID: '',
      dayjsNowTime: {}
    };
  },
  created() {
    this.articleID = uuid()
      .split('-')
      .join('');
    console.log(this.articleID);
    this.getAllNewsArticle();
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
    getAllNewsArticle() {
      const url = '/api/getAllNewsArticle';
      this.$http
        .get(url)
        .then(res => {
          if (res.data.code === 1) {
            this.newsList = res.data.data;
          }
          const dayjsNowTime = this.$dayjs(Date.now());
          for (const item of this.newsList) {
            item.created = this.formatDate(item.created, dayjsNowTime);
          }
        })
        .catch(err => {
          console.log(err);
          console.log('获取新闻列表出错！');
        });
    }
  }
};
</script>

<style lang="scss">
.normal-margin__tb {
  margin: 15px 0;
  font-size: 14px;
}
.normal-info-font {
  color: #999;
}
.news-list__wrapper {
  display: flex;
}
.news-article {
  padding: 25px;
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;
}
.news-list {
  min-width: 720px;
  > .el-card__body {
    padding: 0;
  }
}
.news-article:hover {
  background-color: #f9fafb;
}
.article-text {
}
.news-article__title {
  h3 {
    margin: 0;
  }
}
.news-article__content {
  line-height: 24px;
  height: 48px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #909399;
  font-size: 14px;
}
.news-article__tags {
  span {
    margin-right: 10px;
    height: 24px;
    line-height: 24px;
  }
}
.news-article__date {
  color: #909399;
  font-size: 12px;
  line-height: 24px;
}
.post-news {
  position: sticky;
  margin-left: 5%;
}
.post-news-btn {
  margin-left: 5%;
}
.article_empty {
  padding: 5rem;
  text-align: center;
  color: #909090;
}
</style>