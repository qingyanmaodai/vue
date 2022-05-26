<!--备料任务指派-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0, 1,2, 3, 4]" :key="i" v-show="labelStatus1 == i">
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
            <el-col :span="4"
              ><span class="title">{{ title }}</span></el-col
            >
            <el-col :span="20" class="flex_flex_end">
              <div>
                <span>选择机台/班组：</span>
                <el-select
                  clearable
                  filterable
                  size="mini"
                  v-model="ruleForm.LineIDs"
                  @change="setFooterLabel"
                  style="width: 320px"
                >
                  <el-option
                    v-for="(item, i) in lines"
                    :key="i"
                    :label="item.LineName"
                    :value="item.LineID"
                  >
                  </el-option>
                </el-select>
                <span>生产时段：</span>
                <el-date-picker
                  v-model="ruleForm.ProducedDate"
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
          class="flex_column"
          :style="{ height: height }"
          v-show="labelStatus1 == 1"
        >
          <div class="spreadContainer" v-loading="tableLoading[1]">
            <gc-spread-sheets
              class="sample-spreadsheets"
              @workbookInitialized="initSpread"
            >
              <gc-worksheet></gc-worksheet>
            </gc-spread-sheets>
          </div>
          <div class="flex_row_spaceBtn pagination">
            <div>
              <span
                @click="toPageSetting(sysID[1].ID)"
                class="primaryColor cursor"
                >SysID:{{ sysID[1].ID }}
              </span>
            </div>
            <div class="flex">
              <el-pagination
                background
                @size-change="(val) => pageSize(val, 1)"
                :current-page="tablePagination[1].pageIndex"
                :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
                :page-size="tablePagination[1].pageSize"
                :total="tablePagination[1].pageTotal"
                @current-change="(val) => pageChange(val, 1)"
                layout="total, sizes, prev, pager, next,jumper"
              >
              </el-pagination>
            </div>
          </div>
        </div>
        <div
          v-for="item in [0, 2, 3, 4]"
          :key="item"
          v-show="labelStatus1 == item"
        >
          <ComVxeTable
            :rowKey="'RowNumber'"
            :ref="`tableRef${item}`"
            :height="height"
            :tableData="tableData[item]"
            :tableHeader="tableColumns[item]"
            :tableLoading="tableLoading[item]"
            :isEdit="isEdit"
            :hasSelect="hasSelect[item]"
            :remark="item"
            :cellStyle="cellStyle0"
            :sysID="sysID[item].ID"
            :isClear="isClear[item]"
            :footerLabel="footerLabel[item]"
            :pagination="tablePagination[item]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @keyupEnter="editSort"
            @sortChange="sortChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var _this;
