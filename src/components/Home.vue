<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 导航菜单 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="this.$route.path"
          background-color="#323744"
          text-color="#fff"
          active-text-color="#369bff"
        >
          <el-submenu
            v-for="(item, index) in menuList"
            :key="item.id"
            :index="index + ''"
          >
            <template slot="title">
              <i :class="'iconfont ' + iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :index="'/' + child.path"
              :key="child.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{ child.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      iconObj: {
        125: "icon-user",
        103: "icon-tijikongjian",
        101: "icon-shangpin",
        102: "icon-danju",
        145: "icon-baobiao",
      },
      isCollapse: false,
    }
  },
  async created() {

    const { data: res } = await this.$http.get('menus')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
    this.menuList = res.data
    // console.log(res);
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login")
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373c41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  color: #fff;
  align-items: center;
  div {
    height: 100%;
    display: flex;
    align-items: center;
    img {
      height: 100%;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #323744;

  transition: width 0.3s;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf2;
}
.iconfont {
  margin-right: 16px;
}
.toggle-button {
  background-color: #485064;
  color: #fff;
  text-align: center;
  line-height: 24px;
  font-size: 10px;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>