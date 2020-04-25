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
              @click="likesArticleHandler"
            >
              <md-icon :name="likesLoading ? 'spinner' : 'arrow-up'" :color="isLiked ? '#409eff' : 'gray'" size="md"></md-icon>
              {{ goodsCount }}次点赞
            </span>
          </div>
        </div>
      </div>
      <div class="article__content" v-html="article.content"></div>
    </article>
  </div>
</template>

<script>
import { formatDate } from '@/helpers/formatDate1';
import { throttle } from '@/helpers/throttle';
export default {
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      article: {},
      articleType: this.$route.query.articleType || 'news',
      articleID: this.$route.params.article_id,
      isLiked: false,
      replyContent: '',
      currentReply: '',
      dayjsNowTime: this.$dayjs(Date.now()),
      
      goodsCount: 0,
      likesLoading: false
    };
  },
  methods: {
    formatDate(date, now) {
      return formatDate(date, now, this.$dayjs);
    },
    checkIdentity() {
      if(!this.user.id){
        this.$router.push({
          path: '/auth'
        });
        return false;
      }
      return true;
    },
    getArticle() {
     const url = 'getArticle';
     this.$http.post(url,{
        articleID: this.articleID,
        articleType: this.articleType
      })
        .then(res => {
          if (res.data.code === 1) {
            this.article = res.data.data;
            this.goodsCount = this.article.goods.length;
            this.isLiked = this.article.isLiked;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    incViewsCount(count = 1) {
      this.$http.post('incViewsCount',{
        articleID: this.articleID,
        articleType: this.articleType
      })
        .then((res) => {
          this.article.views++;
          console.log(res);
        })
        .catch(err => {
          console.error(err); 
        });
    },
    likesArticleHandler() {
      if(!this.checkIdentity()){
        return false;
      }
      
      this.likesLoading = true;
      throttle(() => {
        let likes = direction => {
          const method = direction === 1 ? 'doLikes' : 'cancelLikes';
          const api = `${method}`;
          this.$http.post(api, {
          articleID: this.articleID,
          articleType: this.articleType,
          userID: this.user.id,
          userType: this.user.userType,
          userName: this.user.username
        })
        .then((res) => {
            this.goodsCount += direction;
          })
        .catch(err => {
            console.error(err);
        })
        .finally(_ => {
          this.likesLoading = false;
        });
        }
        !this.isLiked ? likes(1) : likes(-1);

        this.isLiked = !this.isLiked;
        })
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
        articleID: this.articleID
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
    this.getArticle();
    this.incViewsCount();
  },
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

<style lang="scss">
.article__content {
  word-break: break-all;

  figure[class="image"] {
    img {
      max-width: 100%;
    }
  }
}
</style>