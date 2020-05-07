<template>
  <div>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <el-card class="box-card">
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isValid" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="handle">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        layout="total, prev, pager, next, jumper"
        :page-size="queryInfo.pagesize"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" @close="addDialogClose">
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            clearable
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
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
      // 商品分类列表请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 8
      },
      // 商品分类总数
      total: 0,
      // 商品分类列表
      cateList: [],
      // 树形表格的列属性
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isValid',
          width: '80px'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
          width: '80px'
        },
        {
          label: '操作',
          type: 'template',
          template: 'handle',
          width: '200px'
        }
      ],
      // 添加分类对话框是否显示
      addDialogVisible: false,
      // 添加分类表单对象
      addForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 级联选择器属性
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: true,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选择的值
      selectedKeys: []
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const res = await axios.get('categories', {
        params: this.queryInfo
      })
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data.data.result
      this.total = res.data.data.total
    },
    // 监听pagenum的变化
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 显示添加分类对话框
    showAddDialog () {
      this.addDialogVisible = true
      this.getParentCateList()
    },
    // 获取父级分类数据
    async getParentCateList () {
      const res = await axios.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = res.data.data
    },
    // 监听选中父级分类的变化
    parentCateChange () {
      if (this.selectedKeys.length > 0) {
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addForm.cat_level = this.selectedKeys.length
      } else {
        this.addForm.cat_pid = this.addForm.cat_level = 0
      }
    },
    // 关闭对话框时重置表单
    addDialogClose () {
      this.$refs.addForm.resetFields()
      this.selectedKeys = []
      this.addForm.cat_pid = this.addForm.cat_level = 0
    },
    // 添加分类
    addCate () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        const res = await axios.post('categories', this.addForm)
        if (res.data.meta.status !== 201) { return this.$message.error('添加分类失败') }
        this.$message.success('添加成功')
        this.getCateList()
        this.addDialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.zk-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-cascader {
  width: 100%;
}
</style>
