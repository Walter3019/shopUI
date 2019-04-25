<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%">
      <el-form ref="addUserForm" :model="addUserModel" :rules="rules">
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
        <el-form-item label="haha" :label-width="'120px'" prop="haha">
          <el-select v-model="addUserModel.region" placeholder="请选择活动区域">
            <el-option v-for="(label, item) in labels" :label="label" :value="label" :key="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelDialog()">取 消</el-button>
        <el-button type="primary" @click="handleConfirmDialog()">确 定</el-button>
      </span>
    </el-dialog>

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
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(item.row)"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配用户"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  methods: {
    editUser(info) {
      console.log(info)
    },

    handleConfirmDialog() {
      this.$refs.addUserForm.validate(async valid => {
        if (!valid) {
          this.$message.error('用户名和密码必须填写')
        } else {
          console.log(this.addUserModel)

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
      console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }

      this.tot = dt.data.total

      this.tableData = dt.data.users
    },

    setSelected(id) {
      this.whichSelect = id
      console.log(this.whichSelect)
    }
  },
  data() {
    return {
      labels: [1, 2, 3],
      whichSelect: 0,
      addUserModel: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名必须填写', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码必须填写', trigger: 'blur' }
        ],
        email: [{ required: true, message: '邮箱必须填写', trigger: 'blur' }],
        haha: [{ required: true, message: 'hhaa', trigger: 'blur' }]
      },
      tableData: [],
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      tot: 0,
      addUserDialog: false,
      formLabelWidth: '120px'
    }
  }
}
</script>

<style lang="less" scoped>
</style>
