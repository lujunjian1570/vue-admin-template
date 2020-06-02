import { constantRoutes } from '@/router'
import { getList } from '@/api/table'
import Layout from '@/layout'

const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getList().then(res => {
          let d = [{
            path: '/form',
            component: 'Layout',
            children: [
              {
                path: 'index',
                name: 'Form',
                component: 'form/index',
                meta: { title: 'Form', icon: 'form' }
              }
            ]
          },{
            path: '/nested',
            component: 'Layout',
            redirect: '/nested/menu1',
            name: 'Nested',
            meta: {
              title: 'Nested',
              icon: 'nested'
            },
            children: [
              {
                path: 'menu1',
                component: 'nested/menu1/index',
                redirect: '/nested/menu1/menu1-1',
                name: 'Menu1',
                meta: { title: 'Menu1' },
                children: [
                  {
                    path: 'menu1-1',
                    component: 'nested/menu1/menu1-1',
                    name: 'Menu1-1',
                    meta: { title: 'Menu1-1' }
                  },
                  {
                    path: 'menu1-2',
                    component: 'nested/menu1/menu1-2',
                    redirect: '/nested/menu1/menu1-2/menu1-2-1',
                    name: 'Menu1-2',
                    meta: { title: 'Menu1-2' },
                    children: [
                      {
                        path: 'menu1-2-1',
                        component: 'nested/menu1/menu1-2/menu1-2-1',
                        name: 'Menu1-2-1',
                        meta: { title: 'Menu1-2-1' }
                      },
                      {
                        path: 'menu1-2-2',
                        component: 'nested/menu1/menu1-2/menu1-2-2',
                        name: 'Menu1-2-2',
                        meta: { title: 'Menu1-2-2' }
                      }
                    ]
                  },
                  {
                    path: 'menu1-3',
                    component: 'nested/menu1/menu1-3',
                    name: 'Menu1-3',
                    meta: { title: 'Menu1-3' }
                  }
                ]
              },
              {
                path: 'menu2',
                component: 'nested/menu2/index',
                name: 'Menu2',
                meta: { title: 'menu2' }
              }
            ]
          }]
          const accessedRoutes = filterAsyncRouter(d)
          accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
      })
    }
  }
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}
export const loadView = (view) => { // 路由懒加载
  return (resolve) =>  require([`@/views/${view}`], resolve)
}
export default permission
