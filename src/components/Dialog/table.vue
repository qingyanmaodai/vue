<template>
  <el-dialog
    :title="title"
    :visible.sync="Dialog"
    :width="width"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :btnForm="btnForm"
        @btnClick="btnClick"
      />
    </div>
    <div>
      <ComReportTable
        ref="PurchaseRequisition"
        :isEdit="true"
        :remark="0"
        :row-key="'RowNumber'"
        :height="height"
        :sysID="sysID"
        :table-data="tableData[0]"
        :table-header="tableColumns[0]"
        :table-loading="tableLoading[0]"
        :pagination="tablePagination[0]"
        @pageChange="pageChange"
        @pageSize="pageSize"
        @sortChange="sortChange"
      />
    </div>
  </el-dialog>
</template>
<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComReportTable from "@/components/ComReportTable";
import { GetSearchData, GetHeader } from "@/api/Common";
export default {
  components: { ComReportTable, ComSearch },
  props: {
    tableDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "50%",
    },
    btnForm: {
      type: Array,
      default: function () {
        return [];
      },
      required: false,
    },
    searchForm: {
      type: Object,
      default: function () {
        return {};
      },
    },
    sysID: {
      type: Number,
      dafault: 1,
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      Dialog: false,
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 200, pageTotal: 0 }],
    };
  },
  created() {
    this.getTableHeader();
  },
  watch: {
    tableDialog: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.Dialog = true;
          for (var name in this.searchForm) {
            this.$set(this.formSearchs[0].datas, name, this.searchForm[name]);
          }
          this.getTableData(this.formSearchs[0].datas, 0);
        }
      },
      deep: true,
    },
    Dialog: {
      handler: function (newValue, oldValue) {
        if (!newValue) {
          this.$emit("closeDialog", newValue);
        }
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    // 第几页
    pageChange(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], "pageIndex", val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 页数
    pageSize(val, remarkTb, filtertb) {
      this.$set(this.tablePagination[remarkTb], "pageSize", val);
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 排序
    sortChange(order, prop, remarkTb, filtertb, row, index) {
      if (filtertb == -100) {
        // 改变父表格的行数据
        this.changeTableRowData(remarkTb, row, index);
        return;
      }
      if (order) {
        if (order === "desc") {
          this.formSearchs[remarkTb].datas["sort"] = prop + " DESC";
        } else {
          this.formSearchs[remarkTb].datas["sort"] = prop + " ASC";
        }
      } else {
        this.formSearchs[remarkTb].datas["sort"] = null;
      }
      this.dataSearch(remarkTb);
    },
    // 统一渲染按钮事件
    btnClick(methods, parms, index, remarkTb) {
      if (parms) {
        // 下标 要用的数据 标题 ref
        this[methods](remarkTb, index, parms);
      } else {
        this[methods](remarkTb, index);
      }
    },
    // 查询
    dataSearch(remarkTb) {
      this.tagRemark = remarkTb;
      this.tableData[remarkTb] = [];
      this.$set(this.tableLoading, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != "dicID") {
          this.formSearchs[remarkTb].datas[name] = null;
        }
      }
    },
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: this.sysID }];
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            this.verifyDta(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyDta(x);
              });
            }
          });
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          x.forEach((y) => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "");
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
        });
      }
    },
    // 验证数据
    verifyDta(n) {
      for (let name in n) {
        if (
          (name == "component" && n[name]) ||
          (name == "button" && n[name]) ||
          (name == "active" && n[name])
        ) {
          n[name] = eval("(" + n[name] + ")");
        }
      }
    },
    // 获取表格数据
    async getTableData(form, remarkTb) {
      this.$set(this.tableLoading, remarkTb, true);
      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
  },
};
</script>