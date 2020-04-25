<template>
  <div class="news-detail">
    <article class="news-article">
      <h1 class="article__title">{{ article.title }}</h1>
      <el-row type="flex" class="article__meta sub-font_sub" :gutter="1">
        <el-link class="article__author-avatar" :underline="false">
          <img :src="article.avatarURL" :alt="article.authorName" />
        </el-link>

        <div class="article__author-name-time">
          <el-link type="primary">{{ article.authorName }}</el-link>

          <div class="article__meta-detail">
            <div class="article__created item_padding">
              {{ formatDate(article.created, dayjsNowTime) }}
            </div>
            <span class="item_padding">
              <el-icon class="el-icon-view"></el-icon>
              {{ article.views }}次浏览&nbsp;&nbsp;&nbsp;·</span
            >
            <el-link
              @click="likesArticleHandler"
              :underline="false"
              class="article__good-btn item_padding"
              :type="isLiked ? 'primary' : 'default'"
            >
              <el-icon :class="likesLoading ? 'el-icon-loading' : isLiked ? 'el-icon-star-on' : 'el-icon-star-off'"></el-icon>
              {{ goodsCount }} 次点赞

            </el-link>
          </div>
        </div>
      </el-row>
      <div class="article__content" v-html="article.content"></div>
    </article>
    <!-- <div class="comments-area">
      <div class="comments__meta">
        <p>{{ comments.length }}个评论</p>
      </div>
      <div class="comments__list_wrapper">
        <div
          class="comment__item_wrapper"
          v-for="(comment, index) in comments"
          :key="index"
        >
          <div class="commenter-avatar">
            <img
              :src="comment.commenterAvatar"
              :alt="comment.commenterName"
              :title="comment.commenterName"
            />
          </div>
          <div class="comment__main">
            <div class="comment__header">
              <p class="comment__meta">
                <el-link type="primary">{{ comment.commenterName }}</el-link>
                <span>{{ comment.created }} </span>
              </p>
            </div>
            <div class="comment__content display-info_normal">
              <p>{{ comment.content }}</p>
            </div>
            <div class="comment__footer">
              <p class="comment_action display-info_sub">
                <el-link :underline="false">
                  <el-icon
                    class="el-icon-star-off"
                    data-is-stared=""
                    @click="starClickHandler"
                  ></el-icon>
                  {{ comment.likeN }}
                </el-link>
                <el-link
                  icon="el-icon-s-comment"
                  :underline="false"
                  :data-index="comment.id"
                  @click="handler"
                >
                  回复</el-link
                >
              </p>
              <el-row
                class="action_reply"
                :class="{
                  ['action_reply_active']: currentReply === comment.id
                }"
                type="flex"
              >
                <el-input
                  type="textarea"
                  :autosize="{minRows: 1, maxRows: 6}"
                  placeholder="请输入内容"
                  v-model="replyContent"
                >
                </el-input>
                <el-button size="mini">
                  提交回复
                </el-button>
              </el-row>
            </div>
            <ul class="comment__replys">
              <li
                class="comment__reply"
                v-for="(reply, index) in comment.replys"
                :key="index"
              >
                <div class="replyer-avatar">
                  <img
                    :src="reply.replyerAvatar"
                    :alt="reply.replyerName"
                    :title="reply.replyerName"
                  />
                </div>
                <div class="reply__main">
                  <div class="reply__header">
                    <p class="reply__meata">
                      <el-link type="primary">
                        {{ reply.replyerName }}
                      </el-link>
                      <span>
                        {{ reply.created }}
                      </span>
                    </p>
                  </div>
                  <div class="reply__content display-info_normal">
                    {{ reply.content }}
                  </div>
                  <div class="reply__footer">
                    <p class="reply_action display-info_sub">
                      <el-link :underline="false">
                        <el-icon class="el-icon-star-off"> </el-icon>
                        {{ reply.likeN }}
                      </el-link>
                      <el-link
                        icon="el-icon-s-comment"
                        :underline="false"
                        :data-index="index"
                        @click="handler"
                      >
                        回复</el-link
                      >
                    </p>
                    <el-row
                      class="action_reply"
                      type="flex"
                      :class="{
                        ['action_reply_active']: currentReply === comment.id
                      }"
                    >
                      <el-input
                        type="textarea"
                        :autosize="{minRows: 1, maxRows: 6}"
                        placeholder="请输入内容"
                        v-model="replyContent"
                      >
                      </el-input>
                      <el-button size="mini">
                        提交回复
                      </el-button>
                    </el-row>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { ArticleProvider } from '@/provider/index';
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
    checkIdentity() {
      if(!this.user.id){
        this.$router.push({
          path: '/auth'
        });
        return false;
      }
      return true;
    },
    formatDate(created, now) {
      return formatDate(created, now, this.$dayjs);
    },
    getArticle() {
      ArticleProvider.getArticle({
        articleID: this.articleID,
        articleType: this.articleType
      })
        .then(res => {
          if (res.data.code === 1) {
            this.article = res.data.data;
            this.goodsCount = this.article.goods.length;
            this.isLiked = this.article.isLiked;
            // this.comments = this.article.comments;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    incViewsCount(count = 1) {
      ArticleProvider.incViewsCount({
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
          ArticleProvider[method]({
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
    }
  },
  created() {
    this.getArticle();
    this.incViewsCount();
  }
};
</script>

<style lang="scss" scoped>
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
.comment__item_wrapper,
.comment__reply {
  display: flex;
  .commenter-avatar,
  .replyer-avatar {
    margin-top: 1em;
    padding-right: 24px;
    > img {
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }
  }
}
.comment__item_wrapper {
  border-bottom: 1px solid #eee;
}
.item_padding {
  padding-right: 15px;
}
.sub-font_sub {
  font-size: 14px;
  color: #999;
}
.news-article {
  > .article__title {
    font-size: 48px;
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
.comment__main,
.reply__main {
  flex: 1;
  .comment__footer,
  .reply__footer {
    > .comment_action,
    .reply_action {
      > a {
        padding-right: 12px;
      }
    }
  }
}
.comment__replys {
  margin: 0;
  padding: 0;
}
.action_reply {
  display: none;
  // visibility: hidden;
  // transition: transform, visibility .3s ease;
  // transform: translate3d(0, -100%, 0);
  > .el-textarea {
    padding-right: 15px;
    > textarea {
      max-height: 120px;
    }
  }
  > button {
    height: 33px;
  }
}
.action_reply_active {
  display: flex;
  // transform: translate3d( 0, -100%, 0);
  // visibility: visible;
}
.comments-area {
  margin-top: 25px;
  border-top: 1px solid #eee;
}
</style>