const GCsheets = GC.Spread.Sheets;
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets/js/zh.js";
import ComSearch from "@/components/ComSearch";
import ComVxeTable from "@/components/ComVxeTable";
import {
  HighlightColumnItemsCellType,
  TopItemsCellType,
  HeaderCheckBoxCellType,
  SortHyperlinkCellType,
  HighlightRowItemsCellType,
} from "@/static/data.js";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
} from "@/api/Common";
export default {
  name: "PCBPlan_1",
  components: {
    ComSearch,
    ComVxeTable,
  },
  data() {
    return {
      ////////////////// Search /////////////////
      footerLabel: ["", "", "", "", "", "", ""],
      sysID: [
        { ID: 5156 },
        { ID: 5615 },
        { ID: 5641 },
        { ID: 5641 },
        { ID: 5641 },
        { ID: 5641 },
        { ID: 5156 },
      ],
      Status1: [
        { label: "PCB总排期", value: 0 },
        { label: "PCB月计划", value: 1 },
        // { label: "SMT待排", value: 2 },
        { label: "SMT已排", value: 2 },
        // { label: "补焊待排", value: 3 },
        { label: "补焊已排", value: 3 },
        { label: "已完成", value: 3 },
      ],
      title: "",
      labelStatus1: 1,
      PrepareDate: "",
      adminLoading: false,
      checkdBtnCodes: [],
      drawer: false,
      height: "707px",
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
        {
          datas: {},
          forms: [],
        },
      ],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "同步装配",
          Type: "primary",
          Ghost: true,
          Size: "small",
          signName: 1,
          Methods: "refreshPlan",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "warning",
          Ghost: true,
          Size: "small",
          signName: 1,
          Methods: "saveSort",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "计算排期",
          Type: "warning",
          Ghost: true,
          Size: "small",
          signName: 1,
          Methods: "computedPlan",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "转入月计划",
          Type: "danger",
          Ghost: true,
          Size: "small",
          signName: 0,
          Methods: "ToPlan",
          Icon: "",
        },
        // {
        //   ButtonCode: "save",
        //   BtnName: "转入日计划",
        //   Type: "primary",
        //   Ghost: true,
        //   Size: "small",
        //   signName: [2, 4],
        //   Methods: "setPlan",
        //   Icon: "",
        // },
        {
          ButtonCode: "save",
          BtnName: "转入SMT",
          Type: "primary",
          Ghost: true,
          Size: "small",
          signName: 1,
          Methods: "setPlan",
          Params: { ProcessID: "P202009092233201" },
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "转入补焊",
          Type: "primary",
          Ghost: true,
          Size: "small",
          signName: 1,
          Params: { ProcessID: "P202009092233413" },
          Methods: "setPlan",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "退回",
          Type: "danger",
          Ghost: true,
          signName: 1,
          Size: "small",
          Methods: "backData",
          Icon: "",
        },
        {
          ButtonCode: "save",
          BtnName: "保存",
          Type: "success",
          Ghost: true,
          Size: "small",
          signName: 0,
          Methods: "dataSave",
          Icon: "",
        },
      ],
      tableData: [[], [], [], [], [], [], []],
      delData: [[], [], [], [], [], [], []],
      tableColumns: [[], [], [], [], [], [], []],
      tableLoading: [false, false, false, false, false, false],
      isClear: [false, false, false, false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 500, pageTotal: 0 },
        { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
      ],
      height: "707px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      initialBtnData: [],
      tagRremark: 1,
      selectionData: [[], [], [], [], [], [], []],
      hasSelect: [true, true, false, true, false, false],
      isEdit: false,
      losePrepareDate: 1,
      losePrepareDate2: 1,
      ruleForm: {
        LineIDs: [],
        ProducedDate: "",
      },
      lines: [],
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    this.getLine();
    this.getTableHeader();
    // 获取所有按钮
    this.judgeBtn();
  },
    activated() {
    this.spread.refresh();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 450);
  },
  methods: {
    backData() {
      this.getSelectionData();
      console.log(this.selectionData[1]);
      if (this.selectionData[1].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.adminLoading = true;
        this.selectionData[1].forEach((a) => {
          a["ElementDeleteFlag"] = 1;
        });
        this.dataSave(this.selectionData[1], 0);
      }
    },
    // 跳转至页面配置
    toPageSetting(id) {
      this.$router.push({
        name: "FieldInfo",
        params: {
          ID: id,
        },
      });
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
    initSpread: function (spread) {
      this.spread = spread;
    },

    setData() {
      this.spread.suspendPaint();
      let sheet = this.spread.getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      let colHeader1 = [];
      let colInfos = [];

      this.tableColumns[1].forEach((x) => {
        if (x.prop == "LineID") {
          colInfos.push({
            name: x.prop,
            displayName: "线别",
            cellType: this.checkBoxCellTypeLine,
            size: parseInt(x.width),
          });
        } else {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width),
          });
        }
        colHeader1.push(x.label);
      });
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function (value, index) {
        sheet.setValue(0, index, value, GC.Spread.Sheets.SheetArea.colHeader);
      });
      sheet.setCellType(
        0,
        0,
        new HeaderCheckBoxCellType(),
        GCsheets.SheetArea.colHeader
      );

      // 选框
      let checkbox = {
        name: "isChecked",
        displayName: "isChecked",
        cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
        size: 60,
      };
      for (var name in checkbox) {
        colInfos[0][name] = checkbox[name];
      }

      //  colInfos.unshift(checkbox);

      var row = sheet.getRange(
        0,
        -1,
        1,
        -1,
        GC.Spread.Sheets.SheetArea.colHeader
      );
      row.backColor("#f3f3f3");
      row.foreColor("#000000d9");
      row.font("12px basefontRegular, Roboto, Helvetica, Arial, sans-serif");
      var defaultStyle = new GC.Spread.Sheets.Style();
      defaultStyle.font =
        "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
      defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
      defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
        "1px solid #CCCCCC",
        GC.Spread.Sheets.LineStyle.min
      );
      defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
        "1px solid #CCCCCC",
        GC.Spread.Sheets.LineStyle.min
      );
      defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
        "1px solid transparent",
        GC.Spread.Sheets.LineStyle.min
      );
      defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
        "1px solid transparent",
        GC.Spread.Sheets.LineStyle.min
      );
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
      // 冻结第一列

      sheet.frozenColumnCount(this.tableColumns[1][0].FixCount);

      sheet.setDataSource(this.tableData[1]);
      sheet.bindColumns(colInfos);

      let cellIndex = 0;
      this.tableColumns[1].forEach((m) => {
        //行，start,end
        if (m.isEdit) {
          sheet.getRange(-1, cellIndex, 1, 1).locked(false);
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport
          );
          cell.foreColor("#2a06ecd9");
        } else {
          // var cell = sheet.getCell(
          //   -1,
          //   cellIndex,
          //   GC.Spread.Sheets.SheetArea.viewport
          // );
          // cell.foreColor("gray");
        }

        cellIndex++;
      });

      let colindex = 0;
      let colindex2 = 0;
      console.log(this.tableColumns[1]);
      this.tableColumns[1].forEach((m, index) => {
        if (m.prop == "IsToPlanDay1") {
          colindex = index;
        } else if (m.prop == "IsToPlanDay2") {
          colindex2 = index;
        }
      });

      this.tableData[1].forEach((row, index) => {
        var rowSheet = sheet.getRange(
          index,
          colindex,
          1,
          1,
          GC.Spread.Sheets.SheetArea.viewport
        );

        if (row["IsToPlanDay1"] == "是") {
          rowSheet.backColor("#4CD964");
          rowSheet.foreColor("balck");
        } else if (row["IsToPlanDay1"] == "否") {
          // row.backColor();
          rowSheet.backColor("#FFFF00");
          rowSheet.foreColor("black");
        } else if (row["IsToPlanDay1"] == "无SMT") {
          // row.backColor();
          rowSheet.foreColor("black");
          rowSheet.backColor("");
        }

        rowSheet = sheet.getRange(
          index,
          colindex2,
          1,
          1,
          GC.Spread.Sheets.SheetArea.viewport
        );
        if (row["IsToPlanDay2"] == "是") {
          rowSheet.backColor("#4CD964");
          rowSheet.foreColor("balck");
        } else if (row["IsToPlanDay2"] == "否") {
          // row.backColor();
          rowSheet.backColor("#FFFF00");
          rowSheet.foreColor("black");
        } else if (row["IsToPlanDay2"] == "无补焊") {
          // row.backColor();
          rowSheet.foreColor("black");
          rowSheet.backColor("");
        }

        let cellIndex = 0;
        this.tableColumns[1].forEach((m) => {
          //行，start,end
          if (m.DataType == "bit" && m.isEdit) {
            var cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
            cellType.caption("");
            cellType.textTrue("");
            cellType.textFalse("");
            cellType.textIndeterminate("");
            cellType.textAlign(
              GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center
            );
            cellType.isThreeState(false);
            sheet.getCell(index, cellIndex).cellType(cellType);
          }
          cellIndex++;
        });
      });
      /////////////////表格事件/////////////
      this.spread.bind(GCsheets.Events.ButtonClicked, (e, args) => {
        const { sheet, row, col } = args;
        const cellType = sheet.getCellType(row, col);
        if (cellType instanceof GCsheets.CellTypes.Button) {
        }
        if (cellType instanceof GCsheets.CellTypes.CheckBox) {
        }
        if (cellType instanceof GCsheets.CellTypes.HyperLink) {
        }
      });
      //表格编辑事件

      this.spread.bind(GCsheets.Events.EditStarting, function (e, args) {});
      this.spread.bind(GCsheets.Events.EditEnded, function (e, args) {
        // 自动计算数量
        // for (var i = args.col + 1; i < _this.tableColumns[1].length; i++) {
        //   sheet.setArray(args.row, i, [2021]);
        // }
      });
      this.spread.resumePaint();
      this.adminLoading = false;
      this.tableLoading[1] = false;
      sheet.options.protectionOptions.allowResizeColumns = true;
      sheet.options.isProtected = true;
    },
    async ToPlan() {
      //转入月计划

      if (this.selectionData[0].length == 0) {
        this.$message({
          message: "请选择要操作的数据",
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.adminLoading = true;
        let res = await GetSearch(
          this.selectionData[0],
          "/APSAPI/InsertIntoPCBByOrderID"
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
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[1] = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            this.selectionData[1].push(x);
          }
        });
      }
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
        // this.formSearchs[0].datas["PrepareStatus"] = "";
        // this.formSearchs[0].datas["sort"] = "PrepareStatus asc";
        // this.formSearchs[2].datas["ProcessID"] = "P202009092233201";
        // this.formSearchs[2].datas["SchedulingStatus"] = "0";
        this.formSearchs[2].datas["ProcessID"] = "P202009092233201";
        this.formSearchs[2].datas["SchedulingStatus"] = "1";

        // this.formSearchs[4].datas["ProcessID"] = "P202009092233413";
        // this.formSearchs[4].datas["SchedulingStatus"] = "0";
        this.formSearchs[3].datas["ProcessID"] = "P202009092233413";
        this.formSearchs[3].datas["SchedulingStatus"] = "1";
        this.formSearchs[4].datas["productionstatus"] = "25";

        this.getTableData(this.formSearchs[1].datas, 1);

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
        // if(data.length != 0){
        //   data.forEach(a=>{
        //     a.ViewSort = a.RowNumber
        //   })
        // } // 只能强行给1-最后用来行号测试，不确定后台数据怎么存，一开始这些数据就不是从1开始排序

        this.$set(this.tableData, remarkTb, data);
        if (remarkTb == 1) {
          this.setData();
        }
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    // 填写行号自动排好序
    editSort(row, val, prop, index) {
      if (this.labelStatus1 != 0) {
        return;
      }
      let newData = [];
      let newData_1 = [];
      let newData_2 = [];
      let newData_3 = [];
      let newData_4 = [];
      if (val < row.RowNumber) {
        // 改成比之前更小的行号 row.RowNumber为目标行数
        newData_1 = this.tableData[1].filter(
          (a) => parseInt(a.ViewSort) < parseInt(val)
        ); //把最终行号的前面的数取出来
        newData_2 = this.tableData[1].filter((b) => {
          return (
            parseInt(b.RowNumber) >= parseInt(val) &&
            parseInt(b.RowNumber) != parseInt(row.RowNumber)
          );
        }); //把前面的数过滤掉且过滤掉自身
        newData_3 = [row];
        newData = newData_1.concat(newData_3).concat(newData_2);
      } else {
        // 改成比原来大的数
        newData_1 = this.tableData[1].filter(
          (a) => parseInt(a.ViewSort) < parseInt(row.RowNumber)
        ); //把最终行号的前面的数取出来
        newData_2 = this.tableData[1].filter((b) => {
          return (
            parseInt(b.RowNumber) > parseInt(row.RowNumber) &&
            parseInt(b.RowNumber) <= parseInt(val)
          );
        }); //把介于两数之间，大于原来的数，小于目标数的数拿出来
        newData_3 = [row];
        newData_4 = this.tableData[1].filter((b) => {
          return parseInt(b.RowNumber) > parseInt(val);
        });
        newData = newData_1
          .concat(newData_2)
          .concat(newData_3)
          .concat(newData_4);
      }

      let realyData = JSON.parse(JSON.stringify(newData));
      realyData.forEach((c, i) => {
        c.ViewSort = i + 1;
        c.RowNumber = i + 1;
      });
      this.$set(this.tableData, 0, realyData);
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.dataSearch(index);
    },

    // 同步装配排程
    async refreshPlan(row, prop, val, index) {
      this.adminLoading = true;
      let res = await GetSearch("", "/APSAPI/InsertIntoPCB");
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
    },

    // 保存排序
    async saveSort() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows();
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          submitData.push(x.item);
        });
      }
      if (submitData.length == 0) {
        this.$message.error("没修改过任何数据！");
        return;
      }
      this.adminLoading = true;
      let res = await SaveData(submitData);

      const { result, data, count, msg } = res.data;

      if (result) {
        this.dataSearch(1);
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
      this.adminLoading = false;
    },
    // 清空排期
    clearPlan(remarkTb) {
      if (this.selectionData[remarkTb].length != 0) {
        this.selectionData[remarkTb].forEach((a) => {
          a.StartDate = "";
        });
      }
    },
    // 计算PCB排程
    async computedPlan(remarkTb) {
      this.getSelectionData();
      this.adminLoading = true;
      this.selectionData[1].forEach((m) => {
        m["isChecked"] = true;
      });
      let res = await GetSearch(
        this.selectionData[1],
        "/APSAPI/MOPlanStep1CalculationV2"
      );
      //console.log(this.selectionData[remarkTb].);
      const { result, data, count, msg } = res.data;

      if (result) {
        this.adminLoading = false;
        this.$set(this.tableData, 1, data);
        // 重新勾选上
        this.selectionData[1] = [];
        this.dataSearch(1);
        // let refName = "tableRef" + remarkTb;
        // data.forEach((b) => {
        //   this.$nextTick(() => {
        //     this.$refs[refName][1].$refs.vxeTable.setCheckboxRow(b, true);
        //   });
        //   this.selectionData[remarkTb].push(b);
        // });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },

    // 保存
    async dataSave(data1, index) {
      this.adminLoading = true;

      let res = await SaveData(data1);
      const { result, data, count, msg } = res.data;

      if (result) {
        this.dataSearch(1);
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
      this.adminLoading = false;
    },
    // 转入日计划
    async setPlan(remarkTb, index, params) {
      this.getSelectionData();
      if (this.ruleForm.LineIDs.length == 0 && false) {
        this.$message.error("请选择生产线再转入日计划！");
      } else {
        if (this.selectionData[remarkTb].length == 0) {
          this.$message.error("请选择需要转入日计划的数据！");
        } else {
          let ProcessID = "";
          this.adminLoading = true;
          // if (remarkTb == 1) {
          //   ProcessID = "P202009092233201";
          // } else if (remarkTb == 3) {
          //   ProcessID = "P202009092233413";
          // }

          let errMsg = "";
          let okCount = 0;
          this.selectionData[remarkTb].forEach((d) => {
            let isOk = true;
            //判断是否转入
            if (
              params.ProcessID == "P202009092233201" &&
              d["IsToPlanDay1"] != "否"
            ) {
              isOk = false;
            } else if (
              params.ProcessID == "P202009092233413" &&
              d["IsToPlanDay2"] != "否"
            ) {
              isOk = false;
            }

            if (isOk) {
              d["LineIDs"] = this.ruleForm.LineIDs;
              d["ProducedDate"] = this.ruleForm.ProducedDate;
              d["ProcessID"] = params.ProcessID;
              d["LineID"] = null;
              okCount++;
            } else {
              errMsg += d["OrderNo"] + "已转入或者无此工序";
            }
          });

          if (errMsg != "") {
            this.$message({
              message: errMsg,
              type: "error",
              dangerouslyUseHTMLString: true,
            });
          }
          if (okCount > 0) {
            let res = await GetSearch(
              this.selectionData[remarkTb],
              "/APSAPI/MOPlanSaveToDayPlanV2?isPlan=1"
            );
            const { result, data, count, msg } = res.data;
            if (result) {
              this.adminLoading = false;
              this.dataSearch(remarkTb);
            } else {
              this.adminLoading = false;
              this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true,
              });
            }
          } else {
             this.adminLoading = false;
          }
        }
      }
    },
    // 选线获取剩余工时
    setFooterLabel(val) {
      let LineIDs = this.lines.filter((a) =>
        this.ruleForm.LineIDs.some((b) => b == a.LineID)
      );
      let LineName = LineIDs.map((c) => c.LineName).join(",");
      //查询线别剩余工时
      let StrValue = `提示：当前所选${LineName}线，在${this.ruleForm.ProducedDate}共有350个小时，已占用250小时，剩余100小时【已选4项，预计占用50小时，剩余50小时】`;
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