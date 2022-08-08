<template>
  <div>
    <el-dialog title="新增员工" :visible="isShowAddEmpDialog" @close="close">
      <!-- 表单 -->
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            style="width: 80%"
            placeholder="请输入姓名"
            v-model="formData.username"
          />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            style="width: 80%"
            placeholder="请输入手机号"
            v-model="formData.mobile"
          />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            style="width: 80%"
            placeholder="请选择入职时间"
            v-model="formData.timeOfEntry"
          />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            v-model="formData.formOfEmployment"
            placeholder="请选择"
            style="80%"
          >
            <el-option
              v-for="item in seletOptipns"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            style="width: 80%"
            placeholder="请输入工号"
            v-model="formData.workNumber"
          />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-cascader
            v-model="formData.departmentName"
            :options="options"
            :props="{
              label: 'name',
              value: 'name',
              checkStrictly: true,
              emitPath: false,
            }"
            @focus="getDepartments"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            style="width: 80%"
            placeholder="请选择转正时间"
            v-model="formData.correctionTime"
          />
        </el-form-item>
      </el-form>
      <!-- footer插槽 -->
      <template v-slot:footer>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="close()">取消</el-button>
            <el-button type="primary" size="small" @click="btnOK"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </template>
    </el-dialog>
    <!-- <UploadExcel></UploadExcel> -->
  </div>
</template>

<script>
import EmployeeEnum from "@/api/constant/employees";
import { getDepartments } from "@/api/departments";
import { transListToTree } from "@/utils/index";
import { addEmployee } from "@/api/employees";
export default {
  name: "addEmployee",
  props: {
    isShowAddEmpDialog: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.getDepartments();
  },
  methods: {
    close() {
      this.$emit("update:isShowAddEmpDialog", false);
      this.$refs.formDataRef.resetFields();
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      };
    },
    async getDepartments() {
      const { depts } = await getDepartments();
      this.options = transListToTree(depts, "");
    },
    async btnOK() {
      // 校验表单
      await this.$refs.formDataRef.validate();
      await addEmployee(this.formData);
      // 提示成功
      this.$message.success("新增成功");
      // 关闭弹层
      this.close();
      // 获取调用父附件实例，直接调用父组件方法
      this.$parent.getEmployeeList();
    },
  },
  data() {
    return {
      seletOptipns: EmployeeEnum.hireType,
      options: [],
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
    };
  },
};
</script>

<style></style>
