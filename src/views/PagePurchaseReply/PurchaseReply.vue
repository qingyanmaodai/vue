<!--下发复期-->
<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
      <div>
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
    </div>
    <div>
      <div class="admin_content">
        <div class="ant-table-title">
          <el-row>
            <el-col :span="4"><span class="title">{{title}}</span></el-col>
            <el-col
              :span="20"
              class="flex_flex_end"
            >
              <div>
                <el-radio
                  v-model="IsSetReply"
                  :label="0"
                  @click.native.prevent="clickitem(1)"
                >显示未下发</el-radio>
                <el-divider direction="vertical"></el-divider>
                <el-date-picker
                  v-model="DemandReplyDate"
                  type="datetime"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="完成日期"
                >
                </el-date-picker>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="primary"
                  size="mini"
                  @click="changeDate"
                >
                  指定要求完成期
                </el-button>
                <el-divider direction="vertical"></el-divider>
              </div>
              <div
                :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                v-for="(item, y) in Status1"
                :key="y"
              >
                <span @click="changeStatus(item, y)">{{ item.label }}</span>
                <el-divider direction="vertical"></el-divider>
              </div>
            </el-col>
          </el-row>
        </div>
        <div>
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[0]"
            :tableHeader="tableColumns[0]"
            :tableLoading="tableLoading[0]"
            :isEdit="isEdit"
            :hasSelect="true"
            :cellStyle="cellStyle"
            :checCheckboxkMethod="checCheckboxkMethod"
            :remark="0"
            :sysID="sysID[0].ID"
            :isClear="isClear[0]"
            :pagination="tablePagination[0]"
            @toPage="openDialog"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @sortChange="sortChange"
            @filterChange="filterChange"
          />
        </div>
      </div>
    </div>

    <el-dialog
      title="复期明细"
      :visible.sync="dialogShow"
      width="90%"
    >
      <div
        class="container"
        style="background-color: #f0f2f5;"
      >
        <div class="admin_content">
          <ComReportTable
            :rowKey="'RowNumber'"
            :height="height1"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :isClear="isClear[1]"
            :showFooter="true"
            :pagination="tablePagination[1]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @sortChange="sortChange"
            @filterChange="filterChange"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import ComReportTable from "@/components/ComReportTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
  GetServerTime,
} from "@/api/Common";
export default {
  name: "PurchaseReply",
  components: {
    ComSearch,
    ComVxeTable,
    ComReportTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      dialogShow: false,
      footerLabel: ["", "", "", ""],
      hasSelect: [false, true, true, false],
      sysID: [{ ID: 7851 }, { ID: 7850 }],
      Status1: [
        { label: "全部", value: "" },
        { label: "复期中", value: [1, 2, 3] },
        { label: "已复期", value: 4 },
        { label: "复期异常", value: 2 },
        { label: "复期变更", value: 3 },
      ],
      title: this.$route.meta.title,
      labelStatus1: 0,
      DemandReplyDate: "",
      adminLoading: false,
      checkdBtnCodes: [],
      drawer: false,
      formSearchs: [
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "下发复期任务",
          Type: "success",
          Ghost: true,
          Size: "small",
          signName: "",
          Methods: "getServerDate",
          Icon: "",
        },
      ],
      tableData: [[], [], [], []],
      delData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      initialBtnData: [],
      tagRremark: 1,
      selectionData: [[], [], [], []],
      isEdit: false,
      IsSetReply: 1,
      height1: "460px",
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.getTableHeader();
    // 获取所有按钮
    this.judgeBtn();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    // 筛选
    async filterChange(val,property,remarkTb){
      this.formSearchs[remarkTb].datas[property] = val
      this.dataSearch(remarkTb)
    },
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
    // 编辑行
    editRow(row) {
      this.$set(row, "update", true);
    },
    // 删除行
    delRow(row) {
      this.$confirm("确定要删除该菜单嘛？")
        .then((_) => {})
        .catch((_) => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
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
    },
    // 行内样式
    cellStyle({ row, column }) {
      if (column.property == "ReplyRate") {
        if (
          row.ReplyStatus == 2 ||
          (row.ReplyRate &&
            parseFloat(row.ReplyRate.substring(0, row.ReplyRate.length - 1)) ==
              0)
        ) {
          return {
            backgroundColor: "#ff7b7b",
          };
        } else if (
          row.ReplyRate &&
          parseFloat(row.ReplyRate.substring(0, row.ReplyRate.length - 1)) >=
            100
        ) {
          return {
            backgroundColor: "#9fff9f",
          };
        } else if (
          row.ReplyRate &&
          parseFloat(row.ReplyRate.substring(0, row.ReplyRate.length - 1)) < 100
        ) {
          return {
            backgroundColor: "#fdfd8f",
          };
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
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      let res = await SaveData(newData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(remarkTb);
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 保存返回结果自己处理事件
    async returnResultData(newData) {
      let res = await SaveData(newData);
      return res;
    },
    // 获取表头数据
    async getTableHeader() {
      let IDs = this.sysID;
      let res = await GetHeader(IDs);
      const { datas, forms, result, msg } = res.data;
      if (result) {
        // 获取每个表头
        datas.some((m, i) => {
          m.forEach((n) => {
            // 进行验证
            if (n.prop == "MenuCode" || n.prop == "MenuName") {
              this.$set(n, "treeNode", true);
            }
            this.verifyDta(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
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
        this.adminLoading = false;
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
      this.$set(this.tableLoading, remarkTb, false);
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
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 指定备料日期
    changeDate() {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请勾选数据再指定完成日期！");
      } else {
        if (!this.DemandReplyDate) {
          this.$message.error("请选择完成日期！");
        } else {
          this.selectionData[0].forEach((x) => {
            x.DemandReplyDate = this.DemandReplyDate;
          });
          // this.generalSaveData(this.selectionData[0], 0);
        }
      }
    },
    // 获取服务器时间
    async getServerDate(remarkTb) {
      let res = await GetServerTime();
      const { result, data, msg } = res.data;
      if (result) {
        this.setOut(remarkTb, data);
      } else {
      }
    },
    // 下发
    setOut(remarkTb, SetReplyDate) {
      let submitData = [];
      let flag = 0;
      if (this.selectionData[remarkTb].length != 0) {
        this.selectionData[remarkTb].forEach((x) => {
          let obj = JSON.parse(JSON.stringify(x));
          if (!obj.DemandReplyDate) {
            flag = 1;
          }
          obj["IsSetReply"] = 1; // 1-下发
          obj["SetReplyDate"] = SetReplyDate;
          submitData.push(obj);
        });
      }
      if (flag == 1) {
        this.$message.error(
          "请检查是否指派了要求完成日期，有完成日期才能下发！"
        );
      } else {
        this.adminLoading = true;
        this.generalSaveData(submitData, remarkTb);
      }
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["ReplyStatus"] = x.value;
      this.dataSearch(0);
    },
    // 控制选框是否能手动勾选
    checCheckboxkMethod({ row }) {
      if (row.NoSetReplyCount == 0) {
        // 代表已下发
        return false;
      } else {
        return true;
      }
    },
    // 是否只显示没有下发的
    clickitem(val) {
      val == this.IsSetReply ? (this.IsSetReply = 0) : (this.IsSetReply = 1);
      if (this.IsSetReply == 0) {
        this.formSearchs[0].datas["IsSetReply"] = 0;
      } else {
        this.formSearchs[0].datas["IsSetReply"] = "";
      }
      this.dataSearch(0);
    },
    // 打开弹框
    openDialog(row) {
      // if (row.IsSetReplyName == "否") {
      //   this.$message.error("暂未下发，还没有复期任务！");
      // } else {
        this.dialogShow = true;
        this.formSearchs[1].datas["SalesOrderDetailID"] =
          row.SalesOrderDetailID;
        this.formSearchs[1].datas["PrepareDate"] = row.MinPrepareDate;
        this.dataSearch(1);
      }
    // },
  },
};
</script>