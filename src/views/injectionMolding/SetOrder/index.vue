<!--菜单设置-->
<template>
  <div class="container">
    <div class="admin_head" ref="headRef">
      <ComSearch
        ref="searchRef"
        :searchData="formSearchs[0].datas"
        :searchForm="formSearchs[0].forms"
        :remark="0"
        :isLoading="isLoading"
        :btnForm="btnForm"
        :signName="labelStatus1"
        @btnClick="btnClick"
      />
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <el-button type="primary" v-show="isEdit" size="mini" @click="add"
                >新增</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <div v-for="(item, y) in Status1" :key="y">
                <span
                  @click="changeStatus(item, y)"
                  :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                  >{{ item.label }}</span
                >
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <ComVxeTable
          :rowKey="'RowNumber'"
          :height="height"
          :tableData="tableData[0]"
          :tableHeader="tableColumns[0]"
          :tableLoading="tableLoading[0]"
          :remark="0"
          :sysID="5615"
          :hasSelect="isSelect"
          :isEdit="isEdit"
          :isClear="isClear[0]"
          :pagination="tablePagination[0]"
          @configprocess="configprocess"
          @pageChange="pageChange"
          @pageSize="pageSize"
          @sortChange="sortChange"
          @selectfun="selectFun"
        />
      </div>
    </div>

    <!-- 工艺配置 -->
    <el-dialog title="选择工艺" :visible.sync="processDialog" width="16.8%">
      <el-form label-width="110px">
        <el-form-item label="请选择工艺：">
          <el-select v-model="ProcessGroupID" clearable filterable>
            <el-option
              v-for="item in processGroupOptions"
              :key="item.ProcessGroupID"
              :label="item.ProcessGroupName"
              :value="item.ProcessGroupID"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processDialog = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sureProcess" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="新建订单"
      :visible.sync="orderDialog"
      width="45%"
      custom-class="dialogStyle"
      :close-on-click-modal="false"
    >
      <GeneralForm
        ref="ruleformDialog"
        :ruleForm="ruleformDialog"
        :rules="rulesDialog"
        :formController="formcontrollerDialog"
        @fetchSuggertions="fetchSuggertions"
        @getRemote="getRemote"
      />
      <div class="clearBoth"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOrder" icon="el-icon-circle-close" size="small"
          >取消</el-button
        >
        <el-button
          type="success"
          @click="addOrder"
          :disabled="addDisabled"
          icon="el-icon-plus"
          size="small"
        >
          添加
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import GeneralForm from "@/components/GeneralForm";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  UpdateProcess,
  SaveData,
  GetFuzzySearchData,
} from "@/api/Common";
import { OneStepReleaseByOrder } from "@/api/PageOrder";
export default {
  name: "OrderInfo",
  components: {
    ComSearch,
    ComVxeTable,
    GeneralForm,
  },
  data() {
    return {
      orderDialog: false,
      ruleformDialog: {
        SourceOrderNo: "",
        dicID: 13,
        OrderNo: "",
        Code: "",
        MaterialName: "",
        MaterialID: "",
        Spec: "",
        Extend12: "",
        Qty: "",
        DeliveryDate: "",
        SalesOrderNo: "",
        SalesOrderID: "",
      },
      rulesDialog: {
        Code: [{ required: true, message: "编码为必选项", trigger: "change" }],
        Qty: [{ required: true, message: "数量为必填项", trigger: "blur" }],
        DeliveryDate: [
          { required: true, message: "交期为必选项", trigger: "change" },
        ],
      },
      formcontrollerDialog: [
        {
          label: "销售订单：",
          label2: "产品名称：",
          methods: "getSalesOrder",
          component: {
            type: "autocomplete",
          },
          prop: "SalesOrderNo",
          prop2: "MaterialName",
        },
        {
          label: "生产工单：",
          component: {
            type: "input",
          },
          prop: "OrderNo",
        },
        {
          label: "产品名称：",
          component: {
            type: "input",
          },
          prop: "MaterialName",
          disabled: false,
        },
        {
          label: "产品编码：",
          label2: "产品名称：",
          methods: "getMaterial",
          component: {
            type: "autocomplete",
          },
          prop: "Code",
          prop2: "MaterialName",
          disabled: false,
        },
        {
          label: "产品规格：",
          component: {
            type: "input",
          },
          prop: "Spec",
          disabled: true,
        },
        {
          label: "模具名称：",
          component: {
            type: "input",
            className: "",
          },
          prop: "Extend12",
          disabled: true,
        },
        {
          label: "订单数量：",
          component: {
            type: "input",
            inputType: "number",
          },
          prop: "Qty",
          disabled: false,
        },
        {
          label: "订单交期：",
          component: {
            type: "date",
          },
          prop: "DeliveryDate",
          disabled: false,
        },
      ],
      selectionData: [[]],
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      parmsBtn: [
        // {
        //   ButtonCode: "save",
        //   BtnName: "下达",
        //   Type: "success",
        //   Ghost: true,
        //   Size: "small",
        //   Methods: "setOrder",
        //   Icon: "",
        //   isLoading: false,
        //   signName: 2,
        // },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "primary",
          Ghost: true,
          Size: "small",
          Methods: "dataSave",
          Icon: "",
          isLoading: false,
          signName: "",
        },
      ],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 200, pageTotal: 0 }],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      labelStatus1: 0,
      ProcessGroupID: "",
      Status1: [
        { label: "全部", value: "" },
        { label: "已下达", value: 21 },
        { label: "未下达", value: 26 },
        { label: "已完成", value: 25 },
      ],
      isSelect: false,
      isEdit: false,
      dialogCurrentRow: "",
      processGroupOptions: [],
      processDialog: false,
      addDisabled: false,
    };
  },
  watch: {},
  created() {
    this.judgeBtn();
    this.getTableHeader();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 判断按钮权限
    judgeBtn() {
      let routeBtn = this.$route.meta.btns;
      let newBtn = [];
      let permission = false;
      if (routeBtn.length != 0) {
        routeBtn.forEach((x) => {
          if (x.ButtonCode == "edit") {
            permission = true;
          }
          let newData = this.parmsBtn.filter((y) => {
            return x.ButtonCode == y.ButtonCode;
          });
          if (newData.length != 0) {
            newBtn = newBtn.concat(newData);
          }
        });
      }
      this.$set(this, "btnForm", newBtn);
      this.$set(this, "isEdit", permission);
    },
    // 高度控制
    setHeight() {
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      this.$set(this, "height", newHeight);
    },
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
    // 改变父组件表格行数据
    changeTableRowData(remarkTb, row, index) {
      for (let name in row) {
        this.$set(this.tableData[remarkTb][index], name, row[name]);
      }
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
      this.$set(this.isClear, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
      setTimeout(() => {
        this.$set(this.isClear, remarkTb, false);
      });
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != "dicID") {
          this.formSearchs[remarkTb].datas[name] = null;
        }
      }
      this.formSearchs[remarkTb].datas["ProductionStatus"] =
        this.Status1[this.labelStatus1].value;
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
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      let res = null;
      this.adminLoading = true;
      if (newData && newData.length != 0) {
        res = await SaveData(newData);
      } else {
        res = await SaveData(this.tableData[remarkTb]);
      }
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 下达
    async setOrder(remarkTb, index) {
      let res = await OneStepReleaseByOrder(this.selectionData[remarkTb]);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(0);
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = [{ ID: 5615 }];
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
        this.getTableData(this.formSearchs[0].datas, 0);
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
    ////////////////其他事件///////////////
    // 改变状态
    changeStatus(item, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["ProductionStatus"] = item.value;
      this.dataSearch(0);
      // if (index == 2) {
      //   this.isSelect = true;
      // }
    },
    // 配置工艺按钮
    async configprocess(row) {
      this.dialogCurrentRow = row;
      let res = await GetSearchData({ dicID: 1175 });
      const { result, data, count, msg } = res.data;
      if (result) {
        this.ProcessGroupID = row.ProcessGroupID;
        this.processGroupOptions = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.processDialog = true;
    },
    // 确定当前工艺
    async sureProcess() {
      let obj = {};
      obj["materialID"] = this.dialogCurrentRow.MaterialID;
      obj["processGroupID"] = this.ProcessGroupID;
      let res = await UpdateProcess(obj);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(0);
        this.processDialog = false;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 新建
    add() {
      this.orderDialog = true;
      for (name in this.ruleformDialog) {
        this.ruleformDialog[name] = "";
      }
    },
    // 取消单
    cancelOrder() {
      this.orderDialog = false;
    },
    // 添加订单
    async addOrder() {
      this.ruleformDialog["dicID"] = 5615;
      let res = await SaveData([this.ruleformDialog]);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.orderDialog = false;
        this.dataSearch(0);
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 远程搜索
    async fetchSuggertions(val, cb, methods) {
      if (!val) {
        // val = 1;
        return;
      }
      if (methods == "getMaterial") {
        let form = {
          dicID: 12,
          Code: val,
          MaterialName: val,
          rows: 50,
          page: 1,
        };
        let res = await GetFuzzySearchData(form);
        const { result, data, count, msg } = res.data;
        if (result) {
          cb(data);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      } else if (methods == "getSalesOrder") {
        let form = { dicID: 5646, SalesOrderNo: val, rows: 50, page: 1 };
        let res = await GetFuzzySearchData(form);
        const { result, data, count, msg } = res.data;
        if (result) {
          cb(data);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      }
    },
    // 搜索结果
    getRemote(val, methods) {
      console.log(val);
      if (methods == "getMaterial") {
        this.ruleformDialog.Code = val.Code;
        this.ruleformDialog.MaterialName = val.MaterialName;
        this.ruleformDialog.MaterialID = val.MaterialID;
        this.ruleformDialog.Spec = val.Spec;
        this.ruleformDialog.Extend12 = val.Extend12;
        if (!val.Extend12) {
          this.addDisabled = true;
          this.$set(
            this.formcontrollerDialog[5].component,
            "className",
            "bgRedInput"
          );
        } else {
          this.addDisabled = false;
          this.$set(this.formcontrollerDialog[5].component, "className", "");
        }
      } else if (methods == "getSalesOrder") {
        this.ruleformDialog.SalesOrderNo = val.SalesOrderNo;
        this.ruleformDialog.SourceOrderNo = val.SalesOrderNo;
        this.ruleformDialog.SalesOrderID = val.SalesOrderID;
        this.ruleformDialog.MaterialID = val.MaterialID;
        this.ruleformDialog.Code = val.Code;
        this.ruleformDialog.MaterialName = val.MaterialName;
        this.ruleformDialog.Spec = val.Spec;
        this.ruleformDialog.Qty = val.Qty;
        this.ruleformDialog.DeliveryDate = val.DeliveryDate;
        this.ruleformDialog.OrderNo = "";
        this.ruleformDialog.SalesOrderDetailID = val.SalesOrderDetailID;
        this.ruleformDialog.NoSehcduingQty = val.Qty;
      }
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
  },
};
</script>
