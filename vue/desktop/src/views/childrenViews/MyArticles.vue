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
                    <h1
                        @click="
                            $router.push({
                                path: `/${article.articleType}/article/${article.articleID}`
                            })
                        "
                    >
                        {{ article.title }}
                    </h1>
                    <div class="article-date">
                        {{ $dayjs(article.created).format("YYYY-MM-DD") }}
                    </div>
                </el-col>
                <el-col :span="6" class="manipulate">
                    <el-button type="danger" @click="delArticle(article)"
                        >删除</el-button
                    >
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
            const type = this.user.userType === 0 ? "stu" : "tch";
            const url = `/api/${type}GetMyArticles`;
            this.$http
                .get(url)
                .then(res => {
                    if (res.data.code === 1) {
                        this.articles = res.data.data;
                        console.log(this.articles);
                    } else {
                        this.$message({
                            message: "获取信息失败!",
                            type: "fail"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        delArticle(article) {
            const url = "/api/delArticle";
            this.$http
                .post(url, {
                    articleType: article.articleType,
                    articleID: article.articleID,
                    authorID: article.authorID
                })
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message({
                            message: "删除成功",
                            type: "success"
                        });
                    } else if (res.data.code === 0) {
                        this.$message.error({
                            message: res.data.info
                        });
                    } else {
                        this.$message.error({
                            message: "删除失败！"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
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
        span {
            line-height: 40px;
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