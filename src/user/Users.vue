<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInof.query" clearable @clear="getUserList(1)">
            <el-button slot="append" icon="el-icon-search" @click="getUserList(1)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <!-- <h3 @click="log(scope)">?</h3> -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-button
              @click="showEditDialog(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteConfirm(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              :enterable="false"
              placement="top"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInof.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInof.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>用户
    <!-- 添加用户 对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose('addFormRef')"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 低部区 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser('addFormRef')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="addDialogClose('editFormRef')"
    >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo('editFormRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    let checkMobile = (rule, value, cb) => {
      let reg = /^1[0-9]{10}$/
      if (!reg.test(value)) return cb(new Error("请输入11位的手机号码"));
      cb();
    }
    return {
      queryInof: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur", },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur", },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
    }
  },
  created() {
    console.log(this.editFormRules);
    this.getUserList();
  },
  methods: {

    async getUserList(page) {
      if (page) { this.queryInof.pagenum = page }
      const { data: res } = await this.$http.get("users", {
        params: this.queryInof
      })
      if (res.meta.status !== 200) return this.$message.error("获取用户列表失败");
      this.userlist = res.data.users
      this.total = res.data.total
    },
    log(data) {
      console.log(data);
    },
    handleSizeChange(newSize) {
      this.queryInof.pagesize = newSize
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInof.pagenum = newPage
      this.getUserList();
    },
    async userStateChanged(row) {
      let { data: res } = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state;
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      console.log(res);
    },
    addDialogClose(name) { this.$refs[name].resetFields() },
    addUser(name) {
      this.$refs[name].validate(async (valid) => {//校验
        if (!valid) return false;
        let { data: res } = await this.$http.post("/users", this.addForm);
        if (res.meta.status != 201) return this.$message.error(res.meta.msg);
        this.addDialogVisible = false;
        this.$message.success(res.meta.msg);
        this.getUserList();
      })
    },
    async showEditDialog(id) {
      let { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.editForm = res.data
      this.editDialogVisible = true;
    },
    editUserInfo(name) {
      this.$refs[name].validate(async (valid) => {//校验
        if (!valid) return false;
        let { data: res } = await this.$http.put("/users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile });
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.editDialogVisible = false;
        this.$message.success(res.meta.msg);
        this.getUserList();
      })
    },
    deleteConfirm(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: res } = await this.$http.delete(`/users/${id}`);
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.getUserList();
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>
</style>