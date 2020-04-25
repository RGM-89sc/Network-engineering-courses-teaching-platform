<template>
  <div class="article-list_wrapper" :class="articleList.length > 0 ? 'gray-bg' : ''">

    <div class="tools-bar">
      <md-button :type="isSortEnabled === true ? 'primary' : 'disabled'" size="small" @click="showSelector" icon="sort">{{curSortValue}}</md-button>
    </div>

    <div class="article-list">
      <card
        class="article-item"
        v-for="(article, index) in orderArticleList"
        round
        shadow="always"
        :key="index"
      >
        <article class="article">
          <div class="article-title">
            <h3>
              <md-button
                type="link"
                @click="
                  $router.push({
                    path: `/${articleType}/article/${article.articleID}?articleType=${articleType}`
                  })
                "
                >{{ article.title }}</md-button
              >
            </h3>
          </div>

          <p class="article__content">{{ article.summary }}</p>
          <div
            class="article__info normal-info-font normal-margin__tb"
          >
            <div class="article-author">
              <p href="">{{ article.authorName }} </p>
            </div>
            <div class="article-vg">
              <span> 浏览：{{ article.views }} </span>
              <span>
                点赞：{{ article.goods.length }}
                <span></span>
              </span>
            </div>
          </div>
          <div
            type="flex"
            justify="space-between"
            class="article__meta"
          >
            <div class="article__tags">
              <md-tag
                size="small"
                shape="fillet"
                fill-color="236,245,255"
                v-for="(tag, index) in article.tags"
                :key="index"
                >{{ tag }}</md-tag
              >
            </div>
            <div class="article__date">
              {{ formatDate(article.created, dayjsNowTime) }}
            </div>
          </div>
        </article>
      </card>
      <card
        v-if="articleList.length === 0 && loadingArticle === false"
        class="article_empty"
        shadow="always"
      >
        暂时还没有任何文章！
      </card>
    </div>

    <md-selector
        v-model="isSelectorShow"
        default-value="ascendingTime"
        :data="sortOptions[0]"
        max-height="320px"
        title="文章排序方式"
        large-radius
        @choose="onSelectorChoose"
    ></md-selector>
  </div>
</template>

<script>
import Card from '@/components/Card';
export default {
  props: {
    user: {
      type: Object,
      default: {}
    },
    articleType: {
      type: String,
      default: 'news'
    },
  },
  
  data(){
    return {
      isSortEnabled: false,
      articleList:[],
      orderArticleList: [],
      articlesCountLimit: 12,
      dayjsNowTime: this.$dayjs(Date.now()),
      skipArticles: 0,
      isSelectorShow: false,
      sortOptions: [
        [
          {
            text: '按时间正序',
            value: 'ascendingTime',
          },
          {
            text: '按时间倒序',
            value: 'reversedTime',
          }
        ],
      ],
      loadingArticle: true,
      curSortValue: '按时间正序',
      sortType: 'ascendingTime'
    }
    
  },
  created() {
    this.getArticles();
  },
  methods: {
    showSelector() {
      this.isSelectorShow = true
    },
    onSelectorChoose({text, value}) {
      this.curSortValue = text;
      this.sortType = value;
      this.sortArticleList(value);
    },
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
    getArticles() {
      this.$http.post('getArticles',{
        articleType: this.articleType,
        skipArticles: this.skipArticles,
        articlesCountLimit: this.articlesCountLimit
      })
        .then(res => {
          if (res.data.code === 1 && res.data.data.length > 0) {
            this.articleList = res.data.data;
            this.skipArticles += this.articlesCountLimit;
            this.isSortEnabled = true;
          }
          this.sortArticleList(this.sortType)
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loadingArticle = false;
        });
    },    
    sortArticleList(sortType) {
      const dayjs = this.$dayjs;
      const direction = sortType === 'ascendingTime' ? -1 : 1;
      this.orderArticleList = this.articleList.sort((x, y) => {
        return dayjs(x.created).isAfter(dayjs(y.created))
          ? direction
          : -direction;
      });
    }
  },
  components: {
    Card
  }
}
</script>

<style lang="scss" scoped>
.article-list_wrapper {
  padding: 1rem;
  min-height: calc(100vh - 7.4rem);
}
.tools-bar {
  height: 2.6rem;
  > button {
    width: 36%;
    float: right;
  }
}
.article-loading__wrapper {
  height: 120px;
}
.normal-info-font {
    color: #999;
}
.normal-margin__tb {
  margin: 15px 0;
  font-size: 14px;
}

// .news-list__wrapper {
//   display: flex;
// }
.article {
  padding: 1.2rem;
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;
}
.article-list {
  width: 100%;
  > .card {
    padding: 0;
    margin: 1rem 0;
  }
}
.article-title {
  h3 {
    margin: 0;
    > button {
      padding: 0;
    }
  }
}
.article__info,.article__meta{
  display: flex;
  justify-content: space-between;
}
.article__content {
  line-height: 24px;
  height: 48px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #909399;
  font-size: 14px;
  padding: 0 .2rem;
}
.article__date {
  color: #909399;
  font-size: 12px;
  line-height: 24px;
}

.article_empty {
  padding: 5rem !important;
  text-align: center;
  color: #909090;
}

</style>