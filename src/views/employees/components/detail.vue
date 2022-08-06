<template>
  <div>
    <el-card class="container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录账户设置" name="first">
          <el-form
            :model="formData"
            :rules="rules"
            class="form"
            label-width="120px"
            ref="formRef"
          >
            <el-form-item label="姓名" prop="username">
              <el-input
                v-model="formData.username"
                style="width: 40%"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password2">
              <el-input v-model="formData.password2" style="width: 40%">
              </el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="password2">
              <el-button type="primary" @click="updateUserInfo">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second"
          ><component :is="userInfo"></component
        ></el-tab-pane>
        <el-tab-pane label="岗位信息" name="third"
          ><component :is="jobInfo"></component
        ></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
// import 组件对象 from 'vue文件路径'
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
import userInfo from "@/views/employees/components/userInfo.vue";
import jobInfo from "@/views/employees/components/jobInfo.vue";
export default {
  name: "app",
  // 组件
  components: {
    userInfo,
    jobInfo,
  },
  data() {
    return {
      userInfo: "userInfo",
      jobInfo: "jobInfo",
      formData: {
        username: "",
        password2: "",
      },
      rules: {
        name: {
          required: true,
          message: "请输入账号",
          trigger: "blur",
        },
        password: {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
      },
      activeName: "first",
    };
  },
  //方法
  methods: {
    async getUserInfo() {
      this.formData = await getUserDetailById(this.$route.params.id);
    },
    async updateUserInfo() {
      await this.$refs.formRef.validate();
      try {
        await saveUserDetailById({
          ...this.formData,
          pasword: this.formData.password2,
        });
        this.$message("更新成功");
      } catch (error) {
        this.$message.error(error.message || "更新失败");
      }
    },
  },
  //计算
  computed: {},
  created() {
    this.getUserInfo();
    console.log(this);
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.container {
  margin-top: 20px;
}
.form {
  margin-top: 40px;
}
</style>
