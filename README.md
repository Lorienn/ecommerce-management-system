

##  Element后台管理系统

> 一个基于Vue的电商后台管理系统，采用前后端分离的开发模式。项目使用的前端技术栈有Vue、vue-router、Element-UI、Axios、Echarts等。



### 技术选型

前端技术栈：

- Vue
- Vue-router
- Element-UI
- Axios
- Echarts



### 业务功能

![struc](https://seanboy.club/uploads/images/2020-05-09~10-29-22~struc.png)
------



### 与功能相关的技术点

#### 1.用户登录

- 用户登录成功后，客户端通过```sessionStorage```和```token```记住其登陆状态并维持。

  ![](https://gitee.com/wBekvam/vue-shop-admin/raw/master/image/mall_desc04.png)

- 通过路由导航守卫```router.beforeEach```控制用户访问权限。防止尚未登录的用户试图通过URL访问除登录页面之外的其他页面。

  ![login](https://seanboy.club/uploads/images/2020-05-09~10-29-22~login.png)



#### 2.主页布局

- 布局
  - 通过```Element-UI```组件库实现主页的页面布局。
  - 使用```<el-menu>```实现侧边导航栏，并在```sessionStorage```中添加activePath属性以保持导航栏高亮状态。
  - 侧边导航栏的icon使用了```Iconfont```阿里矢量图标库。
- 数据请求
  - 通过```Axios```请求接口数据，并为axios请求拦截器添加token，保证获取数据的权限。
  - 使用```NProgress```进度条展示页面载入（数据请求）进度。



#### 3.用户管理-用户列表

- 使用```<el-form>```完成添加用户表单，自定义表单校验规则，并实现表单的重置、提交前预校验。

- 使用作用域插槽```slot-scope```获取组件数据并自定义渲染模板。

  ![users](https://seanboy.club/uploads/images/2020-05-09~10-29-22~users.png)



#### 4.权限管理

- 角色列表

  - 使用三层```v-for```循环分别渲染角色的一、二、三级权限。

  - 使用```<el-tree>```树形控件展示角色可分配权限列表。

  ![roles](https://seanboy.club/uploads/images/2020-05-09~10-29-22~roles.png)

- 权限列表

  ![rights](https://seanboy.club/uploads/images/2020-05-09~10-29-22~rights.png)


#### 5.商品管理

- 商品列表

  - 使用全局过滤器```Vue.filter```自定义Date对象的显示格式。

  ![goods](https://seanboy.club/uploads/images/2020-05-09~10-29-22~goods.png)
  
- 添加商品

  - 使用```<el-steps>```步骤条组件引导用户按照流程填写添加商品表单。
  - 使用```<el-upload>```组件以便用户上传商品图片。
  - 使用```vue-quill-editor```富文本编辑器以便用户填写商品内容。

  - 使用```<el-form>```完成添加商品表单，自定义表单校验规则，并实现表单提交前预校验。

  ![add](https://seanboy.club/uploads/images/2020-05-09~10-29-22~add.png)

  ![editor](https://seanboy.club/uploads/images/2020-05-09~10-29-22~editor.png)

- 分类参数

  ![params](https://seanboy.club/uploads/images/2020-05-09~10-29-22~params.png)

- 商品分类

  - 使用```vue-table-with-tree-grid```树形表格组件展示一、二、三级商品分类。

  ![categories](https://seanboy.club/uploads/images/2020-05-09~10-29-22~categories.png)


#### 6.订单管理-订单列表

- 使用```<el-timeline>```时间线组件展示订单的物流信息。

  ![orders](https://seanboy.club/uploads/images/2020-05-09~10-29-22~orders.png)

  ![timeline](https://seanboy.club/uploads/images/2020-05-09~10-29-22~timeline.png)



#### 7.数据统计-数据报表

- 使用```Echarts```展示用户来源数据报表。

  ![reports](https://seanboy.club/uploads/images/2020-05-09~10-29-22~reports.png)

------



### 项目依赖

###### 运行依赖

> - axios => 发送请求
> - echarts => 图表
> - element-ui => Element-UI组件库
> - lodash => 深拷贝与对象合并
> - nprogress => 进度条
> - vue-quill-editor => 富文本编辑器
> - vue-table-with-tree-grid => 树形表格

###### 开发依赖

> - babel => ES6语法转换
> - eslint/babel-eslint => 语法检查
> - sass/sass-loader => sass语法
> - babel-plugin-transform-remove-console => 生产环境移除console
> - @babel/plugin-syntax-dynamic-import => 路由懒加载



### 项目优化

###### 1.生成打包报告

通过Vue UI可视化面板查看打包报告，分析如何优化/压缩体积过大的文件。

![report](https://seanboy.club/uploads/images/2020-05-09~10-29-22~report.png)


###### 2.配置Webpack

- 通过`chainWebpack`为开发模式与发布模式指定不同的打包入口文件

  > 1. 开发模式入口文件    src/main-dev.js
  >2. 发布模式入口文件    src/main-prod.js
  > 
  
- 生产环境下，将部分体积过大的第三方库使用`CDN`引入

  > 默认情况下，通过import语法导入的第三方依赖包最终都会打包合并到同一个文件中，从而导致打包成功后单文件体积过大的问题。
  >
  > 为了解决上述问题，可以通过Webpack的`externals`节点来配置需要加载外部CDN资源的依赖。凡是声明在externals中的第三方依赖包都将不会被打包。

- 通过插件定制不同环境的首页内容（如开发模式使用import导入依赖包，而发布模式使用CDN引入）

  ```js
  // Vue.config.js
  config.plugin('html').tap(args => {
      args[0].isProd = true/false
      return args
  })
  ```

  ```html
  <!-- index.html -->
  <title><%= htmlWebpackPlugin.options.isProd ? '' : 'dev-' %>Element后台管理系统</title>
  <% if(htmlWebpackPlugin.options.isProd) { %>
      此处为CDN引入的第三方资源
  <% } %>
  ```



###### 3.路由懒加载

  > 打包项目时，体积过大的js包会影响页面加载速度。
  >
  > 使用`@babel/plugin-syntax-dynamic-import`插件，并将路由改为按需加载的形式。当路由被访问的时候才会加载对应组件。



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
