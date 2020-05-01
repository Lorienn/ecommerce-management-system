<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo_2.png" />
        <span>Element电商后台管理系统</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边导航栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-btn" @click="toggleCollapse"><i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i></div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="this.activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :index="'' + item.id" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="child in item.children" :index="'/' + child.path" :key="child.id" @click="saveActivePath('/' + child.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{child.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios'
export default {
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.activePath
  },
  data () {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    // 注销
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单数据
    async getMenuList () {
      const res = await axios.get('menus')
      if (res.data.meta.status !== 200) { return this.$message.error(res.data.meta.msg) }
      this.menuList = res.data.data
    },
    // 折叠侧边导航栏
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存侧边导航栏高亮状态
    saveActivePath (activePath) {
      window.sessionStorage.activePath = activePath
      this.activePath = activePath
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-header {
    background: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 15px;
    div {
      display: flex;
      align-items: center;
      span {
        margin-left: 10px;
        font-size: 18px;
        color: #fff;
      }
    }
  }
  .el-aside {
    background: #333744;
    .toggle-btn {
      font-size: 16px;
      line-height: 24px;
      color: #fff;
      background: #4a5064;
      text-align: center;
      cursor: pointer;
    }
    .el-menu {
      border-right: 0;
      .iconfont {
        margin-right: 10px;
      }
    }
  }
  .el-main {
    background: #eaedf1;
  }
}
</style>
