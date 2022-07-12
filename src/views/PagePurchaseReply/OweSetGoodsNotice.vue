<!--送货通知单-->
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
                  v-show="labelStatus1 == 0"
                  v-model="Result"
                  :label="0"
                  @click.native.prevent="clickitem(1)"
                >显示有变化</el-radio>
                <el-divider direction="vertical"></el-divider>
              </div>
              <div
                :class="labelStatus1 == y ? 'statusActive cursor' : 'cursor'"
                v-for="(item, y) in Status1"
                :key="y"
              >
                <span @click="changeStatus(item, y)">{{ item.label }}（{{item.num}}）</span>
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
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @sortChange="sortChange"
            @filterChange="filterChange"
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
  name: "OweSetGoodsNotice",
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
      sysID: [{ ID: 7843 }],
      Status1: [
        { label: "全部", value: "", num: 0 },
        { label: "未通知", value: "未通知", num: 0 },
        { label: "已通知", value: "已通知", num: 0 },
      ],
      title: "欠料送货通知列表",
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
      ],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "更新为已通知",
          Type: "success",
          Ghost: true,
          Size: "small",
          signName: "",
          Methods: "dataSave",
          Icon: "",
        },
      ],
      tableData: [[], [], [], []],
      delData: [[], [], [], []],
      tableColumns: [[], [], [], []],
      tableLoading: [false, false, false, false],
      isClear: [false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
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
      Result: 1,
      height1: "460px"
    };
  },
  created() {
    _this = this;
    this.adminLoading = true;
    this.getTableHeader();
    // 获取所有按钮
    this.judgeBtn();
    // 获取已通知未通知的合计
    this.getTotalNum();
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
      this.getTotalNum();
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
    // 行内样式 #fdfd8f 黄色
    cellStyle({ row, column }) {
      if (column.property == "Result") {
        if (row.Result == "未变化") {
          return {
            backgroundColor: "#9fff9f",
          };
        } else if (row.Result == "新增") {
          return {
            backgroundColor: "#f8b1b1",
          };
        } else if (row.Result == "") {
          return {
            backgroundColor: "",
          };
        } else {
          return {
            backgroundColor: "#ff7b7b",
          };
        }
      }
      if (column.property == "Notice") {
        if (row.Notice == "已通知") {
          return {
            backgroundColor: "#9fff9f",
          };
        } else if (row.Notice == "未通知") {
          return {
            backgroundColor: "#ff7b7b",
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
    // 获取服务器时间
    async getServerDate(remarkTb) {
      let res = await GetServerTime();
      const { result, data, msg } = res.data;
      if (result) {
        this.setOut(remarkTb, data);
      } else {
      }
    },
    // 更新为已通知
    dataSave(remarkTb) {
      if (this.selectionData[0].length == 0) {
        this.$message.error("请勾选已经通知过的数据！");
      } else {
        let submitData = [];
        this.$confirm("确定要批量更新为已通知吗？")
          .then((_) => {
            _this.selectionData[0].forEach((a) => {
              a.Notice = "已通知";
            });
            _this.generalSaveData(_this.selectionData[0], 0);
          })
          .catch((_) => {});
      }
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.formSearchs[0].datas["Notice"] = x.value;
      this.dataSearch(0);
    },
    // 控制选框是否能手动勾选
    checCheckboxkMethod({ row }) {
      if (row.Notice == "已通知") {
        return false;
      } else {
        return true;
      }
    },
    // 是否只显示没有下发的
    clickitem(val) {
      val == this.Result ? (this.Result = 0) : (this.Result = 1);
      if (this.Result == 0) {
        this.formSearchs[0].datas["Result"] = ["新增", "欠数增加", "欠数减少"];
      } else {
        this.formSearchs[0].datas["Result"] = "";
      }
      this.dataSearch(0);
    },
    async getTotalNum() {
      let form = JSON.parse(JSON.stringify(this.formSearchs[0].datas));
      form["dicID"] = 7843;
      form["Notice"] = "";
      form["Result"] = "";
      form["fields"] =
        "sum(case when Notice = '未通知' then 1 else 0 end) as Count_1 ,sum(case when Notice = '已通知' then 1 else 0 end) as Count_2,count(1) as Count_3";
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.Status1[0], "num", data[0].Count_3);
        this.$set(this.Status1[1], "num", data[0].Count_1);
        this.$set(this.Status1[2], "num", data[0].Count_2);
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