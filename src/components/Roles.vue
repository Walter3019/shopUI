<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <el-table :data="rolesData" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row
              v-for="firstLevel in props.row.childrens"
              :key="firstLevel.id"
              class="firstLevel"
              type="flex"
              justify="center"
              align="middle"
            >
              <el-col :span="5">
                <el-tag
                  type
                  closable
                  @close="delRights(props.row, firstLevel.id)"
                >{{firstLevel.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="secondLevel in firstLevel.children"
                  :key="secondLevel.id"
                  type="flex"
                  justify="center"
                  align="middle"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRights(props.row, secondLevel.id)"
                    >{{secondLevel.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="tag in secondLevel.children"
                      :key="tag.id"
                      closable
                      type="warning"
                      @close="delRights(props.row, tag.id)"
                    >{{tag.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="item">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditUser(item.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(item.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="modifyRole(item.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加角色" :visible.sync="addRoleDialog" width="50%" @close="handleCancelDialog()">
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelDialog()">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDialog()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="角色分配"
      :visible.sync="setRoleDialog"
      width="50%"
      @opened="setRoleOpen()"
      @close="resetRoleDialog()"
    >
      <el-form ref="distributeForm" :model="distributeModel">
        <el-form-item>
          <p>{{roleDetail.authName}}</p>
        </el-form-item>
        <el-form-item>
          <el-tree
            :data="allRights"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="roleTree"
            heighlight-current
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelModifyRights()">取 消</el-button>
        <el-button type="primary" @click="confirmModifyRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  created() {
    this.getRolesList()
    this.getRolesAllList()
  },
  methods: {
    resetRoleDialog() {
      this.$refs.roleTree.setCheckedKeys([])
    },

    confirmModifyRights() {
      const idsArr = [
        ...this.$refs.roleTree.getCheckedKeys(),
        ...this.$refs.roleTree.getHalfCheckedKeys()
      ]

      const ids = idsArr.toString()

      this.$http
        .post(`roles/${this.roleDetail.id}/rights`, { rids: ids })
        .then(({ data: dt }) => {
          this.getRolesList()
        })
    },

    delRights(row, id) {
      // console.log(row, id)
      this.$confirm('此操作将永久角色权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete(
            `roles/${row.id}/rights/${id}`
          )

          row.childrens = dt.data
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    setCheckedNodes(whichRole) {
      this.$refs.roleTree.setCheckedNodes(whichRole)
    },

    setRoleOpen() {
      this.$refs.roleTree.setCheckedKeys([])

      const whichRole = this.rolesData.find(item => {
        return item.id === this.roleDetail.id
      })

      // console.log('main', whichRole.childrens[0].children[0])

      const arrRole = []

      whichRole.childrens.map(item => {
        item.children.map(item1 => {
          item1.children.map(item2 => {
            if (item2 !== undefined) {
              arrRole.push({ id: item2.id })
            }
          })
        })
      })

      console.log(arrRole)

      this.setCheckedNodes(arrRole)
    },

    modifyRole(role) {
      this.setRoleDialog = true
      this.roleDetail = role
    },

    async getRolesList() {
      const { data: dt } = await this.$http.get('/roles')

      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }

      console.log(dt.data)

      let handleData = dt.data.map(item => {
        return {
          id: item.id,
          roleDesc: item.roleDesc,
          roleName: item.roleName,
          childrens: item.children
        }
      })

      delete dt.data.children

      this.rolesData = handleData
    },

    async getRolesAllList() {
      const { data: dt } = await this.$http.get('/rights/tree')

      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }

      this.allRights = dt.data
    }
  },
  data() {
    return {
      addRoleDialog: false,
      setRoleDialog: false,
      distributeModel: {},
      roleDetail: {},
      rolesData: [],
      allRights: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.firstLevel:nth-of-type(1) {
  border-bottom: 1px solid rgb(235, 238, 245);
  border-top: 1px solid rgb(235, 238, 245);
}

.firstLevel {
  border-bottom: 1px solid rgb(235, 238, 245);
}

.el-tag {
  margin: 10px;
}
</style>