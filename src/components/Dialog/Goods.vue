<!--产品弹出框组件-->
<template>
  <el-dialog
    title="查询产品信息"
    :append-to-body="appendToBody"
    :visible.sync="GoodsDialog"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="60%"
  >
    <el-container>
      <el-aside width="160px" style="background: #fff">
        <span style="height: 40px; display: block">产品类别</span>
        <div class="hr-line-dashed" />
        <el-tree
          ref="GoodsTree"
          node-key="MaterialType"
          default-expand-all
          :data="treeData"
          :props="treeProps"
          :load="loadNode"
          :style="{ height: '' + height + '', overflow: 'auto' }"
          style="overflow: auto"
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-aside>
      <el-main
        class="GoodsMain"
        style="padding: 0; margin: 0; overflow: hidden"
      >
        <div style="height: 40px">
          <el-input
            size="small"
            v-model="MaterialName"
            style="width: 240px"
            placeholder="按产品名称可查询"
            @keyup.enter.native="queryGoods"
          ></el-input>
          <el-button size="small" @click="queryGoods">查询</el-button>
          <el-button size="small" @click="toGoodsPage">新增产品</el-button>
        </div>
        <div class="hr-line-dashed" />
        <ComVxeTable
          ref="PurchaseRequisition"
          :has-select="true"
          :isEdit="true"
          :row-key="rowKey"
          :height="height"
          :cellStyle="cellStyle"
          :sysID="1180"
          :table-data="tableData"
          :table-header="tableColumns[0]"
          :table-loading="loading"
          :pagination="pagination"
          @pageChange="pageChange"
          @handleRowClick="handleRowClick"
          @selectfun="selectFun"
        />
      </el-main>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button size="small" type="primary" @click="addNoClose"
        >添加不关闭</el-button
      >
      <el-button size="small" type="primary" @click="addClose"
        >添加并关闭</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
