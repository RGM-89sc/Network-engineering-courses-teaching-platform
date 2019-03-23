<template>
  <div>
    <span>{{$route.params.filename}}</span>
    [{{currentPage}} / {{pageCount}}]
    <PDFViewerSkeleton v-if="!pdfLoaded"/>
    <div
      class="pdf-viewer"
      :style="{ 'visibility': pdfLoaded ? 'visible' : 'hidden', 'transform': `translateY(${pdfLoaded ? '0' : '-200%'})` }"
    >
      <el-row class="pdf-main">
        <pdf
          ref="pdf"
          :src="src"
          :page="currentPage"
          style="background-color: #eee;"
          @error="pdfError"
        ></pdf>
      </el-row>

      <el-row class="pdf-console" type="flex" justify="center">
        <el-input-number size="small" v-model="currentPage" :min="1" :max="pageCount"></el-input-number>

        <i class="el-icon-edit" style="cursor: pointer" title="铅笔" @click="selectPen"></i>
        <el-color-picker size="small" title="选择颜色" v-model="penColor" :predefine="['#000', '#FF0000', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']"></el-color-picker>
        <div style="display: inline-block; width: 120px; box-sizing: border-box; padding: 0 15px;">
          <el-slider v-model="penThickness" :min="1" :max="10" title="笔尖粗细"></el-slider>
        </div>
      </el-row>

      <el-row class="catalogue">
        <div
          class="catalogue-list"
          :style="{transform: `translateX(calc(-20% * ${catalogueItemOffsetPage - 1}))`}"
        >
          <a
            :href="'#' + pageNumber"
            v-for="pageNumber in pageCount"
            :key="pageNumber"
            @click="changePage(pageNumber)"
          >
            <pdf
              ref="catalogueItem"
              :src="src"
              :page="pageNumber"
              class="catalogue-item"
              :class="{ 'catalogue-item-active': currentPage === pageNumber }"
              @page-loaded="pageLoaded(pageNumber)"
              @error="pdfError"
            ></pdf>
          </a>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf';
import PDFViewerSkeleton from '../../components/skeleton/PDFViewer';

export default {
  data() {
    return {
      src: pdf.createLoadingTask(
        `${this.$serverBaseUrl}/static/courseware/${
          this.$route.params.filename
        }`
      ),
      loading: null,
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
    this.loading = this.$loading({
      lock: true,
      text: '正在绘制图像，请耐心等待',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    this.src.then(pdf => {
      this.pageCount = pdf.numPages;

      // 获取当前url hash，作为当前要加载的页面
      const hash = this.$route.hash;
      if (hash) {
        this.currentPage = parseInt(hash.replace('#', ''));
        this.currentOffset =
          this.currentPage - (this.pageCount - this.currentPage) - 2;
      }

      window.onresize = () => {
        // bug: 修正后的值依然错误，但canvasOffset确实被成功修改了的
        this.canvasOffset = this.getElementPosition(this.canvas);
      }
    });
  },
  computed: {
    catalogueItemOffsetPage() {
      let offset = 1;
      if (this.currentPage <= 3) {
        // 前3张
        // do nothing
      }
      if (this.currentPage > 3 && this.currentPage < this.pageCount - 1) {
        // 中间
        offset = this.currentPage - 2;
        this.currentOffset = offset;
      }
      if (this.currentPage >= this.pageCount - 1) {
        // 后两张
        if (this.currentOffset > 3 && this.currentOffset < this.pageCount - 1) {
          offset = this.pageCount - 4;
        } else {
          offset = this.currentOffset;
        }
      }
      return offset;
    }
  },
  watch: {
    currentPage(newPageNum, oldPageNum) {
      if (this.$route.hash !== '#' + newPageNum) {
        this.$router.push({
          path: this.$route.params.filename,
          hash: '#' + newPageNum
        });
      }

      // 禁用涂鸦
      this.canDraw = false;
    },

    penColor(newColor, oldColor) {
      this.context.strokeStyle = newColor;
    },
    penThickness(newThickness, oldThickness) {
      this.context.lineWidth = newThickness;
    }
  },
  props: {
    user: {
      type: Object,
      default: {}
    }
  },
  methods: {
    getElementPosition(element) {
      let x = 0,
        y = 0;
      while (element != null) {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      }
      return { x, y };
    },
    selectPen() {
      this.canDraw = true;
      this.context.strokeStyle = this.penColor;
      this.context.lineWidth = this.penThickness;
      this.canvasOffset = this.getElementPosition(this.canvas);
    },
    startDrawing(e) {
      this.isDrawing = true;
      // 创建一个新的绘图路径
      this.context.beginPath();
      // 把画笔移动到鼠标位置
      
      this.context.moveTo(e.pageX - this.canvasOffset.x, e.pageY - this.canvasOffset.y);
    },
    stopDrawing() {
      this.isDrawing = false;
    },
    draw(e) {
      if (this.isDrawing && this.canDraw) {
        // 找到鼠标最新位置
        const x = e.pageX - this.canvasOffset.x;
        const y = e.pageY - this.canvasOffset.y;
        // 画一条直线到鼠标最新位置
        this.context.lineTo(x, y);
        this.context.stroke();
      }
    },
    prev() {
      if (this.currentPage > 1) {
        this.currentPage--;
      } else {
      }
    },
    next() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      } else {
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
    },
    pageLoaded(pageNum) {
      this.progress = parseInt((pageNum / this.pageCount) * 100);
      if (this.pdfLoaded === false && this.progress === 100) {
        setTimeout(() => {
          // annotationLayer层会覆盖canvas，事件无法被激活，所以隐藏
          this.$refs.pdf.$refs.annotationLayer.style.display = 'none';
          this.canvas = this.$refs.pdf.$refs.canvas;
          this.context = this.canvas.getContext('2d');
          this.canvas.onmousedown = this.startDrawing;
          this.canvas.onmouseup = this.stopDrawing;
          this.canvas.onmouseout = this.stopDrawing;
          this.canvas.onmousemove = this.draw;

          this.pdfLoaded = true;
          this.$nextTick(() => {
            this.loading.close();
          });
        }, 150 * this.pageCount);
      }
    },
    pdfError(err) {
      console.log(err);
    }
  },
  components: {
    pdf,
    PDFViewerSkeleton
  }
};
</script>

<style lang="scss" scoped>
.catalogue {
  overflow: hidden;
  white-space: nowrap;

  .catalogue-list {
    transition: all 0.5s ease;

    .catalogue-item {
      display: inline-block;
      width: 20%;
      vertical-align: top;
      box-sizing: border-box;
      border: 4px solid #fff;
      background-color: #eee;
    }

    .catalogue-item-active {
      border-color: #409eff;
    }
  }
}
</style>
