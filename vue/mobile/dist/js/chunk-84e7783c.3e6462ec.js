(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-84e7783c"],{"07e3":function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},"0fc9":function(t,n,e){var r=e("3a38"),o=Math.max,i=Math.min;t.exports=function(t,n){return t=r(t),t<0?o(t+n,0):i(t,n)}},1654:function(t,n,e){"use strict";var r=e("71c1")(!0);e("30f1")(String,"String",(function(t){this._t=String(t),this._i=0}),(function(){var t,n=this._t,e=this._i;return e>=n.length?{value:void 0,done:!0}:(t=r(n,e),this._i+=t.length,{value:t,done:!1})}))},1691:function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},"1af6":function(t,n,e){var r=e("63b6");r(r.S,"Array",{isArray:e("9003")})},"1bc3":function(t,n,e){var r=e("f772");t.exports=function(t,n){if(!r(t))return t;var e,o;if(n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!r(o=e.call(t)))return o;if(!n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},"1ec9":function(t,n,e){var r=e("f772"),o=e("e53d").document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},"1fce":function(t,n,e){},"241e":function(t,n,e){var r=e("25eb");t.exports=function(t){return Object(r(t))}},"25eb":function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},"294c":function(t,n){t.exports=function(t){try{return!!t()}catch(n){return!0}}},"2af6":function(t,n,e){"use strict";var r=e("1fce"),o=e.n(r);o.a},"2d4b":function(t,n,e){},"30f1":function(t,n,e){"use strict";var r=e("b8e3"),o=e("63b6"),i=e("9138"),a=e("35e8"),c=e("481b"),s=e("8f60"),u=e("45f2"),f=e("53e2"),l=e("5168")("iterator"),d=!([].keys&&"next"in[].keys()),p="@@iterator",h="keys",v="values",m=function(){return this};t.exports=function(t,n,e,x,b,y,w){s(e,n,x);var g,I,S,_=function(t){if(!d&&t in C)return C[t];switch(t){case h:return function(){return new e(this,t)};case v:return function(){return new e(this,t)}}return function(){return new e(this,t)}},T=n+" Iterator",O=b==v,A=!1,C=t.prototype,j=C[l]||C[p]||b&&C[b],D=j||_(b),E=b?O?_("entries"):D:void 0,k="Array"==n&&C.entries||j;if(k&&(S=f(k.call(new t)),S!==Object.prototype&&S.next&&(u(S,T,!0),r||"function"==typeof S[l]||a(S,l,m))),O&&j&&j.name!==v&&(A=!0,D=function(){return j.call(this)}),r&&!w||!d&&!A&&C[l]||a(C,l,D),c[n]=D,c[T]=m,b)if(g={values:O?D:_(v),keys:y?D:_(h),entries:E},w)for(I in g)I in C||i(C,I,g[I]);else o(o.P+o.F*(d||A),n,g);return g}},"32fc":function(t,n,e){var r=e("e53d").document;t.exports=r&&r.documentElement},"335c":function(t,n,e){var r=e("6b4c");t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},"35e8":function(t,n,e){var r=e("d9f6"),o=e("aebd");t.exports=e("8e60")?function(t,n,e){return r.f(t,n,o(1,e))}:function(t,n,e){return t[n]=e,t}},"36c3":function(t,n,e){var r=e("335c"),o=e("25eb");t.exports=function(t){return r(o(t))}},"3a38":function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},"40c3":function(t,n,e){var r=e("6b4c"),o=e("5168")("toStringTag"),i="Arguments"==r(function(){return arguments}()),a=function(t,n){try{return t[n]}catch(e){}};t.exports=function(t){var n,e,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=a(n=Object(t),o))?e:i?r(n):"Object"==(c=r(n))&&"function"==typeof n.callee?"Arguments":c}},"45f2":function(t,n,e){var r=e("d9f6").f,o=e("07e3"),i=e("5168")("toStringTag");t.exports=function(t,n,e){t&&!o(t=e?t:t.prototype,i)&&r(t,i,{configurable:!0,value:n})}},"469f":function(t,n,e){e("6c1c"),e("1654"),t.exports=e("7d7b")},"481b":function(t,n){t.exports={}},"504c":function(t,n,e){var r=e("9e1e"),o=e("0d58"),i=e("6821"),a=e("52a7").f;t.exports=function(t){return function(n){var e,c=i(n),s=o(c),u=s.length,f=0,l=[];while(u>f)e=s[f++],r&&!a.call(c,e)||l.push(t?[e,c[e]]:c[e]);return l}}},"50ed":function(t,n){t.exports=function(t,n){return{value:n,done:!!t}}},5168:function(t,n,e){var r=e("dbdb")("wks"),o=e("62a0"),i=e("e53d").Symbol,a="function"==typeof i,c=t.exports=function(t){return r[t]||(r[t]=a&&i[t]||(a?i:o)("Symbol."+t))};c.store=r},"53e2":function(t,n,e){var r=e("07e3"),o=e("241e"),i=e("5559")("IE_PROTO"),a=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?a:null}},"54a1":function(t,n,e){e("6c1c"),e("1654"),t.exports=e("95d5")},5559:function(t,n,e){var r=e("dbdb")("keys"),o=e("62a0");t.exports=function(t){return r[t]||(r[t]=o(t))}},"584a":function(t,n){var e=t.exports={version:"2.6.10"};"number"==typeof __e&&(__e=e)},"5b4e":function(t,n,e){var r=e("36c3"),o=e("b447"),i=e("0fc9");t.exports=function(t){return function(n,e,a){var c,s=r(n),u=o(s.length),f=i(a,u);if(t&&e!=e){while(u>f)if(c=s[f++],c!=c)return!0}else for(;u>f;f++)if((t||f in s)&&s[f]===e)return t||f||0;return!t&&-1}}},"5d73":function(t,n,e){t.exports=e("469f")},"62a0":function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+r).toString(36))}},"63b6":function(t,n,e){var r=e("e53d"),o=e("584a"),i=e("d864"),a=e("35e8"),c=e("07e3"),s="prototype",u=function(t,n,e){var f,l,d,p=t&u.F,h=t&u.G,v=t&u.S,m=t&u.P,x=t&u.B,b=t&u.W,y=h?o:o[n]||(o[n]={}),w=y[s],g=h?r:v?r[n]:(r[n]||{})[s];for(f in h&&(e=n),e)l=!p&&g&&void 0!==g[f],l&&c(y,f)||(d=l?g[f]:e[f],y[f]=h&&"function"!=typeof g[f]?e[f]:x&&l?i(d,r):b&&g[f]==d?function(t){var n=function(n,e,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(n);case 2:return new t(n,e)}return new t(n,e,r)}return t.apply(this,arguments)};return n[s]=t[s],n}(d):m&&"function"==typeof d?i(Function.call,d):d,m&&((y.virtual||(y.virtual={}))[f]=d,t&u.R&&w&&!w[f]&&a(w,f,d)))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,t.exports=u},"6b4c":function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},"6c1c":function(t,n,e){e("c367");for(var r=e("e53d"),o=e("35e8"),i=e("481b"),a=e("5168")("toStringTag"),c="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),s=0;s<c.length;s++){var u=c[s],f=r[u],l=f&&f.prototype;l&&!l[a]&&o(l,a,u),i[u]=i.Array}},"71c1":function(t,n,e){var r=e("3a38"),o=e("25eb");t.exports=function(t){return function(n,e){var i,a,c=String(o(n)),s=r(e),u=c.length;return s<0||s>=u?t?"":void 0:(i=c.charCodeAt(s),i<55296||i>56319||s+1===u||(a=c.charCodeAt(s+1))<56320||a>57343?t?c.charAt(s):i:t?c.slice(s,s+2):a-56320+(i-55296<<10)+65536)}}},"794b":function(t,n,e){t.exports=!e("8e60")&&!e("294c")((function(){return 7!=Object.defineProperty(e("1ec9")("div"),"a",{get:function(){return 7}}).a}))},"79aa":function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},"7cd6":function(t,n,e){var r=e("40c3"),o=e("5168")("iterator"),i=e("481b");t.exports=e("584a").getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[r(t)]}},"7d7b":function(t,n,e){var r=e("e4ae"),o=e("7cd6");t.exports=e("584a").getIterator=function(t){var n=o(t);if("function"!=typeof n)throw TypeError(t+" is not iterable!");return r(n.call(t))}},"7e90":function(t,n,e){var r=e("d9f6"),o=e("e4ae"),i=e("c3a1");t.exports=e("8e60")?Object.defineProperties:function(t,n){o(t);var e,a=i(n),c=a.length,s=0;while(c>s)r.f(t,e=a[s++],n[e]);return t}},8436:function(t,n){t.exports=function(){}},"8e60":function(t,n,e){t.exports=!e("294c")((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},"8f60":function(t,n,e){"use strict";var r=e("a159"),o=e("aebd"),i=e("45f2"),a={};e("35e8")(a,e("5168")("iterator"),(function(){return this})),t.exports=function(t,n,e){t.prototype=r(a,{next:o(1,e)}),i(t,n+" Iterator")}},9003:function(t,n,e){var r=e("6b4c");t.exports=Array.isArray||function(t){return"Array"==r(t)}},9138:function(t,n,e){t.exports=e("35e8")},9330:function(t,n,e){"use strict";e.r(n);var r=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"gray-bg"},[e("div",{staticClass:"header"},[e("span",{staticClass:"exam-name"},[t._v(t._s(t.examName))])]),e("div",{staticClass:"questions"},t._l(t.choiceQuestions,(function(n,r){return e("Card",{key:n.id,staticClass:"question",attrs:{round:""}},[e("div",{staticClass:"question-info"},[e("span",{staticClass:"question-index"},[t._v("第"+t._s(r+1)+"题")]),e("span",{staticClass:"question-type"},[t._v("["+t._s("Exclusive"===n.questionType?"单选题":"多选题")+"]")]),t._v("：\n        "),e("span",{staticClass:"problem"},[t._v(t._s(n.problem))])]),e("div",{staticClass:"question-imgs"},t._l(n.detail.imgs,(function(t){return e("div",{key:t.name,staticClass:"question-img"},[e("a",{attrs:{href:t.url,target:"_blank"}},[e("img",{attrs:{src:t.url,alt:t.name}})])])})),0),"Exclusive"===n.questionType?e("div",{staticClass:"question-selections"},t._l(n.detail.selections,(function(r){return e("md-radio",{key:r.id,attrs:{name:r.id,label:r.content},model:{value:t.userAnswer[n.id],callback:function(e){t.$set(t.userAnswer,n.id,e)},expression:"userAnswer[choiceQuestion.id]"}})})),1):t._e(),"Multiple"===n.questionType?e("div",{staticClass:"question-selections"},[e("md-check-group",{model:{value:t.userAnswer[n.id],callback:function(e){t.$set(t.userAnswer,n.id,e)},expression:"userAnswer[choiceQuestion.id]"}},t._l(n.detail.selections,(function(t){return e("md-check",{key:t.id,attrs:{name:t.id,label:t.content}})})),1)],1):t._e()])})),1),e("div",{staticClass:"submit"},[e("md-button",{attrs:{type:"primary"},on:{click:t.handIn}},[t._v("交 卷")])],1),e("div",{staticClass:"countdown"},[e("span",[t._v("倒计时："+t._s(t.countdown))])])])},o=[],i=(e("a481"),e("28a5"),e("a745")),a=e.n(i);function c(t){if(a()(t))return t}var s=e("5d73"),u=e.n(s),f=e("c8bb"),l=e.n(f);function d(t,n){if(l()(Object(t))||"[object Arguments]"===Object.prototype.toString.call(t)){var e=[],r=!0,o=!1,i=void 0;try{for(var a,c=u()(t);!(r=(a=c.next()).done);r=!0)if(e.push(a.value),n&&e.length===n)break}catch(s){o=!0,i=s}finally{try{r||null==c["return"]||c["return"]()}finally{if(o)throw i}}return e}}function p(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function h(t,n){return c(t)||d(t,n)||p()}e("ffc1"),e("ac6a");var v=e("ae8d"),m={data:function(){return{courseID:"",examID:"",examName:"",choiceQuestions:[],userAnswer:{},examTiming:60,countdown:"",haveBeenHandIn:!1,path:"/course/".concat(this.$route.params.course_id,"/exam")}},props:{user:{type:Object,default:{}}},created:function(){var t=this;this.courseID=this.$route.params.course_id,this.examID=this.$route.query.id,this.examID?this.getExamPaper():this.$dialog.failed({title:"错误",content:"没有找到该考试！",confirmText:"确定",onConfirm:function(){t.$router.push({path:t.path})}})},beforeRouteLeave:function(t,n,e){var r=this;this.haveBeenHandIn||"00:00:00"===this.countdown||this.$dialog.confirm({title:"提示",content:"考试途中不能退出, 是否交卷?",confirmText:"确定",onConfirm:function(){r.handInExamPaper()}}),this.haveBeenHandIn&&e()},methods:{initUserAnswer:function(){var t=this,n=JSON.parse(window.sessionStorage.getItem("exam.".concat(this.courseID,".").concat(this.examID,".").concat(this.user.id,".userAnswer")));n&&"{}"!==JSON.stringify(n)&&Object.entries(n).forEach((function(n){var e=h(n,2),r=e[0],o=e[1];t.$set(t.userAnswer,r,o)}))},initCountdown:function(){var t=window.sessionStorage.getItem("exam.".concat(this.courseID,".").concat(this.examID,".").concat(this.user.id,".countdown"));if(t)this.countdown=t;else{var n=Math.floor(this.examTiming/60),e=this.examTiming%60;this.countdown="".concat(n<10?"0"+n:n,":").concat(e<10?"0"+e:e,":00")}},autoEnding:function(){var t=this;this.$dialog.alert({title:"考试结束",content:"考试已结束，将自动交卷",confirmText:"确定",onConfirm:function(){t.handInExamPaper()}})},countdownTime:function(){var t=this,n=setInterval((function(){var e=t.countdown.split(":").map((function(t){return parseInt(t)})),r=e[0],o=e[1],i=e[2];0===i?(i=59,0===o?(0===r&&(i=0,clearInterval(n),t.autoEnding()),r>0&&(o=59,r--)):o--):i--,t.countdown="".concat(r<10?"0"+r:r,":").concat(o<10?"0"+o:o,":").concat(i<10?"0"+i:i),0===i&&0===r&&15===o&&t.$toast.info("离考试结束还有15分钟，请抓紧时间答题"),i%10===0&&window.sessionStorage.setItem("exam.".concat(t.courseID,".").concat(t.examID,".").concat(t.user.id,".countdown"),t.countdown)}),1e3)},getExamPaper:function(){var t=this;this.$http.post("/api/getExamPaper",{courseID:this.courseID,examID:this.examID}).then((function(n){1===n.data.code&&(t.examName=n.data.data.examName,t.choiceQuestions=n.data.data.choiceQuestions,t.examTiming=n.data.data.examTiming,t.initCountdown(),t.initUserAnswer(),t.countdownTime()),-1===n.data.code&&(console.log(n.data.errMsg),t.$dialog.failed({title:"获取数据失败",content:"发生了错误导致获取数据失败",confirmText:"确定",onConfirm:function(){t.$router.push({path:t.path})}}))})).catch((function(n){console.log(n),t.$dialog.failed({title:"获取数据失败",content:"发生了错误导致获取数据失败",confirmText:"确定",onConfirm:function(){t.$router.push({path:t.path})}})}))},saveUserAnswerToSS:function(){window.sessionStorage.setItem("exam.".concat(this.courseID,".").concat(this.examID,".").concat(this.user.id,".userAnswer"),JSON.stringify(this.userAnswer))},radio:function(t){this.saveUserAnswerToSS()},handInExamPaper:function(){var t=this;this.$http.post("/api/handIn",{courseID:this.courseID,examID:this.examID,userAnswer:this.userAnswer}).then((function(n){1===n.data.code&&(t.haveBeenHandIn=!0,window.sessionStorage.removeItem("exam.".concat(t.courseID,".").concat(t.examID,".").concat(t.user.id,".userAnswer")),window.sessionStorage.removeItem("exam.".concat(t.courseID,".").concat(t.examID,".").concat(t.user.id,".countdown")),t.$dialog.alert({title:"您的成绩",content:"您的成绩为".concat(n.data.data.score),confirmText:"确定",onConfirm:function(){t.$router.replace({path:t.path})}})),-1===n.data.code&&(console.log(n.data.errMsg),t.$dialog.failed({title:"提交失败",content:"发生了错误导致提交失败",confirmText:"确定",onConfirm:function(){}}))})).catch((function(n){console.log(n),t.$dialog.failed({title:"提交失败",content:"发生了错误导致提交失败",confirmText:"确定",onConfirm:function(){}})}))},handIn:function(){var t=this;this.$dialog.confirm({title:"提示",content:"交卷后无法再次进入考试修改答案, 是否交卷?",confirmText:"确定",onConfirm:function(){t.handInExamPaper()}})}},components:{Card:v["a"]}},x=m,b=(e("2af6"),e("2877")),y=Object(b["a"])(x,r,o,!1,null,"3d56cce7",null);n["default"]=y.exports},"95d5":function(t,n,e){var r=e("40c3"),o=e("5168")("iterator"),i=e("481b");t.exports=e("584a").isIterable=function(t){var n=Object(t);return void 0!==n[o]||"@@iterator"in n||i.hasOwnProperty(r(n))}},a159:function(t,n,e){var r=e("e4ae"),o=e("7e90"),i=e("1691"),a=e("5559")("IE_PROTO"),c=function(){},s="prototype",u=function(){var t,n=e("1ec9")("iframe"),r=i.length,o="<",a=">";n.style.display="none",e("32fc").appendChild(n),n.src="javascript:",t=n.contentWindow.document,t.open(),t.write(o+"script"+a+"document.F=Object"+o+"/script"+a),t.close(),u=t.F;while(r--)delete u[s][i[r]];return u()};t.exports=Object.create||function(t,n){var e;return null!==t?(c[s]=r(t),e=new c,c[s]=null,e[a]=t):e=u(),void 0===n?e:o(e,n)}},a745:function(t,n,e){t.exports=e("f410")},ae8d:function(t,n,e){"use strict";var r=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"card",class:{"is-always-shadow":"always"===t.shadow,"is-hover-shadow":"hover"===t.shadow,border:t.border,round:t.round}},[t._t("default")],2)},o=[],i={props:{border:{type:Boolean,default:!1},round:{type:Boolean,default:!1},shadow:{type:String,default:"never"}}},a=i,c=(e("b86e"),e("2877")),s=Object(c["a"])(a,r,o,!1,null,"68c27dfd",null);n["a"]=s.exports},aebd:function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},b447:function(t,n,e){var r=e("3a38"),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},b86e:function(t,n,e){"use strict";var r=e("2d4b"),o=e.n(r);o.a},b8e3:function(t,n){t.exports=!0},c367:function(t,n,e){"use strict";var r=e("8436"),o=e("50ed"),i=e("481b"),a=e("36c3");t.exports=e("30f1")(Array,"Array",(function(t,n){this._t=a(t),this._i=0,this._k=n}),(function(){var t=this._t,n=this._k,e=this._i++;return!t||e>=t.length?(this._t=void 0,o(1)):o(0,"keys"==n?e:"values"==n?t[e]:[e,t[e]])}),"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},c3a1:function(t,n,e){var r=e("e6f3"),o=e("1691");t.exports=Object.keys||function(t){return r(t,o)}},c8bb:function(t,n,e){t.exports=e("54a1")},d864:function(t,n,e){var r=e("79aa");t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}}},d9f6:function(t,n,e){var r=e("e4ae"),o=e("794b"),i=e("1bc3"),a=Object.defineProperty;n.f=e("8e60")?Object.defineProperty:function(t,n,e){if(r(t),n=i(n,!0),r(e),o)try{return a(t,n,e)}catch(c){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},dbdb:function(t,n,e){var r=e("584a"),o=e("e53d"),i="__core-js_shared__",a=o[i]||(o[i]={});(t.exports=function(t,n){return a[t]||(a[t]=void 0!==n?n:{})})("versions",[]).push({version:r.version,mode:e("b8e3")?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},e4ae:function(t,n,e){var r=e("f772");t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},e53d:function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},e6f3:function(t,n,e){var r=e("07e3"),o=e("36c3"),i=e("5b4e")(!1),a=e("5559")("IE_PROTO");t.exports=function(t,n){var e,c=o(t),s=0,u=[];for(e in c)e!=a&&r(c,e)&&u.push(e);while(n.length>s)r(c,e=n[s++])&&(~i(u,e)||u.push(e));return u}},f410:function(t,n,e){e("1af6"),t.exports=e("584a").Array.isArray},f772:function(t,n){t.exports=function(t){return"object"===typeof t?null!==t:"function"===typeof t}},ffc1:function(t,n,e){var r=e("5ca1"),o=e("504c")(!0);r(r.S,"Object",{entries:function(t){return o(t)}})}}]);
//# sourceMappingURL=chunk-84e7783c.3e6462ec.js.map