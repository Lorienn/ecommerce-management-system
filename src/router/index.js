import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Welcome from '@/views/Home/Welcome'
import Users from '@/views/Home/User/Users'
import Roles from '@/views/Home/Right/Roles'
import Rights from '@/views/Home/Right/Rights'
import Goods from '@/views/Home/Goods/Goods'
import Add from '@/views/Home/Goods/Add'
import Params from '@/views/Home/Goods/Params'
import Categories from '@/views/Home/Goods/Categories'
import Orders from '@/views/Home/Order/Orders'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods/add',
          component: Add
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/orders',
          component: Orders
        }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.token
  if (!tokenStr) return next('/login')
  next()
})

export default router
