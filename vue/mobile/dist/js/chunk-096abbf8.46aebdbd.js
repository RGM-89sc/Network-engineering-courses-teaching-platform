(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-096abbf8"],{"0cb4":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"gray-bg"},[a("Card",{attrs:{round:""}},[a("span",{staticClass:"title"},[e._v(e._s(e.$route.params.filename))]),a("md-activity-indicator",{directives:[{name:"show",rawName:"v-show",value:e.loading,expression:"loading"}],staticClass:"loading",attrs:{size:25,"text-size":16,vertical:""}},[e._v("正在绘制图像，请耐心等待")]),a("div",{staticClass:"pdf-viewer",style:{visibility:e.pdfLoaded?"visible":"hidden",transform:"translateY("+(e.pdfLoaded?"0":"-200%")+")"}},[a("div",{staticClass:"pdf-main"},e._l(e.pageCount,(function(t){return a("pdf",{key:t,ref:"pdf",refInFor:!0,staticClass:"pdf-page",staticStyle:{"background-color":"#eee"},attrs:{src:e.src,page:t},on:{"page-loaded":function(a){return e.pageLoaded(t)},error:e.pdfError}})})),1)])],1)],1)},n=[],r=a("ae8d"),i=a("858e"),o={data:function(){return{src:i["a"].createLoadingTask("".concat(this.$serverBaseUrl,"/static/courseware/").concat(this.$route.params.filename)),loading:!0,currentPage:1,pageCount:0,progress:0,pdfLoaded:!1,currentOffset:1,isDrawing:!1,canvas:null,context:null,canvasOffset:{},canDraw:!1,penColor:"#000",penThickness:1}},created:function(){var e=this;this.loading=!0,this.src.then((function(t){e.pageCount=t.numPages}))},props:{user:{type:Object,default:{}}},methods:{pageLoaded:function(e){var t=this;this.progress=parseInt(e/this.pageCount*100),!1===this.pdfLoaded&&100===this.progress&&setTimeout((function(){t.pdfLoaded=!0,t.$nextTick((function(){t.loading=!1}))}),200*this.pageCount)},pdfError:function(e){console.log(e)}},components:{Card:r["a"],pdf:i["a"]}},c=o,d=(a("535b"),a("2877")),p=Object(d["a"])(c,s,n,!1,null,"0ef3c794",null);t["default"]=p.exports},1507:function(e,t,a){},"535b":function(e,t,a){"use strict";var s=a("1507"),n=a.n(s);n.a}}]);
//# sourceMappingURL=chunk-096abbf8.46aebdbd.js.map