var _this;
import ComVxeTable from "@/components/ComVxeTable";
import { GetGoodsInfo, UpdateGoodsInfo, GetGoodsData } from "@/api/Basic";
import { GetSearchData, GetHeader } from "@/api/Common";
import isObjEmpty from "@/utils/isObjEmpty";
export default {
  components: { ComVxeTable },
  data() {
    return {
      height: "", //内容高度
      MaterialName: "", //查询条件
      treeProps: {
        label: "MaterialType",
        children: "children",
        isLeaf: "isLeaf",
      },
      Selection: [],
      rowKey: "MaterialID",
      tableData: [],
      tableColumns: [[]],
      tableHeader: [
        // {
        //   prop: "Quantity",
        //   label: "数量",
        //   minWidth: "120px",
        //   align: "center",
        //   component: {
        //     type: "input",
        //     inputType: "number",
        //   },
        // },
        // {
        //   prop: "Unit",
        //   label: "单位",
        //   minWidth: "120px",
        //   align: "center",
        // },
        // {
        //   prop: "Code",
        //   label: "产品编号",
        //   minWidth: "120px",
        //   align: "center",
        // },
        // {
        //   prop: "MaterialName",
        //   label: "产品名称",
        //   minWidth: "160px",
        //   align: "center",
        // },
        // {
        //   prop: "Spec",
        //   label: "规格型号",
        //   minWidth: "120px",
        //   align: "center",
        // },
        // {
        //   prop: "Price",
        //   label: "价格",
        //   minWidth: "120px",
        //   align: "center",
        // },
      ],
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      loading: false,
      pagination: {
        pageIndex: 1,
        pageSize: 50,
        pageTotal: 1,
      },
      MaterialType: "成品",
    };
  },
  props: {
    treeData: {
      type: Array,
      default: function () {
        return [
          { MaterialType: "成品" },
          { MaterialType: "半成品" },
          { MaterialType: "原材料" },
          { MaterialType: "整机" },
          { MaterialType: "PCBA" },
        ];
      },
    },
    GoodsDialog: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    _this = this;
    this.getTableHeader();
  },
  mounted() {
    console.log(this.treeData);
  },
  watch: {
    GoodsDialog(val) {
      if (val == false) {
        this.tableData = [];
      } else {
        this.tableData = [];
        this.pagination.pageIndex = 1;
        this.$nextTick(function () {
          _this.$refs.GoodsTree.setCurrentKey("成品");
        });
        this.GetGoodsData();
      }
    },
  },
  methods: {
    async getTableHeader() {
      let IDs = [{ ID: 1180 }];
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
    /////////////////传参获取数据/////////////////
    //获取产品类别信息
    // async GetGoodsInfo(ID) {
    //   let res = await GetGoodsInfo({
    //     IsAll: true,
    //     ID: ID,
    //   });
    //   const { Result, code } = res;
    //   if (code == 20000) {
    //     this.treeData = Result.Data;
    //   }
    // },
    //获取产品信息
    async GetGoodsData(StrWhere, ProductCategoryID) {
      this.loading = true;
      let res = await GetSearchData({
        dicID: 1180,
        MaterialType: this.MaterialType,
        MaterialName: this.MaterialName,
        PageIndex: this.pagination.PageIndex,
        PageSize: this.pagination.PageSize,
      });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.pagination.pageTotal = count;
        this.tableData = data;
        this.loading = false;
      } else {
        this.loading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 分页导航
    pageChange(val) {
      this.$set(this.pagination, "pageIndex", val);
      this.GetGoodsData();
    },
    //查询产品
    queryGoods: function () {
      // if (isObjEmpty(this.MaterialName)) {
      //   this.$message.warning("请输入搜索条件！");
      //   return false;
      // }
      this.pagination.pageIndex = 1;
      this.loading = true;
      this.GetGoodsData();
    },
    //新增产品跳转至产品信息列表页面
    toGoodsPage: function () {
      this.$emit("toGoodsPage");
    },
    // 选中的选框
    selectFun(data) {
      this.Selection = data;
    },
    // 单击行
    handleRowClick(row, column, event) {
      this.$set(row, "update", true);
    },
    // 异步树叶子节点懒加载逻辑
    loadNode(node, resolve) {
      // 一级节点处理
      if (node.level === 0) {
      }
      // 其余节点处理
      if (node.level >= 1) {
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style="font-size:15px;font-weight:700;">
          <span>{node.label}</span>
        </span>
      );
    },
    handleNodeClick(data, node) {
      this.dataTree = data;
      this.nodeTree = node;
      this.MaterialType = data.MaterialType;
      this.GetGoodsData();
    },
    //添加不关闭
    addNoClose: function () {
      this.$emit("addGoods", {
        Selection: this.Selection,
        GoodsDialog: this.GoodsDialog,
      });
      this.Selection = [];
      this.$refs.PurchaseRequisition.$refs.vxeTable.clearCheckboxRow();
    },
    //添加并关闭
    addClose: function () {
      this.$emit("addGoods", {
        Selection: this.Selection,
        GoodsDialog: !this.GoodsDialog,
      });
      this.Selection = [];
      this.$refs.PurchaseRequisition.$refs.vxeTable.clearCheckboxRow();
    },
    //取消
    cancel: function () {
      this.$emit("cancel", !this.GoodsDialog);
      this.Selection = [];
      this.$refs.PurchaseRequisition.$refs.vxeTable.clearCheckboxRow();
    },
    // 样式控制
    cellStyle({ row, column }) {
      if (column.property == "IsHavMold") {
        if (row["IsHavMold"] == "无") {
          return {
            background: "#fd7c7c",
          };
        }
      }
    },
  },
  mounted() {
    this.height = window.innerHeight - 500 + "px";
  },
};
</script>

<style scoped>
.GoodsMain /deep/ .el-button {
  background: #21b9bb;
  border: 1px solid #21b9bb;
  margin-left: 10px;
  color: #fff;
}
.hr-line-dashed {
  border-top: 1px dashed #e7eaec;
  color: #ffffff;
  background-color: #ffffff;
  height: 1px;
}
</style>
