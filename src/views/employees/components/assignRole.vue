<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="close">
    1234
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit("update:showRoleDialog", false);
    },
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList();
      this.list = rows;
      console.log(this.list);
    },
  },
  data() {
    return {
      list: [], // 角色列表
    };
  },
  created() {
    this.getRoleList();
  },
};
</script>
