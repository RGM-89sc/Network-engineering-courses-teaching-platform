(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-420df9dc"],{"8aa7":function(e,t,r){"use strict";var s=r("c4b6"),c=r.n(s);c.a},a334:function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("el-row",{staticClass:"header"},[r("el-col",{attrs:{span:12}},[r("span",{staticClass:"course-name"},[e._v(e._s(e.coursename))])]),e.user&&1===e.user.userType&&e.user.id===e.tchID?r("el-col",{staticClass:"toolsbar"},[r("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.$router.push({path:e.$route.path+"/addExercisePaper"})}}},[e._v("新增试卷")])],1):e._e()],1),0===e.exercisePapers.length?r("el-row",{staticClass:"no-exercise-paper"},[r("span",[e._v("暂无作业")])]):e._e(),r("el-row",e._l(e.exercisePapers,(function(t){return r("el-card",{key:t.exerciseID,staticClass:"exercise-paper"},[r("el-row",[r("el-col",{attrs:{span:18}},[r("span",{staticClass:"exercise-name",on:{click:function(r){return e.$router.push({path:e.$route.path+"/exercisePaper?id="+t.exerciseID})}}},[e._v(e._s(t.exerciseName))])]),e.user&&1===e.user.userType?r("el-col",{staticStyle:{"text-align":"right"},attrs:{span:6}},[r("el-button",{attrs:{type:"text"},on:{click:function(r){return e.$router.push({path:e.$route.path+"/editExercisePaper?id="+t.exerciseID})}}},[e._v("编辑")]),r("el-button",{attrs:{type:"text"},on:{click:function(r){return e.delExercisePaper(t.exerciseID)}}},[e._v("删除")])],1):e._e()],1),r("el-row",[r("el-col",[r("span",{staticClass:"created-time"},[e._v("创建时间："+e._s(e.$dayjs(t.created).format("YYYY-MM-DD")))])])],1)],1)})),1)],1)},c=[],a=r("915c"),n={data:function(){return{courseID:"",coursename:"",exercisePapers:[],tchID:""}},props:{user:{type:Object,default:{}}},created:function(){this.courseID=this.$route.params.course_id,this.coursename=window.sessionStorage.getItem("exercises.current_coursename"),this.getTchID(),this.getExercisePapers()},methods:{getTchID:function(){var e=this;a["b"].getCourseDetail({courseID:this.courseID}).then((function(t){1===t.data.code&&(e.tchID=t.data.data.tchID),-1===t.data.code&&console.log("获取课程对应的教师ID失败")})).catch((function(e){console.log(e)}))},getExercisePapers:function(){var e=this;a["d"].getExercisePapers({courseID:this.courseID}).then((function(t){1===t.data.code&&(e.exercisePapers=t.data.data)})).catch((function(e){console.log(e)}))},delExercisePaper:function(e){var t=this;this.$confirm("此操作将删除该作业, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){a["d"].delExercisePaper({courseID:t.courseID,exerciseID:e}).then((function(e){1===e.data.code&&t.$router.push({path:"/emptyPage"}),-1===e.data.code&&(t.$alert("发生了错误导致删除失败","删除失败",{confirmButtonText:"确定"}),console.log(e.data.errMsg))})).catch((function(e){console.log(e)}))})).catch((function(e){}))}}},o=n,i=(r("8aa7"),r("2877")),u=Object(i["a"])(o,s,c,!1,null,"faa691fe",null);t["default"]=u.exports},c4b6:function(e,t,r){}}]);
//# sourceMappingURL=chunk-420df9dc.9b0997a7.js.map