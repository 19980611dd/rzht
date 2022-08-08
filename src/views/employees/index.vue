<template>
  <div class="dashboard-container">
    <div class="app-container">
      <toolBar>
        <!-- 左边插槽 -->
        <template #before>
          <span>员工记录</span>
        </template>
        <!-- 右边插槽 -->
        <template #after>
          <el-button size="mini" type="primary" @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button size="mini" type="danger" @click="exportToExcel"
            >导出</el-button
          >
          <el-button
            size="mini"
            type="warning"
            @click="isShowAddEmpDialog = true"
            >新增员工</el-button
          >
        </template>
      </toolBar>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="list/">
            <el-table-column label="姓名" sortable="" prop="username" />
            <!-- <el-table-column label="头像" sortable="" prop="workNumber" /> -->
            <el-table-column label="头像">
              <template v-slot="{ row }">
                <el-avatar
                  style="width: 80px; height: 80px"
                  :src="row.staffPhoto"
                  @click.native="showQrCode(row.staffPhoto)"
                >
                  <img src="@/assets/common/bigUserHeader.png" alt="" />
                </el-avatar>
              </template>
            </el-table-column>
            <el-table-column label="工号" sortable="" prop="workNumber" />
            <el-table-column
              :formatter="formatterData"
              label="聘用形式"
              sortable=""
              prop="formOfEmployment"
            />
            <el-table-column label="部门" sortable="" prop="departmentName" />
            <el-table-column label="入职时间" sortable="">
              <template v-slot="{ row }">
                {{ row.timeOfEntry | formatDate }}
              </template>
            </el-table-column>
            <el-table-column label="账户状态" sortable="" prop="enableState" />
            <el-table-column label="操作" sortable="" fixed="right" width="280">
              <template v-slot="{ row }">
                <el-button
                  type="text"
                  size="small"
                  @click="$router.push(`/employees/detail/${row.id}`)"
                  >查看</el-button
                >
                <el-button type="text" size="small">转正</el-button>
                <el-button type="text" size="small">调岗</el-button>
                <el-button type="text" size="small">离职</el-button>
                <el-button type="text" size="small" @click="editRole(row.id)"
                  >角色</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="del(row.id)"
                  :disabled="checkPermission('DELETE_USER')"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table-column></el-table
        >
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            :page-size="page.size"
            :current-page.sync="page.page"
            :total="total"
            layout="prev, pager, next"
            @current-change="getEmpList"
          />
        </el-row>
      </el-card>
      <!-- 引入新增员工弹层组件 -->
      <AddDemployee
        v-model="isShowAddEmpDialog"
        :is-show-add-emp-dialog.sync="isShowAddEmpDialog"
      />
    </div>
    <el-dialog :visible.sync="showAvatar" title="二维码预览">
      <canvas ref="canvas" />
    </el-dialog>
    <assignRole
      :showRoleDialog.sync="showRoleDialog"
      ref="roleRef"
      :currentId="currentId"
    ></assignRole>
  </div>
</template>
<script>
const headers = {
  手机号: "mobile",
  姓名: "username",
  入职日期: "timeOfEntry",
  聘用形式: "formOfEmployment",
  转正日期: "correctionTime",
  工号: "workNumber",
  部门: "departmentName",
};
import { getEmployeeList, delEmployee } from "@/api/employees";
// 枚举数据
import Employees from "@/api/constant/employees";
import AddDemployee from "@/views/employees/components/add-employee.vue";
import { formatDate } from "@/filters";
import qrCode from "qrcode";
import assignRole from "@/views/employees/components/assignRole.vue";
import { mixins } from "@/utils/mixins";
export default {
  components: {
    AddDemployee,
    assignRole,
  },
  mixins: [mixins],
  data() {
    return {
      // 控制添加员工弹窗的显示与隐藏
      currentId: null,
      isShowAddEmpDialog: false,
      showAvatar: false,
      list: [],
      total: 0,
      page: {
        page: 1,
        size: 10,
      },
      showRoleDialog: false,
    };
  },
  created() {
    this.getEmpList();
  },
  methods: {
    // 编辑角色
    async editRole(id) {
      this.currentId = id;
      await this.$refs.roleRef.getUserDetailById(id);
      this.showRoleDialog = true;
    },
    showQrCode(url) {
      this.showAvatar = true;
      this.$nextTick(() => {
        qrCode.toCanvas(this.$refs.canvas, url);
      });
    },
    // 导出数据
    async exportToExcel() {
      const { export_json_to_excel } = await import("@/utils/Export2Excel");
      // const tHeader = ['Id', '标题', '作者', '阅读', '时间']
      // 获取所有的员工数据
      const { rows } = await getEmployeeList({ page: 1, size: this.total });
      const resData = this.formatter(rows, headers);
      console.log(resData);
      export_json_to_excel({
        header: Object.keys(headers),
        data: resData,
        filename: "excel-list",
        autoWidth: true,
        bookType: "xlsx",
      });
    },
    // 格式化数据
    formatter(rows, headers) {
      return rows.map((item) => {
        // item里面的值，按照headers的顺序排列>>数组
        return Object.keys(headers).map((key) => {
          // 如果是时间>>>格式化
          if (["timeOfEntry", "correctionTime"].includes(headers[key])) {
            return formatDate(item[headers[key]]);
          }
          if (headers[key] === "formOfEmployment") {
            return (
              Employees.hireType.find(
                (child) => +child.id === +item[headers[key]]
              )?.value || "未知"
            );
          }
          // key中文的可以
          // 中文的key>>英文的key>>拿到的值
          return item[headers[key]];
        });
      });
    },
    // 获取数据
    async getEmpList() {
      const { rows, total } = await getEmployeeList(this.page);
      this.total = total;
      this.list = rows;
    },
    // 删除员工
    async del(id) {
      try {
        // 提示是否删除
        await this.$confirm("是否删除");
        await delEmployee(id);
        // 删除成功
        this.$message.success("删除成功");
        await this.getEmpList();
      } catch (e) {
        console.log(e);
      }
    },
    // 分页
    // changeCurrent(page) {
    //   this.page.page = page
    //   // 重新获取列表数据
    //   this.getEmpList()
    // }
    // 渲染聘用形式数据
    formatterData(row, column, cellvalue) {
      // 返回表格中的数据和枚举中的数据相等的例子
      const currentData = Employees.hireType.find(
        (item) => item.id === cellvalue
      )?.value;
      return currentData || "未知";
    },
  },
};
</script>

<style></style>
