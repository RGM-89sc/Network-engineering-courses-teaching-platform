(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-224ad2ab"],{"400d":function(e,t,a){},c2ec:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("span",{staticClass:"filename"},[e._v(e._s(e.$route.params.filename))]),e.pdfLoaded?e._e():a("PDFViewerSkeleton"),a("div",{staticClass:"pdf-viewer",style:{visibility:e.pdfLoaded?"visible":"hidden",transform:"translateY("+(e.pdfLoaded?"0":"-200%")+")"}},[a("el-row",{staticClass:"pdf-main"},[a("pdf",{ref:"pdf",staticStyle:{"background-color":"#eee",display:"flex",flex:"1"},attrs:{src:e.src,page:e.currentPage},on:{error:e.pdfError}})],1),a("el-row",{staticClass:"pdf-console"},[a("el-col",{staticClass:"tools",attrs:{span:12}},[a("i",{staticClass:"el-icon-edit",staticStyle:{display:"inline-block","margin-left":"1rem",cursor:"pointer"},attrs:{title:"铅笔"},on:{click:e.selectPen}}),a("el-color-picker",{staticStyle:{"margin-left":"1rem"},attrs:{size:"small",title:"选择颜色",predefine:["#000","#FF0000","#ff8c00","#ffd700","#90ee90","#00ced1","#1e90ff","#c71585"]},model:{value:e.penColor,callback:function(t){e.penColor=t},expression:"penColor"}}),a("div",{staticStyle:{"box-sizing":"border-box",display:"inline-block","margin-left":"1rem",padding:"0 15px",width:"120px"}},[a("el-slider",{attrs:{min:1,max:10,title:"笔尖粗细"},model:{value:e.penThickness,callback:function(t){e.penThickness=t},expression:"penThickness"}})],1)],1),a("el-col",{staticClass:"pagination",attrs:{span:3}},[a("span",[a("span",{attrs:{id:"currentPage",contenteditable:"true"},on:{blur:e.gotoPage,keydown:e.checkKeyCode}},[e._v(e._s(e.currentPage))]),e._v(" / "+e._s(e.pageCount)+"\n        ")])]),a("el-col",{staticClass:"reading-progress",attrs:{span:8}},[a("el-progress",{attrs:{percentage:e.readingProgress,"show-text":!1}})],1)],1),a("el-row",{staticClass:"catalogue"},[a("div",{staticClass:"prev"},[a("i",{staticClass:"el-icon-arrow-left",on:{click:e.prev}})]),a("div",{staticClass:"catalogue-list-box"},[a("div",{staticClass:"catalogue-list",style:{transform:"translateX(calc(-20% * "+(e.catalogueItemOffsetPage-1)+"))"}},e._l(e.needLoadPageNum,(function(t){return a("a",{key:t,attrs:{href:e.$route.path+"#"+t},on:{click:function(a){return e.changePage(t)}}},[a("pdf",{ref:"catalogueItem",refInFor:!0,staticClass:"catalogue-item",class:{"catalogue-item-active":e.currentPage===t},attrs:{src:e.src,page:t},on:{"page-loaded":function(a){return e.pageLoaded(t)},error:e.pdfError}})],1)})),0)]),a("div",{staticClass:"next"},[a("i",{staticClass:"el-icon-arrow-right",on:{click:e.next}})])])],1)],1)},s=[],r=(a("a481"),a("858e")),o=a("e400"),i={data:function(){return{src:"",loading:null,currentPage:1,pageCount:0,progress:0,pdfLoaded:!1,currentOffset:1,needLoadPageNum:1,isDrawing:!1,canvas:null,context:null,canvasOffset:{},canDraw:!1,penColor:"#000",penThickness:1}},created:function(){var e=this;console.log(this.$route.params.filename),this.src=r["a"].createLoadingTask("".concat(this.$serverBaseUrl,"/static/courseware/").concat(this.$route.params.course_id,"/").concat(this.$route.params.filename)),console.log(this.src),this.loading=this.$loading({lock:!0,text:"正在绘制图像，请耐心等待",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"}),this.src.then((function(t){e.pageCount=t.numPages,e.pageCount<=10?e.needLoadPageNum=e.pageCount:e.needLoadPageNum=10;var a=e.$route.hash;a&&(e.currentPage=parseInt(a.replace("#","")),e.currentOffset=e.currentPage-(e.pageCount-e.currentPage)-2),window.onresize=function(){e.canvasOffset=e.getElementPosition(e.canvas)}}))},computed:{catalogueItemOffsetPage:function(){var e=1;return this.currentPage,this.currentPage>3&&this.currentPage<this.pageCount-1&&(e=this.currentPage-2,this.currentOffset=e),this.currentPage>=this.pageCount-1&&(e=this.currentOffset>3&&this.currentOffset<this.pageCount-1?this.pageCount-4:this.currentOffset),e},readingProgress:function(){return parseInt(this.currentPage/this.pageCount*100)||0}},watch:{needLoadPageNum:function(e){var t=this;setTimeout((function(){e+1<t.pageCount&&(t.needLoadPageNum++,console.log("继续加载"+t.needLoadPageNum+"页"))}),200)},penColor:function(e,t){this.context.strokeStyle=e},penThickness:function(e,t){this.context.lineWidth=e}},props:{user:{type:Object,default:{}}},methods:{encodeFilename:function(e){return e.replace(/\+/g,"%2B").replace(/ /g,"-").replace(/\//g,"%2F").replace(/\?/g,"%3F").replace(/#/g,"%23").replace(/&/g,"%26").replace(/=/g,"%3D")},decodeFilename:function(e){return e.replace(/%2B/g,"+").replace(/%2F/g,"/").replace(/%3F/g,"?").replace(/%23/g,"#").replace(/%26/g,"&").replace(/%3D/g,"=")},checkKeyCode:function(e){return 8===e.keyCode||46===e.keyCode||37===e.keyCode||39===e.keyCode?null:e.keyCode>=96&&e.keyCode<=105||e.keyCode>=48&&e.keyCode<=57?null:void e.preventDefault()},gotoPage:function(e){var t=parseInt(e.target.innerText);t<=0?this.currentPage=1:t>0&&t<this.pageCount?this.currentPage=t:this.currentPage=this.pageCount},getElementPosition:function(e){var t=0,a=0;while(null!=e)t+=e.offsetLeft,a+=e.offsetTop,e=e.offsetParent;return{x:t,y:a}},selectPen:function(){this.canDraw=!0,this.context.strokeStyle=this.penColor,this.context.lineWidth=this.penThickness,this.canvasOffset=this.getElementPosition(this.canvas)},startDrawing:function(e){this.isDrawing=!0,this.context.beginPath(),this.context.moveTo(e.pageX-this.canvasOffset.x,e.pageY-this.canvasOffset.y)},stopDrawing:function(){this.isDrawing=!1},draw:function(e){if(this.isDrawing&&this.canDraw){var t=e.pageX-this.canvasOffset.x,a=e.pageY-this.canvasOffset.y;this.context.lineTo(t,a),this.context.stroke()}},prev:function(){this.currentPage>1&&this.currentPage--},next:function(){this.currentPage<this.pageCount&&this.currentPage++},changePage:function(e){this.currentPage=e},pageLoaded:function(e){var t=this;console.log("loaded page "+e);var a=this.needLoadPageNum;this.progress=parseInt(e/a*100),!1===this.pdfLoaded&&100===this.progress&&(setTimeout((function(){t.needLoadPageNum+1<=t.pageCount&&(t.needLoadPageNum++,console.log("继续加载"+t.needLoadPageNum+"页"))}),50*a),setTimeout((function(){t.$refs.pdf.$refs.annotationLayer.style.display="none",t.canvas=t.$refs.pdf.$refs.canvas,t.context=t.canvas.getContext("2d"),t.canvas.onmousedown=t.startDrawing,t.canvas.onmouseup=t.stopDrawing,t.canvas.onmouseout=t.stopDrawing,t.canvas.onmousemove=t.draw,t.pdfLoaded=!0,t.$nextTick((function(){t.loading.close()}))}),150*a))},pdfError:function(e){console.log(e)}},components:{pdf:r["a"],PDFViewerSkeleton:o["a"]}},c=i,l=(a("d86c"),a("2877")),u=Object(l["a"])(c,n,s,!1,null,"57f27401",null);t["default"]=u.exports},d86c:function(e,t,a){"use strict";var n=a("400d"),s=a.n(n);s.a}}]);
//# sourceMappingURL=chunk-224ad2ab.8e8c8911.js.map