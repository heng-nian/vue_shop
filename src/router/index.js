import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
import Welcome from "../components/Welcome.vue"

import Users from "../user/Users.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: Welcome, },
      { path: "/users", component: Users, }
    ]
  }
]

const router = new VueRouter({
  routes,
  // mode:"history"
})
router.beforeEach((to, from, next) => {
  //to 将访问路径
  //from 走哪路径来
  //放行
  if (to.path == '/login') return next();
  const token = window.sessionStorage.getItem("token")
  console.log(token);
  if (!token) return next("/login");
  next();
})
export default router
