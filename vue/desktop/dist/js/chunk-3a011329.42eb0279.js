(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3a011329"],{1169:function(t,e,r){var n=r("2d95");t.exports=Array.isArray||function(t){return"Array"==n(t)}},"11e9":function(t,e,r){var n=r("52a7"),a=r("4630"),i=r("6821"),o=r("6a99"),u=r("69a8"),c=r("c69a"),s=Object.getOwnPropertyDescriptor;e.f=r("9e1e")?s:function(t,e){if(t=i(t),e=o(e,!0),c)try{return s(t,e)}catch(r){}if(u(t,e))return a(!n.f.call(t,e),t[e])}},"37c8":function(t,e,r){e.f=r("2b4c")},"3a72":function(t,e,r){var n=r("7726"),a=r("8378"),i=r("2d00"),o=r("37c8"),u=r("86cc").f;t.exports=function(t){var e=a.Symbol||(a.Symbol=i?{}:n.Symbol||{});"_"==t.charAt(0)||t in e||u(e,t,{value:o.f(t)})}},"67ab":function(t,e,r){var n=r("ca5a")("meta"),a=r("d3f4"),i=r("69a8"),o=r("86cc").f,u=0,c=Object.isExtensible||function(){return!0},s=!r("79e5")((function(){return c(Object.preventExtensions({}))})),f=function(t){o(t,n,{value:{i:"O"+ ++u,w:{}}})},l=function(t,e){if(!a(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,n)){if(!c(t))return"F";if(!e)return"E";f(t)}return t[n].i},p=function(t,e){if(!i(t,n)){if(!c(t))return!0;if(!e)return!1;f(t)}return t[n].w},h=function(t){return s&&b.NEED&&c(t)&&!i(t,n)&&f(t),t},b=t.exports={KEY:n,NEED:!1,fastKey:l,getWeak:p,onFreeze:h}},"7bbc":function(t,e,r){var n=r("6821"),a=r("9093").f,i={}.toString,o="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],u=function(t){try{return a(t)}catch(e){return o.slice()}};t.exports.f=function(t){return o&&"[object Window]"==i.call(t)?u(t):a(n(t))}},"8a81":function(t,e,r){"use strict";var n=r("7726"),a=r("69a8"),i=r("9e1e"),o=r("5ca1"),u=r("2aba"),c=r("67ab").KEY,s=r("79e5"),f=r("5537"),l=r("7f20"),p=r("ca5a"),h=r("2b4c"),b=r("37c8"),y=r("3a72"),v=r("d4c0"),d=r("1169"),m=r("cb7c"),w=r("d3f4"),g=r("4bf8"),O=r("6821"),S=r("6a99"),j=r("4630"),x=r("2aeb"),E=r("7bbc"),N=r("11e9"),P=r("2621"),_=r("86cc"),$=r("0d58"),k=N.f,F=_.f,A=E.f,J=n.Symbol,B=n.JSON,D=B&&B.stringify,I="prototype",T=h("_hidden"),C=h("toPrimitive"),K={}.propertyIsEnumerable,L=f("symbol-registry"),M=f("symbols"),W=f("op-symbols"),R=Object[I],U="function"==typeof J&&!!P.f,Y=n.QObject,z=!Y||!Y[I]||!Y[I].findChild,G=i&&s((function(){return 7!=x(F({},"a",{get:function(){return F(this,"a",{value:7}).a}})).a}))?function(t,e,r){var n=k(R,e);n&&delete R[e],F(t,e,r),n&&t!==R&&F(R,e,n)}:F,Q=function(t){var e=M[t]=x(J[I]);return e._k=t,e},q=U&&"symbol"==typeof J.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof J},H=function(t,e,r){return t===R&&H(W,e,r),m(t),e=S(e,!0),m(r),a(M,e)?(r.enumerable?(a(t,T)&&t[T][e]&&(t[T][e]=!1),r=x(r,{enumerable:j(0,!1)})):(a(t,T)||F(t,T,j(1,{})),t[T][e]=!0),G(t,e,r)):F(t,e,r)},V=function(t,e){m(t);var r,n=v(e=O(e)),a=0,i=n.length;while(i>a)H(t,r=n[a++],e[r]);return t},X=function(t,e){return void 0===e?x(t):V(x(t),e)},Z=function(t){var e=K.call(this,t=S(t,!0));return!(this===R&&a(M,t)&&!a(W,t))&&(!(e||!a(this,t)||!a(M,t)||a(this,T)&&this[T][t])||e)},tt=function(t,e){if(t=O(t),e=S(e,!0),t!==R||!a(M,e)||a(W,e)){var r=k(t,e);return!r||!a(M,e)||a(t,T)&&t[T][e]||(r.enumerable=!0),r}},et=function(t){var e,r=A(O(t)),n=[],i=0;while(r.length>i)a(M,e=r[i++])||e==T||e==c||n.push(e);return n},rt=function(t){var e,r=t===R,n=A(r?W:O(t)),i=[],o=0;while(n.length>o)!a(M,e=n[o++])||r&&!a(R,e)||i.push(M[e]);return i};U||(J=function(){if(this instanceof J)throw TypeError("Symbol is not a constructor!");var t=p(arguments.length>0?arguments[0]:void 0),e=function(r){this===R&&e.call(W,r),a(this,T)&&a(this[T],t)&&(this[T][t]=!1),G(this,t,j(1,r))};return i&&z&&G(R,t,{configurable:!0,set:e}),Q(t)},u(J[I],"toString",(function(){return this._k})),N.f=tt,_.f=H,r("9093").f=E.f=et,r("52a7").f=Z,P.f=rt,i&&!r("2d00")&&u(R,"propertyIsEnumerable",Z,!0),b.f=function(t){return Q(h(t))}),o(o.G+o.W+o.F*!U,{Symbol:J});for(var nt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),at=0;nt.length>at;)h(nt[at++]);for(var it=$(h.store),ot=0;it.length>ot;)y(it[ot++]);o(o.S+o.F*!U,"Symbol",{for:function(t){return a(L,t+="")?L[t]:L[t]=J(t)},keyFor:function(t){if(!q(t))throw TypeError(t+" is not a symbol!");for(var e in L)if(L[e]===t)return e},useSetter:function(){z=!0},useSimple:function(){z=!1}}),o(o.S+o.F*!U,"Object",{create:X,defineProperty:H,defineProperties:V,getOwnPropertyDescriptor:tt,getOwnPropertyNames:et,getOwnPropertySymbols:rt});var ut=s((function(){P.f(1)}));o(o.S+o.F*ut,"Object",{getOwnPropertySymbols:function(t){return P.f(g(t))}}),B&&o(o.S+o.F*(!U||s((function(){var t=J();return"[null]"!=D([t])||"{}"!=D({a:t})||"{}"!=D(Object(t))}))),"JSON",{stringify:function(t){var e,r,n=[t],a=1;while(arguments.length>a)n.push(arguments[a++]);if(r=e=n[1],(w(e)||void 0!==t)&&!q(t))return d(e)||(e=function(t,e){if("function"==typeof r&&(e=r.call(this,t,e)),!q(e))return e}),n[1]=e,D.apply(B,n)}}),J[I][C]||r("32e9")(J[I],C,J[I].valueOf),l(J,"Symbol"),l(Math,"Math",!0),l(n.JSON,"JSON",!0)},"8cf0":function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("el-menu",{ref:"sideNavMenu",staticClass:"nav-menu",attrs:{"default-active":t.path,router:!0}},t._l(t.paths,(function(e,n){return r("el-menu-item",{key:n,attrs:{index:e.path}},[t._v("\n    "+t._s(e.name)+"\n  ")])})),1)},a=[],i=(r("ac4d"),r("8a81"),r("ac6a"),r("a481"),{name:"baseNavSideBar",props:{user:{type:Object}},data:function(){return{path:"/index",input:"",isAuthActive:!1,indexList:[],paths:[{path:"/index",name:"课程内容"},{path:"/notice",name:"课程公告"},{path:"/resources",name:"资源"},{path:"/exercise",name:"作业练习"},{path:"/exam",name:"考试"}]}},created:function(){this.baseURL="/course/"+this.$route.params.course_id;var t=!0,e=!1,r=void 0;try{for(var n,a=this.paths[Symbol.iterator]();!(t=(n=a.next()).done);t=!0){var i=n.value;i.path=this.baseURL+i.path}}catch(o){e=!0,r=o}finally{try{t||null==a.return||a.return()}finally{if(e)throw r}}this.path=this.$route.path.replace(/^((\/[^\/]+){3})(\/.+)/,"$1")},watch:{"$route.path":function(){this.$route.path.replace(/(\/[^\/]+)(\/+$)/g,"$1");this.path=this.$route.path.replace(/^((\/[^\/]+){3})(\/.+)/,"$1")}},methods:{}}),o=i,u=r("2877"),c=Object(u["a"])(o,n,a,!1,null,"186a4ee5",null);e["a"]=c.exports},9093:function(t,e,r){var n=r("ce10"),a=r("e11e").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return n(t,a)}},ac4d:function(t,e,r){r("3a72")("asyncIterator")},b505:function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("el-row",{attrs:{type:"flex",gutter:20}},[r("el-col",{attrs:{span:3}},[r("TheBaseNavSideBar")],1),r("el-col",{attrs:{span:21}},[r("router-view",{attrs:{user:t.user,courseID:t.$route.params.course_id},on:{"update:user":function(e){t.user=e}}})],1)],1)],1)},a=[],i=r("8cf0"),o={data:function(){return{}},props:{user:{type:Object,default:{}}},components:{TheBaseNavSideBar:i["a"]}},u=o,c=r("2877"),s=Object(c["a"])(u,n,a,!1,null,"1d683c4e",null);e["default"]=s.exports},d4c0:function(t,e,r){var n=r("0d58"),a=r("2621"),i=r("52a7");t.exports=function(t){var e=n(t),r=a.f;if(r){var o,u=r(t),c=i.f,s=0;while(u.length>s)c.call(t,o=u[s++])&&e.push(o)}return e}}}]);
//# sourceMappingURL=chunk-3a011329.42eb0279.js.map