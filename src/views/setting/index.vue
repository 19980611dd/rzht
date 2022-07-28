<template>
  <div class="container">
    <el-card
      ><el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="first">
          <!-- 新增角色按钮 -->
          <el-row style="height: 60px">
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="showDialog = true"
              >新增角色</el-button
            >
          </el-row>
          <!-- 表格 -->
          <el-table :data="list" style="width: 100%">
            <el-table-column label="序号" width="180" type="index">
            </el-table-column>
            <el-table-column label="角色名称" width="180" prop="name">
            </el-table-column>
            <el-table-column label="描述" prop="description" />
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="edit(row.id)"
                  >编辑</el-button
                >
                <el-button size="small" type="danger" @click="del(row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" margin-top="20px">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="page.total"
              :page-size="page.pagesize"
              :current-page="page.page"
              @current-change="changePage"
            >
            </el-pagination>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司设置" name="second">
          <el-card>
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            >
            </el-alert>
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.name"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.companyAddress"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="formData.mailbox"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                  v-model="formData.remarks"
                />
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="`${roleFormData.id ? ' 编辑' : '新增'}角色`"
      :visible.sync="showDialog"
      @close="close"
    >
      <el-form
        :model="roleFormData"
        :rules="roleRules"
        label-width="120px"
        ref="roleForm"
      >
        <el-form-item label="角色" prop="name">
          <el-input v-model="roleFormData.name"
        /></el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleFormData.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk"
          >确定</el-button
        ></template
      >
    </el-dialog>
  </div>
</template>
<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  updateRole,
  getRoleDetail,
  addRole,
} from "@/api/setting";
export default {
  data() {
    return {
      showDialog: false,
      roleFormData: {
        name: "",
        description: "",
      },
      roleRules: {
        name: [
          {
            required: true,
            message: "角色必填",
            trigger: "blur",
          },
        ],
      },
      activeName: "first",
      page: {
        pagesize: 5,
        page: 1,
        total: 0,
      },
      list: [],
      formData: {},
    };
  },
  methods: {
    async getRolesList() {
      const { rows, total } = await getRoleList(this.page);
      this.list = rows;
      this.page.total = total;
    },
    changePage(page) {
      this.page.page = page;
      this.getRolesList();
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.$store.getters.companyId);
    },
    async del(id) {
      const len = this.list.length;
      await this.$confirm("确认删除？");
      await deleteRole(id);
      this.$message.success("删除成功");
      if (len === 1 && this.page.page > 1) {
        this.page.page--;
      }
      this.getRolesList();
    },
    close() {
      this.showDialog = false;
      this.$refs.roleForm.resetFields();
      this.roleFormData = {
        name: "",
        description: "",
      };
    },
    async edit(id) {
      this.showDialog = true;
      this.roleFormData = await getRoleDetail(id);
    },
    async btnOk() {
      await this.$refs.roleForm.validate();
      if (this.roleFormData.id) {
        await updateRole(this.roleFormData);
      } else {
        await addRole(this.roleFormData);
        this.$message.success("成功");
        this.getRolesList();
        this.close();
      }
      this.$message.success("成功");
      this.getRolesList();
      this.close();
    },
  },
  created() {
    this.getCompanyInfo();
    this.getRolesList();
  },
};
</script>

<style>
.container {
  padding: 20px;
}
.el-dialog__footer {
  text-align: center;
}
</style>
