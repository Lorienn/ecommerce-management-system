import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login'
// import Home from '@/views/Home'
// import Welcome from '@/views/Home/Welcome'
// import Users from '@/views/Home/User/Users'
// import Roles from '@/views/Home/Right/Roles'
// import Rights from '@/views/Home/Right/Rights'
// import Goods from '@/views/Home/Goods/Goods'
// import Add from '@/views/Home/Goods/Add'
// import Params from '@/views/Home/Goods/Params'
// import Categories from '@/views/Home/Goods/Categories'
// import Orders from '@/views/Home/Order/Orders'
// import Reports from '@/views/Home/Report/Reports'

// 按需引入路由（实现路由懒加载）
const Login = () => import(/* webpackChunkName: "login_home" */ '@/views/Login')
const Home = () => import(/* webpackChunkName: "login_home" */ '@/views/Home')
const Welcome = () => import(/* webpackChunkName: "welcome_user_right" */ '@/views/Home/Welcome')
const Users = () => import(/* webpackChunkName: "welcome_user_right" */ '@/views/Home/User/Users')
const Roles = () => import(/* webpackChunkName: "welcome_user_right" */ '@/views/Home/Right/Roles')
const Rights = () => import(/* webpackChunkName: "welcome_user_right" */ '@/views/Home/Right/Rights')
const Goods = () => import(/* webpackChunkName: "goods" */ '@/views/Home/Goods/Goods')
const Add = () => import(/* webpackChunkName: "goods" */ '@/views/Home/Goods/Add')
const Params = () => import(/* webpackChunkName: "goods" */ '@/views/Home/Goods/Params')
const Categories = () => import(/* webpackChunkName: "goods" */ '@/views/Home/Goods/Categories')
const Orders = () => import(/* webpackChunkName: "order_report" */ '@/views/Home/Order/Orders')
const Reports = () => import(/* webpackChunkName: "order_report" */ '@/views/Home/Report/Reports')

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
        },
        {
          path: '/reports',
          component: Reports
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
