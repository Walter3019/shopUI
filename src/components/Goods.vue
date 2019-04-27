<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="querycdt.query"
            placeholder="请输入搜索内容"
            clearable
            @clear="search()"
            @keyup.enter.native="search()"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table ref="goodsListForm" :data="goodsList" border style="width: 100%">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="产品名称"></el-table-column>
        <el-table-column prop="goods_weight" label="产品重量" width="120"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="120">
          <template slot-scope="info">{{info.row.add_time | timeFormatter}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-tooltip effect="dark" content="更改商品信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除商品信息" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="querycdt.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecord"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsList()
  },
  methods: {
    handleSizeChange(val) {
      this.querycdt.pagesize = val

      this.getGoodsList()
    },

    handleCurrentChange(val) {
      this.querycdt.pagenum = val
      this.getGoodsList()
    },

    async getGoodsList() {
      const { data: dt } = await this.$http.get('/goods', {
        params: this.querycdt
      })

      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }

      console.log(dt)

      this.goodsList = dt.data.goods
      this.totalRecord = dt.data.total
    }
  },
  filters: {
    timeFormatter(value) {
      return value
    }
  },
  data() {
    return {
      goodsList: [],
      totalRecord: 0,
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 5
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>