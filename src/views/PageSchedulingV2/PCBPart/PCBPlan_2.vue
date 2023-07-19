<!--备料任务指派-->
<template>
  <div
    class="container"
    v-loading="adminLoading"
  >
    <div
      class="admin_head"
      ref="headRef"
    >
      <div
        v-for="(item,i) in 6"
        :key="i"
        v-show="labelStatus1 == i"
      >
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
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
                <span>选择机台/班组：</span>
                <el-select
                  clearable
                  filterable
                  size="mini"
                  v-model="LineID"
                  @change="setFooterLabel"
                >
                  <el-option
                    v-for="(item,i) in lines"
                    :key="i"
                    :label="item.LineName"
                    :value="item.LineID"
                  >
                  </el-option>
                </el-select>
                <span>生产时段：</span>
                <el-date-picker
                  v-model="ProducedDate"
                  type="date"
                  size="mini"
                  placeholder="选择生产时段"
                >
                </el-date-picker>
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
        <div
          v-for="(item,i) in 6"
          :key="i"
          v-show="labelStatus1 == i"
        >
          <ComVxeTable
            :rowKey="'RowNumber'"
            :height="height"
            :tableData="tableData[i]"
            :tableHeader="tableColumns[i]"
            :tableLoading="tableLoading[i]"
            :isEdit="isEdit"
            :hasSelect="hasSelect[i]"
            :remark="i"
            :cellStyle="cellStyle0"
            :sysID="sysID[i].ID"
            :isClear="isClear[i]"
            :footerLabel="footerLabel[i]"
            :pagination="tablePagination[i]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _this;
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from "@/api/Common";
export default {
  name: "PCBPlan_2",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      LineID: "",
      ProducedDate: "",
      lines: [],
      footerLabel: ["", "", "", "", "", "", ""],
      hasSelect: [true, true, true, false, false, false],
      sysID: [
        { ID: 5616 },
        { ID: 7794 },
        { ID: 7795 },
        { ID: 7803 },
        { ID: 7803 },
        { ID: 7803 },
      ],
      Status1: [
        { label: "SMT待排产", value: "" },
        { label: "补焊待排产", value: "" },
        { label: "排产记录", value: 1 },
        { label: "待转备料", value: 2 },
        { label: "已转备料", value: 2 },
        { label: "无工单", value: 2 },
      ],
      title:this.$route.meta.title,
      labelStatus1: 0,
      PrepareDate: "",
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
          BtnName: "转入备料区",
          Type: "primary",
          Ghost: true,
          Size: "small",
          signName: 0,
          Methods: "refreshPlan",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "转入日计划",
          Type: "warning",
          Ghost: true,
          Size: "small",
          signName: 0,
          Methods: "computedPlan",
          Icon: "",
        },
      ],
      tableData: [[], [], [], [], [], []],
      delData: [[], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 2000, pageTotal: 0 },
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
      selectionData: [[], [], [], [], false, false],
      isEdit: false,
      losePrepareDate: 1,
      losePrepareDate2: 1,
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.getTableHeader();
    this.getLine();
    // 获取所有按钮
    this.judgeBtn();
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
    cellStyle0({ row, column }) {
      if (column.property == "IsCompleteInspect") {
        if (row.IsCompleteInspect == "未开始") {
          return {
            backgroundColor: "#ff7b7b",
          };
        } else if (row.IsCompleteInspect == "进行中") {
          return {
            backgroundColor: "#fdfd8f",
          };
        } else if (row.IsCompleteInspect == "已完成") {
          return {
            backgroundColor: "#9fff9f",
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
        // this.formSearchs[1].datas["PrepareStatus"] = "";
        // this.formSearchs[1].datas["sort"] = "PrepareStatus asc";
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
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
    },
    // 控制选框是否能手动勾选
    checCheckboxkMethod({ row }) {},
    // 转入备料区
    async refreshPlan(remarkTb, index) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要转入备料区的数据！");
      } else {
        this.selectionData[remarkTb].forEach((a) => {
          a["Extend3"] = "备料";
        });
        this.adminLoading = true;
        let res = await GetSearch(
          this.selectionData[remarkTb],
          "/APSAPI/InsertPreparePlan"
        );
        const { result, data, count, msg } = res.data;
        if (result) {
          this.adminLoading = false;
          this.dataSearch(0);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      }
    },
    // 转入日计划
    async computedPlan(remarkTb, index) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要转入日计划的数据！");
      } else {
        this.adminLoading = true;
        let res = await GetSearch(
          this.selectionData[remarkTb],
          "/APSAPI/MOPlanSaveToDayPlan?isPlan=1"
        );
        const { result, data, count, msg } = res.data;
        if (result) {
          this.adminLoading = false;
          this.dataSearch(0);
        } else {
          this.adminLoading = false;
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      }
    },
    // 选线获取剩余工时
    setFooterLabel(val) {
      let LineName = this.lines.filter((a) => a.LineID == val)[0].LineName;
      //查询线别剩余工时
      let StrValue = `提示：当前所选${LineName}线，在${this.ProducedDate}共有350个小时，已占用250小时，剩余100小时【已选4项，预计占用50小时，剩余50小时】`;
      this.$set(this.footerLabel, 0, StrValue);
    },
    // 获取线别
    async getLine() {
      let form = {};
      form["rows"] = 0;
      form["dicID"] = 36;
      form["Status"] = 1;
      form["OrganizeTypeID"] = 6;
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (data.length != 0) {
          data.forEach((a) => {
            a["LineID"] = a.OrganizeID;
            a["LineName"] = a.OrganizeName;
          });
        }
        this.lines = data;
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
  },
};
</script>