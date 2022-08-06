<template>
  <el-dialog title="编辑角色" :visible="showRoleDialog" @close="close">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-row type="flex" justify="center">
        <el-button type="primary" size="mini" @click="btnOk">确认</el-button>
        <el-button size="mini">取消</el-button></el-row
      >
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    currentId: {
      type: String,
      default: null,
    },
  },
  methods: {
    async btnOk() {
      try {
        await assignRoles({
          id: this.currentId,
          roleIds: [],
        });
        this.$message.success("修改角色成功");
        this.close();
      } catch (error) {
        this.$message.success("修改角色失败");
        this.close();
      }
    },
    close() {
      this.roleIds = [];
      this.$emit("update:showRoleDialog", false);
    },
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList();
      this.list = rows;
      // console.log(this.list);
    },
    async getUserDetailById(id) {
      const { roleIds = [] } = await getUserDetailById(id);
      this.roleIds = roleIds;
      // console.log(this.roleIds);
    },
  },
  data() {
    return {
      list: [], // 角色列表
      roleIds: [],
    };
  },
  created() {
    this.getRoleList();
    // this.getUserDetailById();
  },
};
</script>
