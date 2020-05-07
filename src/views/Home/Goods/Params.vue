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
      <!-- 选择商品分类 -->
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
      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddDialog"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyList" style="width: 100%" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="$event.target.blur"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="showAddDialog"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyList" style="width: 100%" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="$event.target.blur"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="`添加${dialogText}`"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 添加参数表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="100px">
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="`修改${dialogText}`"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 修改参数表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px">
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
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
      // 商品分类
      cateList: [],
      // 级联选择器属性
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 级联选择器选择的值
      selectedKeys: [],
      // 当前激活的标签页名称
      activeName: 'many',
      // 添加参数对话框是否显示
      addDialogVisible: false,
      // 添加参数表单
      addForm: {
        attr_name: ''
      },
      // 添加参数表单规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 修改参数对话框是否显示
      editDialogVisible: false,
      // 添加参数表单
      editForm: {
        attr_name: ''
      },
      // 添加参数表单规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 动态参数
      manyList: [],
      // 静态属性
      onlyList: []
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
    },
    // 获取参数列表数据
    async getParamsList () {
      const res = await axios.get(
        `categories/${this.selectedKeys[2]}/attributes`,
        {
          params: {
            sel: this.activeName
          }
        }
      )
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyList = res.data.data
      } else {
        this.onlyList = res.data.data
      }
    },
    // 监听级联选择器的变化
    handleChange () {
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = this.manyList = this.onlyList = []
        return
      }
      this.getParamsList()
    },
    // 监听tab标签页的切换
    handleTabClick () {
      this.getParamsList()
    },
    // 显示添加参数对话框
    showAddDialog () {
      this.addDialogVisible = true
    },
    // 重置添加参数表单
    addDialogClose () {
      this.$refs.addForm.resetFields()
    },
    // 提交添加参数表单
    addParams () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return
        const res = await axios.post(
          `categories/${this.selectedKeys[2]}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.data.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.getParamsList()
      })
    },
    // 显示修改参数对话框
    async showEditDialog (id) {
      const res = await axios.get(
        `categories/${this.selectedKeys[2]}/attributes/${id}`,
        {
          attr_sel: this.activeName
        }
      )
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.editForm = res.data.data
      this.editDialogVisible = true
    },
    // 重置修改参数表单
    editDialogClose () {
      this.$refs.editForm.resetFields()
    },
    // 提交修改参数表单
    editParams () {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return
        const res = await axios.put(
          `categories/${this.selectedKeys[2]}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.data.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改成功')
        this.editDialogVisible = false
        this.getParamsList()
      })
    },
    // 删除参数
    removeParams (id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await axios.delete(
          `categories/${this.selectedKeys[2]}/attributes/${id}`
        )
        if (res.data.meta.status !== 200) {
          return this.$message.error('删除参数失败')
        }
        this.$message.success('删除成功')
        this.getParamsList()
      })
    },
    // 显示添加标签输入框
    showInput (row) {
      row.inputVisible = true
      // 使文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 保存标签列表变化
    async saveAttrVals (row) {
      const res = await axios.put(
        `categories/${this.selectedKeys[2]}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.data.meta.status !== 200) {
        return this.$message.error('添加失败')
      }
    },
    // 添加新标签
    handleInputConfirm (row) {
      if (!row.inputValue.trim()) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    // 删除标签
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 是否禁用添加参数按钮
    isBtnDisabled () {
      return this.selectedKeys.length !== 3
    },
    // 动态计算添加参数对话框文本
    dialogText () {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-top: 15px;
  .el-cascader {
    margin-left: 10px;
  }
}
.el-tabs {
  margin-top: 15px;
  font-size: 12px;
}
.el-table {
  .el-tag {
    margin-left: 10px;
  }
  .el-input.input-new-tag {
    width: 120px;
    margin-left: 10px;
  }
  .el-button.button-new-tag {
    margin-left: 10px;
  }
}
</style>
