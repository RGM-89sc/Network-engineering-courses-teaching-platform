<template>
  <div class="base-tag" @click="handleClick" :style="styleColor" :class="classList">
    <slot name="default"></slot>
    <md-icon v-if="closable" name="close" @click.stop="handleClose" size="sm"></md-icon>
  </div>
</template>

<script>
  export default {
    props: {
      closable: {
        type: Boolean,
        default: false,
      },
      size: {
        //normal medium small mini
        type: String,
        default: 'normal'
      },
      type: {
        //success info danger warning
        type: String,
        default: ''
      },
      color: {
        type: String,
        default: ''
      },
      font: {
        type: String,
        default: ''
      },
      hit: {
        type: Boolean,
        default: false
      },
      effect: {
        type: String,
        default: ''
      }
    },
    computed: {
      styleColor() {
        return this.color && `background-color: ${this.color}; color: ${this.font};`  
      },
      classList() {
        return this.size === 'medium' ? 
          'base-tag__medium' : this.size === 'small' ? 
          'base-tag__small' : this.size === 'mini' ? 
          'base-tag__mini' : '';

      }
    },
    methods: {
      handleClick(event) {
        this.$emit('click',event);
      },
      handleClose(event) {
        this.$emit('close',event)
      }
    }
  }
</script>

<style lang="scss" scoped>
.base-tag {
    background-color: #f8f9fa;
    display: inline-block;
    height: 2rem;
    padding: 0.35rem 0.5rem;
    line-height: 1.5;
    font-size: 0.75rem;
    color: #212529;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
}
.base-tag__medium {
  height: 1.75rem;
  line-height: 1.5;
  padding: 0.25rem;
}
.base-tag__mini {
  height: 1rem;
  line-height: 1rem;

  padding: 0 .5rem;
}
</style>