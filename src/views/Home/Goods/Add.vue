<template>
  <div>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <el-card class="box-card">
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="+activeIndex" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 添加商品表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="top">
        <!-- 左侧tab导航栏 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="tabBeforeLeave"
          @tab-click="tabClick"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyList" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(val, i) in item.attr_vals" :key="i" :label="val" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyList" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
    ref="myQuillEditor"
    v-model="addForm.goods_introduce"
  />
  <el-button type="primary" class="add-btn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog :visible.sync="previewVisible" width="30%">
      <img :src="previewURL" />
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
      // 当前处于激活状态的的步骤
      activeIndex: '0',
      // 添加商品表单
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        attrs: [],
        pics: [],
        goods_introduce: ''
      },
      // 添加商品表单规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ]
      },
      // 商品分类
      cateList: [],
      // 级联选择器属性
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 动态参数
      manyList: [],
      // 静态属性
      onlyList: [],
      // 商品图片上传地址
      uploadURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
      // 商品图片上传请求头
      headerObj: {
        Authorization: window.sessionStorage.token
      },
      // 商品图片预览URL
      previewURL: '',
      // 是否显示商品图片预览对话框
      previewVisible: false
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
    // 监听级联选择器的变化
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 监听tab切换1
    tabBeforeLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 监听tab切换2
    async tabClick () {
      // 获取商品分类的动态参数
      if (this.activeIndex === '1') {
        const res = await axios.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        res.data.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyList = res.data.data
      } else if (this.activeIndex === '2') {
        // 获取商品分类的静态属性
        const res = await axios.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.data.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        this.onlyList = res.data.data
      }
    },
    // 商品图片上传成功
    handleSuccess (response) {
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    // 商品图片预览效果
    handlePreview (file) {
      this.previewURL = file.response.data.url
      this.previewVisible = true
    },
    // 商品图片删除效果
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const fileIndex = this.addForm.pics.findIndex(
        item => item.pic === filePath
      )
      this.addForm.pics.splice(fileIndex, 1)
    },
    // 添加商品
    addGoods () {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项')
        const form = JSON.parse(JSON.stringify(this.addForm))
        form.goods_cat = form.goods_cat.join(',')
        this.manyList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        const res = await axios.post('goods', form)
        if (res.data.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      return this.addForm.goods_cat.length === 3
        ? this.addForm.goods_cat[2]
        : null
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tabs {
  margin-top: 30px;
  .el-tab-pane {
    padding-left: 20px;
    .el-checkbox {
      margin: 10px 10px 0 0 !important;
    }
    .add-btn {
      margin-top: 15px;
    }
  }
}
.el-dialog {
  img {
    width: 100%;
  }
}
</style>
