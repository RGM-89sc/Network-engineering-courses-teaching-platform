(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1cf939c3"],{"2d4b":function(t,e,a){},"2f21":function(t,e,a){"use strict";var i=a("79e5");t.exports=function(t,e){return!!t&&i((function(){e?t.call(null,(function(){}),1):t.call(null)}))}},3341:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"article-list_wrapper",class:t.articleList.length>0?"gray-bg":""},[a("div",{staticClass:"tools-bar"},[a("md-button",{attrs:{type:!0===t.isSortEnabled?"primary":"disabled",size:"small",icon:"sort"},on:{click:t.showSelector}},[t._v(t._s(t.curSortValue))])],1),a("div",{staticClass:"article-list"},[t._l(t.orderArticleList,(function(e,i){return a("card",{key:i,staticClass:"article-item",attrs:{round:"",shadow:"always"}},[a("article",{staticClass:"article"},[a("div",{staticClass:"article-title"},[a("h3",[a("md-button",{attrs:{type:"link"},on:{click:function(a){return t.$router.push({path:"/"+t.articleType+"/article/"+e.articleID+"?articleType="+t.articleType})}}},[t._v(t._s(e.title))])],1)]),a("p",{staticClass:"article__content"},[t._v(t._s(e.summary))]),a("div",{staticClass:"article__info normal-info-font normal-margin__tb"},[a("div",{staticClass:"article-author"},[a("p",{attrs:{href:""}},[t._v(t._s(e.authorName)+" ")])]),a("div",{staticClass:"article-vg"},[a("span",[t._v(" 浏览："+t._s(e.views)+" ")]),a("span",[t._v("\n              点赞："+t._s(e.goods.length)+"\n              "),a("span")])])]),a("div",{staticClass:"article__meta",attrs:{type:"flex",justify:"space-between"}},[a("div",{staticClass:"article__tags"},t._l(e.tags,(function(e,i){return a("md-tag",{key:i,attrs:{size:"small",shape:"fillet","fill-color":"236,245,255"}},[t._v(t._s(e))])})),1),a("div",{staticClass:"article__date"},[t._v("\n            "+t._s(t.formatDate(e.created,t.dayjsNowTime))+"\n          ")])])])])})),0===t.articleList.length&&!1===t.loadingArticle?a("card",{staticClass:"article_empty",attrs:{shadow:"always"}},[t._v("\n      暂时还没有任何文章！\n    ")]):t._e()],2),a("md-selector",{attrs:{"default-value":"ascendingTime",data:t.sortOptions[0],"max-height":"320px",title:"文章排序方式","large-radius":""},on:{choose:t.onSelectorChoose},model:{value:t.isSelectorShow,callback:function(e){t.isSelectorShow=e},expression:"isSelectorShow"}})],1)},s=[],r=(a("55dd"),a("ae8d")),c={props:{user:{type:Object,default:{}},articleType:{type:String,default:"news"}},data:function(){return{isSortEnabled:!1,articleList:[],orderArticleList:[],articlesCountLimit:12,dayjsNowTime:this.$dayjs(Date.now()),skipArticles:0,isSelectorShow:!1,sortOptions:[[{text:"按时间正序",value:"ascendingTime"},{text:"按时间倒序",value:"reversedTime"}]],loadingArticle:!0,curSortValue:"按时间正序",sortType:"ascendingTime"}},created:function(){this.getArticles()},methods:{showSelector:function(){this.isSelectorShow=!0},onSelectorChoose:function(t){var e=t.text,a=t.value;this.curSortValue=e,this.sortType=a,this.sortArticleList(a)},formatDate:function(t,e){var a=this.$dayjs(t),i=e.diff(a),s=Math.ceil(i/1e3/60),r=Math.ceil(s/60),c=Math.ceil(r/24);return s>59?r>23?c>29?a.format("YYYY-MM-DD"):"".concat(c,"天前"):"".concat(r,"小时前"):"".concat(s,"分钟前")},getArticles:function(){var t=this;this.$http.post("/api/getArticles",{articleType:this.articleType,skipArticles:this.skipArticles,articlesCountLimit:this.articlesCountLimit}).then((function(e){1===e.data.code&&e.data.data.length>0&&(t.articleList=e.data.data,t.skipArticles+=t.articlesCountLimit,t.isSortEnabled=!0),t.sortArticleList(t.sortType)})).catch((function(t){console.log(t)})).finally((function(){t.loadingArticle=!1}))},sortArticleList:function(t){var e=this.$dayjs,a="ascendingTime"===t?-1:1;this.orderArticleList=this.articleList.sort((function(t,i){return e(t.created).isAfter(e(i.created))?a:-a}))}},components:{Card:r["a"]}},l=c,n=(a("bb21"),a("2877")),o=Object(n["a"])(l,i,s,!1,null,"e8bb4080",null);e["default"]=o.exports},"55dd":function(t,e,a){"use strict";var i=a("5ca1"),s=a("d8e8"),r=a("4bf8"),c=a("79e5"),l=[].sort,n=[1,2,3];i(i.P+i.F*(c((function(){n.sort(void 0)}))||!c((function(){n.sort(null)}))||!a("2f21")(l)),"Array",{sort:function(t){return void 0===t?l.call(r(this)):l.call(r(this),s(t))}})},5957:function(t,e,a){},ae8d:function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"card",class:{"is-always-shadow":"always"===t.shadow,"is-hover-shadow":"hover"===t.shadow,border:t.border,round:t.round}},[t._t("default")],2)},s=[],r={props:{border:{type:Boolean,default:!1},round:{type:Boolean,default:!1},shadow:{type:String,default:"never"}}},c=r,l=(a("b86e"),a("2877")),n=Object(l["a"])(c,i,s,!1,null,"68c27dfd",null);e["a"]=n.exports},b86e:function(t,e,a){"use strict";var i=a("2d4b"),s=a.n(i);s.a},bb21:function(t,e,a){"use strict";var i=a("5957"),s=a.n(i);s.a}}]);
//# sourceMappingURL=chunk-1cf939c3.f6f40763.js.map