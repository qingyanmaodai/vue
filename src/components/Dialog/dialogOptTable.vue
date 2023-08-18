<!-- 简单表格弹框组件-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="Dialog"
    :width="width"
    :close-on-click-modal="false"
  >
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="searchForm['datas']"
        :searchForm="searchForm['forms']"
        :remark="remark"
        :btnForm="btnForm"
        :signName="remark"
        @btnClick="btnClick"
      />
    </div>
    <div class="admin_content flex_grow">
      <ComVxeTable
        ref="PurchaseRequisition"
        :isToolbar="isToolbar"
        :forbidden="forbidden"
        :isEdit="isEdit"
        :hasSelect="hasSelect"
        :remark="remark"
        :row-key="'RowNumber'"
        :height="height"
        :sysID="sysID"
        :table-data="tableData"
        :table-header="tableHeader"
        :table-loading="tableLoading"
        :pagination="tablePagination"
        @pageChange="pageChange"
        @pageSize="pageSize"
        @sortChange="sortChange"
        @selectfun="selectFun"
        @toPageSetting="toPageSetting"
        :cell-style="cellStyle"
      />
    </div>
    <span slot="footer" class="dialog-footer" v-show="showFooter">
      <el-button @click="Dialog = false">取 消</el-button>
      <el-button v-show="isConfirmBtn" type="primary" @click="confirmDialog"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
/**
 * 支持分页
 * 支持条件查询
 */
var _this;
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import { GetSearchData, GetHeader, ExportData } from "@/api/Common";
export default {
  components: { ComVxeTable, ComSearch },
  props: {
    tablePagination: {
      type: Object,
      default() {
        return {
          pageIndex: 0,
          pageSize: 30,
          pageTotal: 0,
        };
      },
    },
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableHeader: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableLoading: {
      type: Boolean,
      default: false,
    },
    searchForm: {
      type: Object,
      default: function () {
        return {
          datas: {},
          forms: [],
        };
      },
    },

    //是否显示弹框
    tableDialog: {
      type: Boolean,
      default: false,
    },
    //弹框的标题
    title: {
      type: String,
      default: "",
    },
    // 弹框宽度
    width: {
      type: String,
      default: "50%",
    },
    // 底部内容
    showFooter: {
      type: Boolean,
      default: true,
    },
    // 显示的按钮
    btnForm: {
      type: Array,
      default: function () {
        return [];
      },
      required: false,
    },
    // 查询条件
    searchForm: {
      type: Object,
      default: function () {
        return {};
      },
    },
    //表格id
    sysID: {
      type: Number,
      dafault: 1,
    },
    //remark
    remark: {
      type: Number,
      dafault: 0,
    },
    //表格高度
    height: {
      type: String,
      default: "100%",
    },
    // 选中的数据
    checkData: {
      type: Array,
      default: function () {
        return [];
      },
      required: false,
    },
    // 匹配的关键字段
    checkData: {
      type: Array,
      default: function () {
        return [];
      },
      required: false,
    },
    // 是否显示确定按钮
    isConfirmBtn: {
      type: Boolean,
      default: false,
    },
    // 单元格是否支持编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 单元格是否支持编辑
    hasSelect: {
      type: Boolean,
      default: false,
    },
    // 是否显示选择框
    forbidden: {
      type: Boolean,
      default: false,
    },
    isToolbar: {
      type: Boolean,
      default: true,
    },
    // 单元格样式
    cellStyle: {
      type: Function,
      default: () => {
        return null;
      },
    },
    btnClickCall: {
      type: Function,
      default: () => {
        return null;
      },
    },
    pageChangeCall: {
      type: Function,
      default: () => {
        return null;
      },
    },
    pageSizeCall: {
      type: Function,
      default: () => {
        return null;
      },
    },
    sortChangeCall: {
      type: Function,
      default: () => {
        return null;
      },
    },
    selectfunCall: {
      type: Function,
      default: () => {
        return null;
      },
    },
    toPageSettingCall: {
      type: Function,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      Dialog: false,
      selectionData: [[]],
    };
  },
  created() {
    // this.getTableHeader();
  },
  watch: {
    tableDialog: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          // for (var name in this.searchForm) {
          //   this.$set(this.searchForm[0].datas, name, this.searchForm[name]);
          // }
          // this.getTableData(this.searchForm[0].datas, 0);
        }
        this.Dialog = newValue;
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
    // 点击系统id先关闭弹框
    toPageSetting() {
      this.Dialog = false;
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.$emit("selectFunCall", data, remarkTb, row);
    },
    // 关闭弹框
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    // 确定
    confirmDialog() {
      this.$emit("confirmDialog", this.remark);
    },
    // 第几页
    pageChange(val, remarkTb, filtertb) {
      this.$emit("pageChangeCall", val, remarkTb, filtertb);
    },
    // 页数
    pageSize(val, remarkTb, filtertb) {
      this.$emit("pageSizeCall", val, remarkTb, filtertb);
    },
    // 排序
    sortChange(order, prop, remarkTb, filtertb, row, index) {
      this.$emit("sortChangeCall", order, prop, remarkTb, filtertb, row, index);
    },
    // 统一渲染按钮事件
    btnClick(methods, parms, index, remarkTb) {
      this.$emit("btnClickCall", methods, parms, index, remarkTb);
    },
    // 获取表头数据
    // async getTableHeader() {
    //   let IDs = [{ ID: this.sysID }];
    //   let res = await GetHeader(IDs);
    //   const { datas, forms, result, msg } = res.data;
    //   if (result) {
    //     // 获取每个表头
    //     datas.some((m, i) => {
    //       m.forEach((n) => {
    //         // 进行验证
    //         this.verifyDta(n);
    //         if (n.children && n.children.length != 0) {
    //           n.children.forEach((x) => {
    //             this.verifyDta(x);
    //           });
    //         }
    //       });
    //       this.$set(this.tableColumns, i, m);
    //     });
    //     // 获取查询的初始化字段 组件 按钮
    //     forms.some((x, z) => {
    //       this.$set(this.searchForm[z].datas, "dicID", IDs[z].ID);
    //       x.forEach((y) => {
    //         if (y.prop && y.value) {
    //           this.$set(this.searchForm[z].datas, [y.prop], y.value);
    //         } else {
    //           this.$set(this.searchForm[z].datas, [y.prop], "");
    //         }
    //       });
    //       this.$set(this.searchForm[z], "forms", x);
    //     });
    //   }
    // },
    // // 验证数据
    // verifyDta(n) {
    //   for (let name in n) {
    //     if (
    //       (name == "component" && n[name]) ||
    //       (name == "button" && n[name]) ||
    //       (name == "active" && n[name])
    //     ) {
    //       n[name] = eval("(" + n[name] + ")");
    //     }
    //   }
    // },
    // // 获取表格数据
    // async getTableData(form, remarkTb) {
    //   this.$set(this.tableLoading, remarkTb, true);
    //   form["rows"] = this.tablePagination[remarkTb].pageSize;
    //   form["page"] = this.tablePagination[remarkTb].pageIndex;
    //   let res = await GetSearchData(form);
    //   const { result, data, count, msg } = res.data;
    //   if (result) {
    //     this.$set(this.tableData, remarkTb, data);
    //     this.$set(this.tablePagination[remarkTb], "pageTotal", count);
    //   } else {
    //     this.$message({
    //       message: msg,
    //       type: "error",
    //       dangerouslyUseHTMLString: true,
    //     });
    //   }
    //   this.$set(this.tableLoading, remarkTb, false);
    // },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  height: 70vh !important;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>
