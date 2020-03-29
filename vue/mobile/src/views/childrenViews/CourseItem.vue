<template>
  <div>

    <md-tab-bar ref="subNav" v-model="current" :items="items" @change="onChange" class="sub-nav"/>

    <router-view :user.sync="user" :courseID="$route.params.course_id"></router-view>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      items: [
        { name: "index", label: "课程内容", path: "/index" },
        { name: "resources", label: "课件资源", path: "/resources" },
        { name: "exercise", label: "作业练习", path: "/exercise" },
        { name: "exam", label: "考试", path: "/exam" }
      ], 
      current: this.$route.path.replace(/^((\/[^\/]+){3})(\/.+)/,'$1').split("/")[3],
      path: ''
    };
  },
  created() {
  },
  watch: {
    '$route.path': function() {
      this.current = this.$route.path.replace(/^((\/[^\/]+){3})(\/.+)/,'$1').split("/")[3];
    }
  },
  methods: {
    onChange(item, index, prevIndex) {
      this.$router.push({  path: `/course/${this.$route.params.course_id}${item.path}`});
    }
  }
};
</script>

<style lang="scss" scoped>
.sub-nav {
  margin: -1rem 0 0rem 0;
  padding: 0;
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
}
</style>