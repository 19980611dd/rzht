<template>
  <div class="dashboard-container">
    <div class="app-container">
      <toolBar>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermissions('0', 1)"
            >添加权限</el-button
          >
        </template>
        <!-- 表格 -->
        <!-- 表格 -->
      </toolBar>
      <el-table :data="list" border row-key="id">
        <el-table-column align="center" label="序号" type="index" width="100" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermissions(row.id, 2)"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹层 -->
    <el-dialog
      :title="`${title}权限`"
      :visible.sync="dialogVisible"
      width="50%"
      @close="close"
    >
      <el-form
        :model="formData"
        :rules="rules"
        label-width="120px"
        ref="formDataRef"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnOK">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import toolBar from "@/components/toolBar";
import {
  getPermissionList,
  addPermission,
  delPermission,
  updatePermission,
  getPermissionDetail,
} from "@/api/permission";
import { transListToTree } from "@/utils";
export default {
  nane: "toolBar",
  components: {
    toolBar,
  },
  created() {
    this.getPermissionList();
  },
  computed: {
    title() {
      return this.formData.id ? "编辑" : "新增";
    },
  },
  methods: {
    async editPermission(id) {
      const res = await getPermissionDetail(id);
      this.formData = res;
      this.dialogVisible = true;
    },
    async delPermission(id) {
      await this.$confirm("确认删除");
      await delPermission(id);
      this.$message.success("删除成功");
      await this.getPermissionList();
    },
    async btnOK() {
      try {
        await this.$refs.formDataRef.validate();
        if (this.formData.id) {
          // 编辑
          await updatePermission(this.formData);
        } else {
          // 新增
          await addPermission(this.formData);
          this.$message.success(`新增权限点成功`);
          this.close();
          await this.getPermissionList();
        }
        this.$message.success(`${this.title}权限点成功`);
      } catch (error) {
        console.log(error);
        this.$message.error("添加权限点失败");
      }
    },
    async getPermissionList() {
      this.list = transListToTree(await getPermissionList(), "0");
      console.log(this.list);
    },
    addPermissions(pid, type) {
      this.formData.pid = pid;
      this.formData.type = type;
      this.dialogVisible = true;
    },
    close() {
      this.$refs.formDataRef.resetFields();
      this.formData = {
        name: "",
        code: "",
        description: "",
        enVisible: "1",
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
      };
      this.dialogVisible = false;
    },
  },
  data() {
    return {
      // 需要展示的数据
      list: [],
      dialogVisible: false,
      formData: {
        name: "",
        code: "",
        description: "",
        enVisible: "1",
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
};
</script>
<style></style>
