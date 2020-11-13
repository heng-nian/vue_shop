<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo" />
      </div>

      <el-form
        class="login_form"
        :rules="formRules"
        :model="loginForm"
        ref="formRef"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item class="btn">
          <el-button type="primary" @click="submit('formRef')">登录</el-button>
          <el-button type="info" @click="reset('formRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      formRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur", },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur", },
        ],
      },
    };
  },
  methods: {
    submit(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return false;
        this.$http.post('login', this.loginForm).then((data) => {
          if (data.data.meta.status != 200) return this.$message.error(data.data.meta.msg)
          this.$message.success(data.data.meta.msg);
          window.sessionStorage.setItem("token", data.data.data.token);
          this.$router.push("/home")
        })
      });

    },
    reset(name) {
      this.$refs[name].resetFields()
    }
  },
};
</script>

<style lang="less" scoped>
/*
  lang属性里less
    这代表标签里面支持less语法
  scoped属性
    这代表样式只对这个组件生效，也就是局部样式
    如果没有加上这个，就是全局样式，可能导致组件冲突
    也就是，样式冲突；
*/
.position_center() {
  //less语法
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    .position_center;
  }
  .avatar_box {
    .position_center;
    top: -100%;
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>