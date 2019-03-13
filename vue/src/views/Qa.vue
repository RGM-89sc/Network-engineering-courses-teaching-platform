<template>
  <div class="qa">
    <component :is="currentTab" @changeTab="changeTab"></component>
  </div>
</template>

<script>
import QaView from '@/components/QaView';
import QaDetails from '@/components/QaDetails';
export default {
  name:'qa',
  data(){
    return {
      currentTab:"QaView"
    }
  },
  components: {
    QaView,
    QaDetails
  },
  methods:{
    changeTab(tab){
      this.currentTab = tab;
    }
  }
}
</script>

<style lang="scss" scoped>
  .qa{
    width:1100px;
    margin: 0 auto;
  }
</style>
