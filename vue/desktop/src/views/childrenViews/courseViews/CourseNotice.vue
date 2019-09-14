<template>
  <div>
    <el-dialog
      title="公告"
      :visible.sync="isBulletinShow"
      :close-on-click-modal="false"
      width="30%"
      :before-close="handleBulletinHidden"
    >
      <el-form
        label-position="top"
        label-width="80px"
        :model="newBulletin"
        :rules="newBulletinRules"
        ref="newBulletinForm"
        v-if="user.userType === 1 && user.id === courseDetail.tchID"
      >
        <el-form-item label="发表新公告" prop="content">
          <el-input
            type="textarea"
            resize="none"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="newBulletin.content"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addBulletin('newBulletinForm')"
            >发布</el-button
          >
        </el-form-item>
      </el-form>
      <div class="bulletins">
        <el-collapse v-model="activeBulletinNames">
          <el-collapse-item
            v-for="(bulletin, index) in courseDetail.bulletins"
            :key="index"
            :title="$dayjs(bulletin.created).format('YYYY/MM/DD HH:mm:ss')"
            :name="index"
          >
            <p class="bulletin-content">{{ bulletin.content }}</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>