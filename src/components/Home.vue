<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu
          default-active="2"
          :unique-opened="true"
          :router="true"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <component
            :is="menu.children.length > 0 ? 'el-submenu' : 'el-menu-item'"
            v-for="(menu, index) in menusList"
            :key="menu.id"
            :index="index.toString()"
          >
            <template slot="title">
              <i :class="'iconfont icon-' + iconList[index]"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item v-for="submenu in menu.children" :key="submenu.id" :index="submenu.path">
              <i class="el-icon-menu"></i>
              <span>{{submenu.authName}}</span>
            </el-menu-item>
          </component>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  methods: {
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.menusList = res.data
    },
    logout() {
      this.$confirm('确定要退出系统吗？', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  },
  data() {
    return {
      menusList: [],
      iconList: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    padding-right: 20px;

    .logo-box {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 22px;

      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
