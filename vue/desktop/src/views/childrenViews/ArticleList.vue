<template>
  <div class="news-list__wrapper">
    <el-row class="news-list__header" type="flex" justify="space-between">
      <el-col :span="5">
        <el-select v-model="sortData.sortSelectVal" placeholder="请选择排序方式">
          <el-option
            v-for="item in sortData.sortOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-col>
      <!-- <el-col class="search-news__wrapper" :span="5">
        <el-input
          class="search-news"
          v-model="searchVal"
          placeholder="搜索..."
        ></el-input>
      </el-col> -->

      <el-col class="post-news__wrapper" :span="19">
        <div class="post-news">
          <el-button
            class="post-news-btn"
            type="primary"
            @click="
              $router.push({
                path: `/${articleType}/addArticle?articleID=${articleID}&articleType=${articleType}`
              })
            "
            >发布文章</el-button
          >
        </div></el-col
      >
    </el-row>

    <el-card class="news__list">
      <div
        class="news__item"
        v-for="(article, index) in pageArticles"
        :key="index"
      >
        <article class="news-article">
          <div class="news-article__title">
            <h3>
              <el-link
                @click="
                  $router.push({
                    path: `/${articleType}/article/${article.articleID}?articleType=${articleType}`
                  })
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
              <el-link href="#">{{ article.authorName }} </el-link>
            </div>
            <div class="news-article-vg">
              <span> 浏览：{{ article.views }} </span>
              <span>
                点赞：{{ article.goods.length }}
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
              {{ formatDate(article.created, dayjsNowTime) }}
            </div>
          </el-row>
        </article>
      </div>
      <div
        v-if="articleList.length === 0 && loadingArticle === false"
        class="article_empty"
      >
        暂时还没有任何文章！
      </div>
      <div
        v-if="loadingArticle"
        v-loading="loadingArticle"
        class="article-loading__wrapper"
      ></div>
    </el-card>
    <el-row v-if="articleList.length > 0" class="pagination">
      <el-col>
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="totalSize"
          @current-change="handlePageChange"
          background
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {ArticleProvider} from '@/provider/index';
import uuid from 'uuid/v4';
export default {
  props: {
    user: {
      type: Object,
      default: {}
    },
    articleType: {
      type: String,
      default: 'news'
    }
  },
  data() {
    return {
      //pagintation data
      currentPage: 1,
      pageSize: 8,
      articleList: [],
      pageIndex: 0,
      // pageArticles: null,


      //要发布的文章ID
      articleID: '',
      dayjsNowTime: this.$dayjs(Date.now()),
      searchVal: '',


      sortData: {
        sortSelectVal: '',
        sortOptions: [
          {
            label: '按时间正序',
            value: 'ascendingTime',
            disabled: false
          },
          {
            label: '按时间倒序',
            value: 'reversedTime',
            disabled: false
          }
        ]
      },
      loadingArticle: true,

      skipArticles: 0,
    };
  },
  computed: {
    totalSize() {
      return this.articleList.length; 
    },
    pageArticles() {
      return this.articleList.slice(this.pageIndex, this.pageIndex + this.pageSize);
    }
  },
  watch: {
    'sortData.sortSelectVal': function(sortType) {
      this.sortArticleList(sortType)
    },
  },
  created() {
    this.articleID = uuid().split('-').join('');
    this.getArticles();
  },
  mounted() {
    this.IntersectionObserverOfstickyHandler({
      root: this.$el.querySelector('.news-list__header')
    });
  },
  methods: {
    handlePageChange(val) {
      this.pageIndex = (val - 1) * this.pageSize;
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
      ArticleProvider.getArticles({
        articleType: this.articleType,
        skipArticles: this.skipArticles,
      })
        .then(res => {
          if (res.data.code === 1) {
            this.articleList = res.data.data;
            this.skipArticles += this.pageSize;
          }
          this.sortArticleList('ascendingTime')
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loadingArticle = false;
        });
    },
    IntersectionObserverOfstickyHandler({
      root,
      stickyClassName = 'sticky__element'
    }) {
      const observedEl = document.createElement('div');
      observedEl.style.position = 'absolute';
      observedEl.style.top = '0';
      const rootParent = root.parentElement
        ? root.parentElement
        : document.documentElement;
      rootParent.insertBefore(observedEl, root);
      const observerHandler = entries => {
        if (entries[0].isIntersecting === false) {
          root.classList.add('sticky__element');
        } else if (entries[0].isIntersecting === true) {
          root.classList.remove('sticky__element');
        }
      };
      const intersectionObserver = new IntersectionObserver(observerHandler);

      intersectionObserver.observe(observedEl);
    },
    sortArticleList(sortType) {
      const dayjs = this.$dayjs;
      const direction = sortType === 'ascendingTime' ? -1 : 1;
      this.pageArticles.sort((x, y) => {
        return dayjs(x.created).isAfter(dayjs(y.created))
          ? direction
          : -direction;
      });
    }
  }
};
</script>

<style lang="scss">
.article-loading__wrapper {
  height: 120px;
}
.news-list__wrapper {
  min-width: 720px;
  > .news__list {
    margin-top: 28px;
    > .el-card__body {
      padding: 0;
    }
  }
  > .news-list__header {
    > .post-news__wrapper {
      text-align: right;
      > .post-news {
        > .post-news-btn {
        }
      }
    }
  }
}
.normal-margin__tb {
  margin: 15px 0;
  font-size: 14px;
}

.normal-info-font {
  color: #999;
}
// .news-list__wrapper {
//   display: flex;
// }
.news-article {
  padding: 25px;
  border-radius: 5px;
  transition: background-color 0.2s ease-in-out;
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

.article_empty {
  padding: 5rem;
  text-align: center;
  color: #909090;
}
.sticky__element {
  position: fixed;
  top: 0;
  background-color: white;
  z-index: 9999;
  width: 100%;
  /* height: 38px; */
  padding: 0 25.5% 0 25.5%;
  left: 0;
  min-width: 720px;
}
.pagination {
  margin-top: 24px;
}
</style>