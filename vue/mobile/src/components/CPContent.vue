<template>
  <div class="content">
    <div class="block" v-for="(t, index) in template" :key="index">
      <div v-if="typeof(t) === 'string'" v-html="t"></div>
      <CPCTemplate v-else :el="t"></CPCTemplate>
    </div>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css';
import { videoPlayer } from 'vue-video-player';

export default {
  data() {
    return {
      template: []
    };
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  created() {
    this.slice(this.content);
  },
  methods: {
    slice(content) {
      const normal_regex = /https?:\/\/.+\.mp4/gi;
      const youku_regex = /https?:\/\/v\.youku\.com\/v_show\/id_(.+)\.html/gi;

      function gen_youku_template(url) {
        return `<iframe style="width: 100%" src="http://player.youku.com/embed/${url}" frameborder=0 'allowfullscreen'></iframe>`;
      }

      const split = content.split(
        /(<figure class="media"><oembed url="https?:\/\/.+\.mp4"><\/oembed><\/figure>|<figure class="media"><oembed url="https?:\/\/v\.youku\.com\/v_show\/id_.+\.html"><\/oembed><\/figure>)/gi
      );

      split.forEach(p => {
        if (!p) {
          return null;
        }
        let m;
        if ((m = youku_regex.exec(p)) !== null) {
          return this.template.push(gen_youku_template(m[1]));
        }
        if ((m = p.match(normal_regex)) !== null) {
          return this.template.push({
            tag: 'videoPlayer',
            data: {
              props: {
                options: {
                  language: 'zh-CN',
                  playbackRates: [0.7, 1.0, 1.5, 2.0],
                  fluid: true,
                  preload: 'auto',
                  sources: [
                    {
                      type: 'video/mp4',
                      src: m[0]
                    }
                  ]
                },
              }
            }
          });
        }
        this.template.push(p);
      });
    }
  },
  components: {
    videoPlayer,
    CPCTemplate: {
      functional: true,
      props: {
        el: {
          type: Object,
          required: true
        }
      },
      render: function(createElement, content) {
        return createElement(
          content.props.el.tag,
          JSON.parse(JSON.stringify(content.props.el.data))
        );
      }
    }
  }
};
</script>

<style scoped>
.block {
  margin-bottom: 30px;
}

.content {
  word-break: break-all;
}
</style>

<style lang="scss">
figure {
  text-align: center;

  img {
    max-width: 100%;
  }
}
</style>
