<template>
  <div>
    <span class="filename">{{$route.params.filename}}</span>
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
        <!-- <span>{{currentPage}} / {{pageCount}}</span> -->
      </el-row>
      <el-row class="pdf-console">
        <el-col class="tools" :span="12">
          <i
            class="el-icon-edit"
            style="display: inline-block; margin-left: 1rem;cursor: pointer"
            title="铅笔"
            @click="selectPen"
          ></i>
          <el-color-picker
            size="small"
            title="选择颜色"
            v-model="penColor"
            :predefine="['#000', '#FF0000', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585']"
            style="margin-left: 1rem"
          ></el-color-picker>
          <div
            style="box-sizing: border-box; display: inline-block; margin-left: 1rem; padding: 0 15px; width: 120px; "
          >
            <el-slider v-model="penThickness" :min="1" :max="10" title="笔尖粗细"></el-slider>
          </div>
          <!-- <el-input-number
          size="small"
          v-model="currentPage"
          :min="1"
          :max="pageCount"
          style="margin-right: 1rem"
          ></el-input-number>-->
        </el-col>
        <el-col class="pagination" :span="3">
          <span>
            <span id="currentPage" contenteditable="true" @blur="gotoPage" @keydown="checkKeyCode">
              {{currentPage}}
            </span> / {{pageCount}}
          </span>
        </el-col>
        <el-col class="reading-progress" :span="8">
          <el-progress :percentage="readingProgress" :show-text="false"></el-progress>
        </el-col>
      </el-row>

      <el-row class="catalogue">
        <div class="prev">
          <i class="el-icon-arrow-left" @click="prev"></i>
        </div>
        <div class="catalogue-list-box">
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
        </div>

        <div class="next">
          <i class="el-icon-arrow-right" @click="next"></i>
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
      };
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
    },
    readingProgress() {
      return parseInt((this.currentPage / this.pageCount) * 100) || 0;
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
    checkKeyCode(event) {
      // 禁止除左右方向键，退格，删除，数字0-9以外的键入
      if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
        return null;
      }
      if ((event.keyCode >= 96 && event.keyCode <= 105) || (event.keyCode >= 48 && event.keyCode <= 57)) {
        return null;
      }
      event.preventDefault();
    },
    gotoPage(event) {
      const inputPageNum = parseInt(event.target.innerText);
      if (inputPageNum <= 0) {
        this.currentPage = 1;
      } else if (inputPageNum > 0 && inputPageNum < this.pageCount) {
        this.currentPage = inputPageNum;
      } else {
        this.currentPage = this.pageCount;
      }
    },
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

      this.context.moveTo(
        e.pageX - this.canvasOffset.x,
        e.pageY - this.canvasOffset.y
      );
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
.filename {
  display: block;
  padding: 1rem;
  text-align: center;
  font-size: 1.4rem;
}

.pdf-main {
  position: relative;
  border: 1px solid #eee;

  span {
    position: absolute;
    display: block;
    top: 5px;
    right: 5px;
    padding: 5px 10px;
    background-color: rgba($color: #555, $alpha: 0.1);
    border-radius: 10px;
    z-index: 999;
  }
}

.pdf-console {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  height: 2rem;
  font-size: 1.5rem;
  background-color: #f8f8f8;
  border: 1px solid #eee;

  .tools {
    display: flex;
    align-items: center;
  }

  .pagination {
    font-size: 1rem;
  }
}

.catalogue {
  box-sizing: border-box;
  display: table;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #eee;

  .prev,
  .next {
    display: table-cell;
    width: 40px;
    text-align: center;
    vertical-align: middle;
    font-size: 30px;
    font-weight: bold;
    background-color: #f1f1f1;

    i {
      cursor: pointer;
    }
  }

  .catalogue-list-box {
    overflow: hidden;
    background-color: #eee;

    .catalogue-list {
      display: table-cell;
      transition: all 0.5s ease;

      .catalogue-item {
        box-sizing: border-box;
        display: inline-block;
        width: 20%;
        vertical-align: top;
        border: 4px solid #fff;
        background-color: #eee;
      }

      .catalogue-item-active {
        border-color: #409eff;
      }
    }
  }
}
</style>
