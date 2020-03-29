<template>
  <div class="gray-bg">
    <Card round>
      <span class="title">{{$route.params.filename}}</span>
      <md-activity-indicator class="loading" :size="25" :text-size="16" vertical v-show="loading">正在绘制图像，请耐心等待</md-activity-indicator>
      <div
        class="pdf-viewer"
        :style="{ 'visibility': pdfLoaded ? 'visible' : 'hidden', 'transform': `translateY(${pdfLoaded ? '0' : '-200%'})` }"
      >
        <div class="pdf-main">
          <pdf
            class="pdf-page"
            ref="pdf"
            v-for="i in pageCount"
            :key="i"
            :src="src"
            :page="i"
            style="background-color: #eee;"
            @page-loaded="pageLoaded(i)"
            @error="pdfError"
          ></pdf>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from '@/components/Card';
import pdf from 'vue-pdf';

export default {
  data() {
    return {
      src: pdf.createLoadingTask(
        `${this.$serverBaseUrl}/static/courseware/${this.$route.params.course_id}/${
          this.$route.params.filename
        }`
      ),
      loading: true,
      currentPage: 1,
      pageCount: 0,
      progress: 0,
      pdfLoaded: false,
      currentOffset: 1,

      isDrawing: false,
      canvas: null,
      context: null,
      canvasOffset: {},
      canDraw: false,
      penColor: '#000',
      penThickness: 1
    };
  },
  created() {
    this.loading = true;

    this.src.then(pdf => {
      this.pageCount = pdf.numPages;
    });
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  methods: {
    pageLoaded(pageNum) {
      this.progress = parseInt((pageNum / this.pageCount) * 100);
      if (this.pdfLoaded === false && this.progress === 100) {
        setTimeout(() => {
          this.pdfLoaded = true;
          this.$nextTick(() => {
            this.loading = false;
          });
        }, 200 * this.pageCount);
      }
    },
    pdfError(err) {
      console.log(err);
    }
  },
  components: {
    Card,
    pdf
  }
};
</script>

<style lang="scss" scoped>
.title {
  display: block;
  padding: 1rem;
  text-align: center;
}

.loading {
  margin-top: 2rem;
}

.pdf-page {
  margin-bottom: 1rem;
}
</style>
