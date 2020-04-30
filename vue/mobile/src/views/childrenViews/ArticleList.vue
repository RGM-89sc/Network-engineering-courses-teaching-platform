<template>
  <div class="article-list_wrapper" :class="articleList.length > 0 ? 'gray-bg' : ''">

    <div class="tools-bar">
      <md-button type="primary" size="small" inline @click="handleAddArticle">
        发布文章
      </md-button>
      <md-button inline :type="isSortEnabled === true ? 'primary' : 'disabled'" size="small" @click="showSelector" icon="sort">{{curSortValue}}</md-button>
    </div>

    <div class="article-list">
      <md-scroll-view
          ref="scrollView"
          :scrolling-x="false"
          @end-reached="$_onEndReached"
        >
        <card
          class="article-item scroll-view-list"
          v-for="(article, index) in articleList"
          round
          shadow="always"
          :key="index">
          <article class="article scroll-view-item" 
                   @click="$router.push({path: `/${articleType}/article/${article.articleID}?articleType=${articleType}`})">
            <div class="article-title">
              <h3>
                {{ article.title }}
              </h3>
            </div>

            <p class="article__content">{{ article.summary }}</p>
            <div
              class="article__info normal-info-font normal-margin__tb">
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
              class="article__meta">
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

        <!-- loading more -->
        <md-scroll-view-more
          slot="more"
          :is-finished="isFinished"
        >
        </md-scroll-view-more>
      </md-scroll-view>
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
import { formatDate } from '@/helpers/formatDate1'
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
      dayjsNowTime: this.$dayjs(Date.now()),
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
      loadingArticle: false,
      curSortValue: '按时间正序',
      sortType: 'ascendingTime',


      //loading  more data
      isFinished: false,
      loadSize: 5,
      totalSize: this.loadSize + 1,
      currentSize: 0
    }
    
  },
  created() {
    this.getArticlesCount();
    this.$_onEndReached();
  },
  methods: {
    handleAddArticle() {
      this.$router.push({
        path: `${this.$route.path}/addArticle?articleType=${this.articleType}`
      })
    },
    $_onEndReached() {
      if (this.isFinished || this.loadingArticle) {
        return
      }
      this.loadingArticle = true;
      // async data
      setTimeout(() => {
        this.getArticles()
         .then(res => {
          if (res.data.code === 1 && res.data.data.length > 0) {
            const moreArticles = res.data.data;
            this.articleList = [...this.articleList, ...moreArticles];
            this.currentSize += this.loadSize;
            this.isSortEnabled = true;
          }
          this.sortArticleList(this.sortType)
          if (this.currentSize >= this.totalSize) {
            this.isFinished = true
          }
        })
        .catch(err => {
          this.$toast.failed('加载失败！');
          console.log(err);
        })
        .finally(() => {
          this.loadingArticle = false;
          this.$refs.scrollView.finishLoadMore()
        });
      }, 1000)
    },
    showSelector() {
      this.isSelectorShow = true
    },
    onSelectorChoose({text, value}) {
      this.curSortValue = text;
      this.sortType = value;
      this.sortArticleList(value);
    },
    formatDate(date, now) {
      formatDate(date, now, this.$dayjs);
    },
    getArticles() {
      return this.$http.post('getArticles',{
        articleType: this.articleType,
        skipArticles: this.currentSize,
        getArticlesCount: this.loadSize
      })
    },    
    getArticlesCount() {
      this.$http.post(`getArticlesCount`, {
        articleType: this.articleType,
      }).then(res => {
        if(res.data.code === 1) {
          this.totalSize = res.data.data;
        }
      }).catch(err => {
        console.error('无法获取文章总数！', err);
      })
    },
    sortArticleList(sortType) {
      const dayjs = this.$dayjs;
      const direction = sortType === 'ascendingTime' ? -1 : 1;
      this.articleList.sort((x, y) => {
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;
}
.article-list {
  height: calc(100vh - 9.53333rem);
  width: 100%;
  > .card {
    padding: 0;
    margin: 1rem 0;
  }
}
.article-title {
  h3 {
    color: #2f86f6; 
    font-size: 1rem;
    font-weight: normal;
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
  padding: .5rem 0;
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
.tools-bar {
  margin: 0 1rem;
}
</style>