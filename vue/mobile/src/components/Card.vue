<template>
  <div
    class="card"
    :class="{ 'is-always-shadow': shadow === 'always', 'is-hover-shadow': shadow === 'hover', 'border': border, 'round': round }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    border: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: String,
      default: 'never'
    },
  }
};
</script>

<style lang="scss" scoped>
.card {
  margin: 0 1rem 1rem;
  padding: 1rem;
  background-color: #fff;
  overflow: hidden;
}

.border {
  border: 1px solid #ddd;
}

.round {
  border-radius: 0.3rem;
}

.is-always-shadow,
.is-hover-shadow:focus,
.is-hover-shadow:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
