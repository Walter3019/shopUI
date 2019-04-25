<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdt.query"
            class="input-with-select"
            clearable
            @clear="search"
            @keyup.enter.native="search()"
          >
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addUserDialog = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column label="序号" type="index" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="140"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="60">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="item">
            <el-tooltip
              class="item"
              effect="dark"
              content="更改用户信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditUser(item.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(item.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="modifyRole(item.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%" @close="handleCancelDialog()">
      <el-form ref="addUserForm" :model="addUserModel" :rules="addUserRules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addUserModel.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addUserModel.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addUserModel.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addUserModel.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelDialog()">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDialog()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editUserDialog" width="50%">
      <el-form ref="editUserForm" :model="editUserModel" :rules="addUserRules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="editUserModel.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editUserModel.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editUserModel.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelEdit()">取 消</el-button>
        <el-button type="primary" @click="handleConfirmEdit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editRoleDialog" width="50%">
      <el-form :mobel="editRoleModel" :rules="roleRules">
        <el-form-item label="当前的用户:" :label-width="'120px'">
          <span>{{editRoleModel.username}}</span>
        </el-form-item>
        <el-form-item label="当前的角色:" :label-width="'120px'">
          <span>{{editRoleModel.currentRole}}</span>
        </el-form-item>
        <el-form-item label="分配新角色:" :label-width="'120px'">
          <el-select v-model="editRoleModel.role" placeholder="请选择活动区域">
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelRole()">取 消</el-button>
        <el-button type="primary" @click="handleConfirmRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  methods: {
    async handleConfirmRole() {
      // console.log(this.editRoleModel.userId, this.editRoleModel.currentRoleId)
      const reqData = {
        id: this.editRoleModel.userId,
        rid: this.editRoleModel.role
      }

      const { data: dt } = await this.$http.put(
        `users/${this.editRoleModel.userId}/role`,
        reqData
      )

      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }

      this.$message.success(dt.meta.msg)
      this.getUserList()
      this.editRoleDialog = false
    },

    handleCancelRole() {
      this.editRoleDialog = false
    },

    async modifyRole(id) {
      const { data: dt } = await this.$http.get('/roles')

      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.message)
      }

      this.roleList = dt.data

      const { data: userInfo } = await this.$http.get('/users/' + id)

      const roleInfo = this.roleList.find(role => {
        return role.id === userInfo.data.rid
      })

      if (roleInfo !== undefined) {
        this.editRoleModel.currentRoleId = roleInfo.id
        this.editRoleModel.currentRole = roleInfo.roleName
      }

      this.editRoleModel.userId = userInfo.data.id
      this.editRoleModel.username = userInfo.data.username

      this.editRoleDialog = true
    },

    deleteUser(id) {
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: dt } = await this.$http.delete('/users/' + id)

          if (dt.meta.status !== 200) {
            return this.$message.success(dt.meta.msg)
          } else {
            this.querycdt.pagenum = 1
            this.getUserList()

            // 如果当前页只有一条数据，那么请给页码做减一操作(前提是当前页码大于1页)
            if (this.userList.length === 1 && this.querycdt.pagenum > 1) {
              this.querycdt.pagenum--
            }

            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    async showEditUser(id) {
      const { data: dt } = await this.$http.get('/users/' + id)
      // console.log(dt)

      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      } else {
        this.editUserModel = dt.data
      }

      this.editUserDialog = true
    },

    handleCancelEdit() {},

    handleConfirmEdit() {
      this.$confirm('修改用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // console.log(this.editUserModel)
          const { data: dt } = await this.$http.put(
            '/users/' + this.editUserModel.id,
            this.editUserModel
          )

          if (dt.meta.status !== 200) {
            return this.$message.success(dt.meta.msg)
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getUserList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          })
        })
    },

    handleConfirmDialog() {
      this.$refs.addUserForm.validate(async valid => {
        if (!valid) {
          this.$message.error('用户名和密码必须填写')
        } else {
          // console.log(this.addUserModel)

          const { data: dt } = await this.$http.post(
            '/users',
            this.addUserModel
          )

          if (dt.meta.status === 400) {
            this.$message.error(dt.meta.msg)
          } else if (dt.meta.status === 201) {
            this.$message.success(dt.meta.msg)
            this.addUserDialog = false
          }
        }
      })
    },

    handleCancelDialog() {
      this.$refs.addUserForm.resetFields()
      this.addUserDialog = false
    },

    search() {
      this.getUserList()
    },

    handleSizeChange(val) {
      this.querycdt.pagesize = val

      this.getUserList()
    },

    handleCurrentChange(val) {
      this.querycdt.pagenum = val

      this.getUserList()
    },

    async getUserList() {
      const { data: dt } = await this.$http.get('/users', {
        params: this.querycdt
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }

      this.tot = dt.data.total

      this.tableData = dt.data.users
    }
  },
  data() {
    var checkMobile = (rule, value, cb) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        return cb(new Error('手机号码格式不正确'))
      }
      cb()
    }
    return {
      // dialog config
      addUserDialog: false,
      editUserDialog: false,
      editRoleDialog: false,
      formLabelWidth: '120px',
      // user Model and Rules
      addUserModel: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '用户名必须填写', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码必须填写', trigger: 'blur' }
        ],
        email: [{ required: true, message: '邮箱必须填写', trigger: 'blur' }]
      },
      // edit user
      editUserModel: {
        id: 0,
        username: '',
        password: '',
        email: '',
        mobile: '',
        rid: 0
      },
      editUserRules: {
        email: [{ required: true, message: '邮箱必须填写', trigger: 'blur' }]
      },
      editRoleModel: {
        roleName: '',
        userName: ''
      },
      roleRules: {},
      tableData: [],
      roleList: [],
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      tot: 0
    }
  }
}
</script>

<style lang="less" scoped>
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409eff;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
