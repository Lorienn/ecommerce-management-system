<template>
  <div>
    <!-- 头部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <el-card class="box-card">
      <!-- 搜索订单 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @change="getOrderList"
            clearable
            @clear="getOrderList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="150px"></el-table-column>
        <el-table-column label="是否付款" width="80px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="80px"></el-table-column>
        <el-table-column label="下单时间" width="200px">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="this.addressVisible = true"
            ></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgress"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressClose">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressForm" label-width="100px">
        <el-form-item label="省市区(县)" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="address-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import cityData from './citydata'
export default {
  created () {
    this.getOrderList()
  },
  data () {
    return {
      // 搜索订单信息
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },
      // 订单列表
      orderList: [],
      // 订单总数
      total: 0,
      // 是否显示修改地址对话框
      addressVisible: false,
      // 修改地址表单
      addressForm: {
        address1: [],
        address2: ''
      },
      // 修改地址表单规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区(县)', trigger: 'change' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 城市数据
      cityData,
      // 是否显示物流进度对话框
      progressVisible: false,
      // 物流进度信息
      progressInfo: []
    }
  },
  methods: {
    // 获取订单列表数据
    async getOrderList () {
      const res = await axios.get('orders', {
        params: this.queryInfo
      })
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = res.data.data.goods
      this.total = res.data.data.total
    },
    // 监听分页器变化
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 修改地址对话框关闭时重置表单
    addressClose () {
      this.$refs.addressForm.resetFields()
    },
    // 显示物流进度对话框
    async showProgress () {
      const res = await axios.get('/kuaidi/804909574412544580')
      if (res.data.meta.status !== 200) {
        return this.$message.error('获取物流进度失败')
      }
      this.progressInfo = res.data.data
      this.progressVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
