<template>
  <div>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon closable></el-alert>
      <el-row>
        <el-col :span="12">
          <span>商品分类</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  created () {
    this.getCateList()
  },
  data () {
    return {
      // 商品分类数据
      cateList: [],
      // 级联选择器属性
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 级联选择器选择的值
      selectedKeys: []
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const res = await axios.get('categories')
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data.data
      // this.total = res.data.data.total
    },
    // 监听级联选择器的变化
    handleChange () {
      console.log(this.selectedKeys)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  font-size: 12px;
}
.el-card {
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
  .el-row {
    margin-top: 15px;
    .el-cascader {
      margin-left: 10px;
    }
  }
  .el-table {
    margin-top: 15px;
    font-size: 12px;
  }
}
</style>
