<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-table :data="rightsList" border stripe style="width: 100%">
        <el-table-column label="序号" type="index" width="200"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path" width="160"></el-table-column>
        <el-table-column label="等级" prop="level" width="160">
          <template slot-scope="info">
            <el-tag v-if="info.row.level == 0">一级</el-tag>
            <el-tag v-else-if="info.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: dt } = await this.$http.get('rights/list')

      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }

      this.rightsList = dt.data
    }
  },
  data() {
    return {
      rightsList: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>