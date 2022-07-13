<!-- SMT周计划 -->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_container" style="width: 100%">
      <div class="admin_head" ref="headRef">
        <ComSearch
          v-show="labelStatus1 != 4"
          ref="searchRef"
          :searchData="formSearchs[tagRemark].datas"
          :searchForm="formSearchs[tagRemark].forms"
          :remark="tagRemark"
          :btnForm="btnForm"
          :signName="labelStatus1"
          @btnClick="btnClick"
        />
        <ComSearch
          v-show="labelStatus1 == 4"
          ref="searchRef"
          :searchData="formSearchs[1].datas"
          :searchForm="formSearchs[1].forms"
          :remark="1"
          :btnForm="btnForm"
          :signName="labelStatus1"
          @btnClick="btnClick"
        />
      </div>
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="4">
                <span class="title">{{ title }}</span>
              </el-col>
              <el-col :span="20" class="flex_flex_end">
                <el-input-number
                  v-model="AutoDays2"
                  type="number"
                  v-show="labelStatus1 != 4"
                  size="small"
                  placeholder="请选择周期"
                >
                </el-input-number>
                <el-divider direction="vertical"></el-divider>
                <!-- <el-button
                  type="primary"
                  size="mini"
                  v-show="labelStatus1 != 4"
                  @click="MOPlanStep1Calculation(0)"
                >
                  预排运算
                </el-button> -->
                <el-button
                  v-show="labelStatus1 == 1"
                  type="primary"
                  size="mini"
                  @click="MOPlanStep1Calculation"
                >
                 匹配拉线
                </el-button>
                <el-button
                  v-show="labelStatus1 == 1"
                  type="success"
                  size="mini"
                  @click="MOPlanSaveToDayPlan"
                >
                  更新计划
                </el-button>
                <!-- <el-button
                  v-show="labelStatus1 == 1"
                  type="warning"
                  size="mini"
                  @click="insertList"
                >
                  进入分线列表
                </el-button>
                <el-button
                  v-show="labelStatus1 == 1"
                  type="warning"
                  size="mini"
                  @click="subSAP"
                >
                  提交同步申请
                </el-button> -->
                <!-- <el-button
                  v-show="labelStatus1 == 4"
                  type="primary"
                  size="mini"
                  @click="MOPlanStep1Calculation"
                >
                  1.匹配拉线
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  v-show="labelStatus1 == 4"
                  type="warning"
                  size="mini"
                  @click="dataComputedDate"
                >
                  2.配套计算
                </el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  v-show="labelStatus1 == 4"
                  type="success"
                  size="mini"
                  @click="MOPlanSaveToDayPlan"
                >
                  3.更新计划
                </el-button> -->
                <el-divider direction="vertical"></el-divider>
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

          <!-- <div v-show="labelStatus1 <=2"> -->
	  <div>
            <div class="admin_content">
              <div class="flex_column" :style="{ height: height }">
                <div class="spreadContainer" v-loading="tableLoading[tagRemark]">
                  <gc-spread-sheets
                    class="sample-spreadsheets"
                    @workbookInitialized="initSpread"
                  >
                    <gc-worksheet></gc-worksheet>
                  </gc-spread-sheets>
                </div>
              </div>
              <div class="flex_row_spaceBtn pagination">
                <div>
                  <span @click="toPageSetting" class="primaryColor cursor"
                    >SysID:{{sysID[tagRemark].ID}}
                  </span>
                </div>
                <div class="flex">
                  <el-pagination
                    background
                    @size-change="(val) => pageSize(val, 0)"
                    :current-page="tablePagination[tagRemark].pageIndex"
                    :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
                    :page-size="tablePagination[tagRemark].pageSize"
                    :total="tablePagination[tagRemark].pageTotal"
                    @current-change="(val) => pageChange(val, 0)"
                    layout="total, sizes, prev, pager, next,jumper"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
          <!--<ComVxeTable
            ref="tableRefTwo"
            v-show="labelStatus1 == 3"
            :rowKey="'RowNumber'"
            :height="height"
            :hasSelect="true"
            :tableData="tableData[2]"
            :tableHeader="tableColumns[2]"
            :tableLoading="tableLoading[2]"
            :remark="2"
            :sysID="sysID[2].ID"
            :isEdit="isEdit"
            :showFooter="true"
            :includeFields="includeFields"
     
          
            :isClear="isClear[2]"
            :showPagination="false"
            :pagination="tablePagination[2]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @changeline="changeline"
            @sortChange="sortChange"
          />

          <ComVxeTable
            ref="tableRefTwo"
            v-show="labelStatus1 == 4"
            :rowKey="'RowNumber'"
            :height="height"
            :hasSelect="true"
            :tableData="tableData[1]"
            :tableHeader="tableColumns[1]"
            :tableLoading="tableLoading[1]"
            :remark="1"
            :sysID="sysID[1].ID"
            :isEdit="isEdit"
            :showFooter="true"
            :includeFields="includeFields"
            :cellStyle="cellStyle"
            :tableRowClassName="tableRowClassName"
            :isClear="isClear[1]"
            :showPagination="true"
            :pagination="tablePagination[1]"
            @pageChange="pageChange"
            @pageSize="pageSize"
            @selectfun="selectFun"
            @changeline="changeline"
            @sortChange="sortChange"
          />-->
          <div style="color: red; font-weight: bold">{{ this.resultMsg }}</div>
        </div>
      </div>
    </div>
    <!-- 点击齐套率弹框-->
    <DialogTable title="全局欠料" :tableDialog="colDialogVisible" :sysID="5594" width="80%" @closeDialog="colDialogVisible =false" :searchForm="dialogSearchForm" :isToolbar="false"></DialogTable>
  </div>
</template>

<script>
var _this;

const GCsheets = GC.Spread.Sheets;
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets/js/zh.js";
GC.Spread.Common.CultureManager.culture("zh-cn");
import ComSearch from "@/components/ComSearch";
import ComAsideTree from "@/components/ComAsideTree";
import ComVxeTable from "@/components/ComVxeTable";
import DialogTable from "@/components/Dialog/dialogTable";
import {
  HighlightColumnItemsCellType,
  TopItemsCellType,
  HeaderCheckBoxCellType,
  SortHyperlinkCellType,
  HighlightRowItemsCellType,
} from "@/views/PageTwoScheduling/OrderSetExcel/data.js";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
  GetOrgData,
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import { MOPlanStep1, MOPlanStep1Calculation } from "@/api/wjApi";

import {
  SaveMOPlanStep4,
  SaveMOPlanStep2,
  OrderPlanMaterialForm,
} from "@/api/PageTwoScheduling";
import { template } from "xe-utils";
export default {
  name: "WeekManagement",
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComFormDialog,
    DialogTable
  },
  data() {
    return {
      dialogSearchForm:{
        OrderID:'',
      },
      colDialogVisible:false,
      includeFields: ["Qty"], // 包含合计的字段
      labelStatus1: 1,
      Status1: [
        { label: "全部", value: "" },
        { label: "待排产", value: 0 },
        { label: "已排产", value: 1 },
        { label: "暂停", value: 2 },
        // { label: "分线列表", value: 4 },
      ],
      title: "周计划管理列表",
      resultMsg: "",
      delData: [[]],
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
      ],
      parmsBtn: [
        // {
        //   ButtonCode: "save",
        //   BtnName: "计算排期",
        //   Type: "primary",
        //   Ghost: true,
        //   Size: "small",
        //   signName: [0, 1, 2, 3],
        //   Methods: "computedScheduling",
        //   Icon: "",
        // },
        // {
        //   ButtonCode: "save",
        //   BtnName: "下发周计划",
        //   Type: "primary",
        //   Ghost: true,
        //   signName: [0, 1, 2, 3],
        //   Size: "small",
        //   Methods: "setWeekData",
        //   Icon: "",
        // },
        // {
        //   ButtonCode: "save",
        //   BtnName: "暂停",
        //   Type: "danger",
        //   Ghost: true,
        //   signName: [0, 1, 2, 3],
        //   Size: "small",
        //   Methods: "parseData",
        //   Icon: "",
        // },
        {
          ButtonCode: "save",
          BtnName: "保存",
          isLoading: false,
          Methods: "save",
          Type: "success",
          Icon: "",
          signName:1,
          Size: "small",
        },
        //        {
        //   ButtonCode: "save",
        //   BtnName: "保存",
        //   isLoading: false,
        //   Methods: "save4",
        //   Type: "success",
        //   Icon: "",
        //   signName:4,
        //   Size: "small",
        // },
        {
          ButtonCode: "save",
          BtnName: "恢复",
          isLoading: false,
          Methods: "recovery",
          Type: "success",
          signName: 3,
          Icon: "",
          Size: "small",
          Params: { dataName: "selectionData",remarkTb:2 },
        },
        // {
        //   ButtonCode: "save",
        //   BtnName: "退回",
        //   Type: "danger",
        //   Ghost: true,
        //   signName: 4,
        //   Size: "small",
        //   Methods: "backData",
        //   Icon: "",
        // },
        // {
        //   ButtonCode: "save",
        //   BtnName: "返回",
        //   Type: "success",
        //   Ghost: true,
        //   Size: "small",
        //   signName: [0, 1, 2, 3],
        //   Methods: "reData",
        //   Icon: "",
        // },
      ],
      selectionData: [[], [],[]],
      btnForm: [],
      tableData: [[], [],[]],
      tableColumns: [[], [],[]],
      tableLoading: [false, false, false],
      isClear: [false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isEdit: false,
      clickData: {},
      isUpdate: true,
      adminLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      sysID: [{ ID: 7944, AutoDays2: this.AutoDays2 }],
      //sysID: [{ ID: 7942, AutoDays2: this.AutoDays2 }, { ID: 7944 },{ ID: 5585 }],
      userInfo: {},
      IsPurchaseBoss: false,
      ReplyDate: "",
      AutoDays2: 30,
      NoWorkHour: [],
      LineViewSort: [],
      spread: null,
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
    };
  },
  computed: {},
  created() {
    _this = this;

    this.userInfo = this.$store.getters.userInfo;
    this.judgeBtn();
    this.getTableHeader();
  },
  activated() {
    this.spread.refresh();
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
    async subSAP() {
      this.getSelectionData(1);
      this.adminLoading = true;
      let newData = this.selectionData[this.tagRemark];
      let pushData = [];
      newData.forEach((m) => {
        m["dicID"] = 7967;
        // if (m["Extend8"] == "待同步") {
        //   this.$message.error(m["OrderNo"] + "已经待同步了");
        // } else {
        //   if (m["Extend8"] != "已同步") {
        //     m["Extend8"] = "待同步";
        //   }
           pushData.push(m);
        // }
      });
      if (pushData.length > 0) {
        let res = await GetSearch(pushData,'/APSAPI/UpdateOrderStartDate');
        const { result, data, count, msg } = res.data;
                this.adminLoading = false;
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
      } else {
        this.$message.error("请选择需要操作的数据,在同步中的不能再次操作");
                this.adminLoading = false;
      }
    },
    schedulingPre() {
      this.getSelectionData();
    },
    setData() {
      //sheet获取
      this.spread.suspendPaint();
      let sheet = this.spread.getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      let colHeader1 = [];
      let colInfos = [];

      this.tableColumns[0].forEach((x) => {
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
      var defaultStyle = new GC.Spread.Sheets.Style();
      defaultStyle.font =
        "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
      defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
      defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.center;
      defaultStyle.borderLeft = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderTop = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderRight = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );
      defaultStyle.borderBottom = new GC.Spread.Sheets.LineBorder(
        "gray",
        GC.Spread.Sheets.LineStyle.thin
      );

      defaultStyle.showEllipsis = true;
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);

      // 冻结第一列

      sheet.frozenColumnCount(this.tableColumns[0][1].FixCount);

      sheet.setDataSource(this.tableData[0]);
      sheet.bindColumns(colInfos);

      let colindex = 0;
      for (let m of colInfos) {
        if (m.name == "Capacity") {
          var rowSheet = sheet.getRange(
            -1,
            colindex,
            1,
            1,
            GC.Spread.Sheets.SheetArea.viewport
          );
          rowSheet.hAlign(GC.Spread.Sheets.HorizontalAlign.center);
          rowSheet.foreColor("red");
          break;
        }
        colindex++;
      }

      this.tableData[0].forEach((row, index) => {
        var rowSheet = sheet.getRange(
          index,
          0,
          1,
          colindex,
          GC.Spread.Sheets.SheetArea.viewport
        );
        var rowSheet2 = sheet.getRange(
          index,
          colindex,
          1,
          colInfos.length - colindex,
          GC.Spread.Sheets.SheetArea.viewport
        );
        // 齐套列
        var rowSheet3  = ''
        if(_this.tableColumns[0].length){
          for(let i=0;i<_this.tableColumns[0].length;i++){
            let item = _this.tableColumns[0][i]
            if(item.name ==="K1"){
                 rowSheet3 = sheet.getCell(
                  index,//行
                  i,//列
                  GC.Spread.Sheets.SheetArea.viewport
                );
                break
              }
          }
        }

        if (row["Code"] == null) {
          rowSheet.backColor("#A0CFFF");
          rowSheet.foreColor("balck");
          rowSheet2.backColor("#A0CFFF");
          rowSheet2.foreColor("balck");
          if(rowSheet3&&row["K1"] !="100.00%"){//不齐套时字体为红色
            rowSheet3.foreColor("red");
          }
        } else if (row["MFGOrganizeID"] === 162) {
          // row.backColor();
          rowSheet.backColor("#FFFF00");
          rowSheet.foreColor("black");
          rowSheet2.backColor("#FFFF00");
          if(rowSheet3&&row["K1"] !="100.00%"){//不齐套时字体为红色
            rowSheet3.foreColor("red");
          }
        } else if (row["SchedulingResult"] === "超期") {
          // row.backColor();
          rowSheet.backColor("#C2E7B0");
          rowSheet.foreColor("black");
          if(rowSheet3&&row["K1"] !="100.00%"){//不齐套时字体为红色
            rowSheet3.foreColor("red");
          }
        } 
         else if (row["DBResult"] != "计算成功"&&row["DBResult"]!=""&&row["DBResult"]!=null) {
          // row.backColor();
          rowSheet.backColor("#C2E7B0");
          rowSheet.foreColor("red");
          if(rowSheet3&&row["K1"] !="100.00%"){//不齐套时字体为红色
            rowSheet3.foreColor("red");
          }
        } 
        else if(rowSheet3&&row["K1"] !="100.00%"){//不齐套时字体为红色
          rowSheet.foreColor("black");
          rowSheet2.foreColor("balck");
          rowSheet3.foreColor("red");
        }
        else {
          // row.backColor();
          rowSheet.foreColor("black");
          rowSheet.backColor("");
          rowSheet.foreColor("black");
          rowSheet2.backColor("");
        }
        let cellIndex = 0;
        this.tableColumns[0].forEach((m) => {
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
          if (m.ControlType == "combobox" && m.isEdit) {
            var cellType = new GC.Spread.Sheets.CellTypes.ComboBox();
            cellType.editorValueType(
              GC.Spread.Sheets.CellTypes.EditorValueType.value
            );

            //    let newData = [];
            // if (row[m.DataSourceName].length != 0) {
            //   row[m.DataSourceName].forEach((x) => {
            //     newData.push({ text: x.OrganizeName, value: x.OrganizeID });
            //   });
            // }

            cellType.items(row[m.DataSourceName]);

            sheet.getCell(index, cellIndex).cellType(cellType);
          }
          cellIndex++;
        });
      });

      let cellIndex = 0;
      this.tableColumns[0].forEach((m) => {
        //行，start,end
        if (m.isEdit) {
          sheet.getRange(-1, cellIndex, 1, 1).locked(false);
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport
          );
          //cell.foreColor("#2a06ecd9");
        } else {
          var cell = sheet.getCell(
            -1,
            cellIndex,
            GC.Spread.Sheets.SheetArea.viewport
          );
          cell.foreColor("gray");
        }

        cellIndex++;
      });
      //  sheet.options.isProtected = true;
      sheet.options.protectionOptions.allowResizeColumns = true;
      sheet.options.protectionOptions.allowInsertRows = true;
      sheet.options.protectionOptions.allowDeleteRows = true;
      sheet.options.protectionOptions.allowSelectLockedCells = true;
      sheet.options.protectionOptions.allowSelectUnlockedCells = true;
      sheet.options.protectionOptions.allowDeleteRows = true;
      sheet.options.protectionOptions.allowDeleteColumns = true;
      sheet.options.protectionOptions.allowInsertRows = true;
      sheet.options.protectionOptions.allowInsertColumns = true;
      sheet.options.protectionOptions.allowDargInsertRows = true;
      sheet.options.protectionOptions.allowDragInsertColumns = true;
      sheet.options.allowUserDragDrop = true;
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




      var insertRowsCopyStyle = {
        canUndo: true,
        name: "insertRowsCopyStyle",
        execute: function (context, options, isUndo) {
          var Commands = GC.Spread.Sheets.Commands;
          if (isUndo) {
            Commands.undoTransaction(context, options);
            return true;
          } else {
            sheet.suspendPaint();
            sheet.addRows(options.activeRow, _this.sheetSelectRows.length);
            //  sheet.setArray(options.activeRow, 0,_this.sheetSelectRows);
            //删除旧行
            if (_this.sheetSelectObj.start > options.activeRow) {
              //说明从下面插入上面
              sheet.copyTo(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                0,
                options.activeRow,
                0,
                _this.sheetSelectRows.length,
                sheet.getColumnCount(),
                GC.Spread.Sheets.CopyToOptions.style
              );
              sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start + _this.sheetSelectRows.length,
                _this.sheetSelectObj.count
              );
              // sheet.removeRow(_this.sheetSelectObj.start+ _this.sheetSelectRows.length)
            } else {
              //从上面往下面插入
              sheet.copyTo(
                _this.sheetSelectObj.start,
                0,
                options.activeRow,
                0,
                _this.sheetSelectRows.length,
                sheet.getColumnCount(),
                GC.Spread.Sheets.CopyToOptions.all
              );
              sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start,
                _this.sheetSelectObj.count
              );
            }
            // Commands.startTransaction(context, options);

            // sheet.suspendPaint();

            // var beforeRowCount = 0;

            //  sheet.suspendPaint();

            // Commands.endTransaction(context, options);
            sheet.resumePaint();

            return true;
          }
        },
      };

      //修改剪切,已经不用
      var insertRowsCut = {
        canUndo: true,
        name: "insertRowsCut",
        execute: function (context, options, isUndo) {
          var Commands = GC.Spread.Sheets.Commands;
          if (isUndo) {
            Commands.undoTransaction(context, options);
            return true;
          } else {
            context.commandManager().execute(options);
            this.sheetSelectRows = sheet.getArray(
              options.selections[0].row,
              0,
              options.selections[0].rowCount,
              sheet.getColumnCount()
            );
            this.sheetSelectObj.start = options.selections[0].row;

            this.sheetSelectObj.count = options.selections[0].rowCount;
            return true;
          }
        },
      };

      this.spread
        .commandManager()
        .register("insertRowsCopyStyle", insertRowsCopyStyle);
      //修改剪切
      this.spread.commandManager().register("insertRowsCut", insertRowsCut);

      function MyContextMenu() {}
      MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
        this.spread
      );
      MyContextMenu.prototype.onOpenMenu = function (
        menuData,
        itemsDataForShown,
        hitInfo,
        spread
      ) {
        itemsDataForShown.forEach(function (item, index) {
          if (item && item.name === "gc.spread.rowHeaderinsertCutCells") {
            item.command = "insertRowsCopyStyle";
          }
          //  else if (item && item.name === "gc.spread.cut") {

          //     item.command = "insertRowsCut";
          //   }
        });
      };
      var contextMenu = new MyContextMenu();
      this.spread.contextMenu = contextMenu;
      // 剪贴板事件绑定
      sheet.bind(
        GC.Spread.Sheets.Events.ClipboardChanged,
        function (sender, args) {
          let s = sheet.getSelections()[0];
          _this.sheetSelectRows = sheet.getArray(
            s.row,
            0,
            s.rowCount,
            _this.tableColumns[0].length
          );
          _this.sheetSelectObj.start = s.row;

          _this.sheetSelectObj.count = s.rowCount;
        }
      );
      
      // 表格单击齐套率弹框事件
      this.spread.bind(GCsheets.Events.CellClick, function (e, args) {
          if(_this.tableColumns[0].length){
            _this.tableColumns[0].map((item,index)=>{
              if(item.name ==="K1"&&args.col===index){
                // 显示ERP供需平衡表
                _this.colDialogVisible =true
                _this.dialogSearchForm.OrderID = _this.tableData[_this.tagRemark][args.row].OrderID
              }
            })
          }
      });

      //表格编辑事件

      this.spread.bind(GCsheets.Events.EditStarting, function (e, args) {});
      this.spread.bind(GCsheets.Events.EditEnded, function (e, args) {
        // 自动计算数量
        // _this.computedNum(args.row, args.col, args.editingText);
        // for (var i = args.col + 1; i < _this.tableColumns[0].length; i++) {
        //   sheet.setArray(args.row, i, [2021]);
        // }
      });
      this.spread.resumePaint();
      this.adminLoading = false;
      this.tableLoading[0] = false;
      this.spread.refresh(); //重新定位宽高度
    },
    // 监听键盘
    keyDown() {
      document.onkeydown = (e) => {
        //事件对象兼容
        let e1 =
          e || event || window.event || arguments.callee.caller.arguments[0];

        if (e.ctrlKey && e.keyCode == 83) {
          e.preventDefault();
          e.returnValue = false;

          this.dataSaveDay();
          return false;
        }
      };
    },
    // 获取选中的数据，type:0需要验证工艺，1不需要
    getSelectionData(type) {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      let resultTag = false;
      this.selectionData[this.tagRemark] = [];
      if (newData.length != 0) {
        newData.forEach((x, y) => {
          if (x.isChecked) {
            if (!x.ProcessGroupID) {
              resultTag = true;
              this.$message.error("第" + (y + 1) + "行工艺不能为空");
            } else {
              this.selectionData[this.tagRemark].push(x);
            }
          }
        });
      }
      if (resultTag && type === 0) {
        //
        this.selectionData[this.tagRemark] = [];
      }
    },
    // 跳转至页面配置
    toPageSetting() {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: this.sysID[this.tagRemark].ID },
      });
    },
    initSpread: function (spread) {
      this.spread = spread;
    },
    changenoworkhours(item, value, prop, index, a, b) {
      if (this.NoWorkHour.findIndex((m) => m.OrderID == item.OrderID) === -1) {
        this.NoWorkHour.push(item);
      }
    },
    changeline(item, value, prop, index, a, b) {
      item.拉线.forEach((m) => {
        if (item.LineID === m.OrganizeID) {
          let tmp = m;
          if (
            this.LineViewSort.findIndex(
              (m2) => m2.OrganizeID === m.OrganizeID
            ) == -1
          ) {
            this.LineViewSort.push(tmp);
          } else {
            tmp =
              this.LineViewSort[
                this.LineViewSort.findIndex(
                  (m2) => m2.OrganizeID === m.OrganizeID
                )
              ];
          }
          item.ViewSort = tmp.ViewSort;
          tmp.ViewSort = tmp.ViewSort + 1;
        }
      });
    },
    searchTree(msg) {
      this.treeData = [];
      let treeListTmp = JSON.parse(JSON.stringify(this.treeListTmp));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp)
        : JSON.parse(JSON.stringify(treeListTmp));
      this.treeData.push(...tmp);
    },
    rebuildData(value, arr) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        arr.forEach((element) => {
          if (element.SupplierName.indexOf(value) > -1) {
            // const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: element.children,
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children);
              const obj = {
                ...element,
                children: ab,
              };
              if (ab && ab.length > 0) {
                newarr.push(obj);
              }
            }
          }
        });
      }
      return newarr;
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
    handleChanged(file, fileList) {
      var ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = ext === "xlsx" || ext === "xls";
      if (!extension) {
        this.$message.error("上传文件格式只能为xlsx/xls");
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 50MB!");
        // 取消时在文件列表中删除该文件
        this.$refs.upload.handleRemove(file);
        return false;
      } else {
        this.file = file;
        this.fileList = fileList;
      }
    },
    handleRemove(file) {
      this.fileList.splice(
        this.fileList.findIndex((item) => item.url === file.url),
        1
      );
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
      this.treeHeight = document.documentElement.clientHeight - 150 + "px";
      let headHeight = this.$refs.headRef.offsetHeight;

      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      let newHeight = rem + "px";
      this.$set(this, "height", newHeight);
    },
    // 编辑行
    editRow(row) {},
    // 删除行
    delRow(row) {},
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
      this.$set(this.isClear, remarkTb, true);
      this.$set(this.tableLoading, remarkTb, true);
      this.tablePagination[remarkTb].pageIndex = 1;
      this.formSearchs[remarkTb].datas["ControlID"] =
        this.userInfo.WorkFlowInstanceID;
      this.getTableData(this.formSearchs[remarkTb].datas, remarkTb);
      setTimeout(() => {
        this.$set(this.isClear, remarkTb, false);
      }, 500);
    },
    // 重置
    dataReset(remarkTb) {
      for (let name in this.formSearchs[remarkTb].datas) {
        if (name != "dicID") {
          this.formSearchs[remarkTb].datas[name] = null;
        }
      }
    },
    // 通用直接保存
    async generalSaveData(newData, remarkTb, index) {
      this.adminLoading = true;
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
            this.verifyData(n);
            if (n.childrens && n.children.length != 0) {
              n.childrens.forEach((x) => {
                this.verifyData(x);
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
        //this.formSearchs[0].datas["Extend11"] = "CRTD";
       // this.formSearchs[0].datas["ProductionStatus"] = [26]; //默认待排
        this.dataSearch(0);
      }
    },
    // 验证数据
    verifyData(n) {
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
      if (remarkTb == 0) {
        form["AutoDays2"] = this.AutoDays2;
      }

      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      //form["ControlID"] = "205";
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        if (remarkTb == 0) {
          this.tableColumns[0] = res.data.Columns[0];
          this.setData();
          this.$set(this.tablePagination[0], "pageTotal", count);
        }
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch("tagsView/delCachedView", this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath,
          });
        });
      });
    },
    // 选择数据
    selectFun(data, remarkTb, row) {
      this.selectionData[remarkTb] = data;
    },
    // 批量开始日期
    changeDate() {
      if (this.selectionData[this.tagRemark].length == 0) {
        this.$message.error("请选择需要批量填写开始日期的数据！");
      } else {
        this.selectionData[this.tagRemark].forEach((a) => {
          a.StartDate = this.ReplyDate;
        });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      let className = "";
      if (row.DbResult != "" && row.DbResult != "计算成功") {
        className += "bgRedColor";
      }
      return className;
    },
    // 行内列样式
    cellStyle({ row, column }) {},
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      if (index == 4) {
        if (this.tableData[1].length == 0) {
          this.dataSearch(1);
        }
        return;
      }
      let s = [];
      this.formSearchs[0].datas["Extend11"] = "";
      if (index === 0) {
        s = [];
      } else if (index === 1) {
        // this.formSearchs[0].datas["Extend11"] = "CRTD";
        s = [26];
      } else if (index === 2) {
        s = [21, 22, 23];
      } else if (index === 3) {
        s = [24];
        // this.formSearchs[2].datas["ProductionStatus"] = s;
        // this.dataSearch(2);
        // return
      }
      this.formSearchs[0].datas["ProductionStatus"] = s;
      this.dataSearch(0);
    },
    // 计算排期与匹配拉线
    async computedScheduling() {
      let resultTag = this.getSelectionData(1);
      if (resultTag) {
        this.$message.error("工艺是否不为空！");
        return;
      }
      let submitData = this.tableData[this.tagRemark]; //this.selectionData[this.tagRemark];
      submitData.forEach((m) => {
        m.ReplyDate = this.ReplyDate;
        m["isChecked"] = true;
      });
      this.adminLoading = true;
      let res = await GetSearch(submitData, "/APSAPI/SchedulingV3");
      const { result, data, count, msg } = res.data;
      if (result) {
        this.tableData[1] = data;
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
    // getSelectionData(tag) {
    //   let newData = this.selectionData[tag];

    //   let resultTag = false;
    //   if (newData.length != 0) {
    //     if (tag == 0) {
    //       newData.forEach((x, y) => {
    //         x.isChecked = true;

    //         if (!x.ProcessGroupID) {
    //           resultTag = true;
    //           this.$message.error(y + 1 + "工艺不能为空");
    //         } else {
    //         }
    //       });
    //     } else {
    //       newData.forEach((x) => {
    //         if (x.isChecked) {
    //         }
    //       });
    //     }
    //   }
    //   return resultTag;
    // },
    // 下发周计划
    async setWeekData(index) {
      let resultTag = this.getSelectionData(0);
      if (resultTag) {
        this.$message.error("工艺不能为空");
        return;
      }
      let submitData = this.selectionData[this.tagRemark];
      if (submitData.length == 0) {
        this.$message.error("请选择需要下达的数据！");
        return;
      }

      submitData.forEach((m) => {
        m["MOSchedulingType"] = 3;
      });
      this.adminLoading = true;
      let res = await MOPlanStep1(submitData);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (index == 1) {
          this.labelStatus1 = 4;
          this.dataSearch(1);
        } else {
          this.dataSearch(0);
        }
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
    // 暂停计划
    async parseData() {
      this.SetData(24);
    },
    async reData() {
      this.SetData(26);
    },
    // 退回
    backData() {
      if (this.selectionData[this.tagRemark].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.adminLoading = true;
        this.selectionData[this.tagRemark].forEach((a) => {
          a["ElementDeleteFlag"] = 1;
        });
        this.dataSave(this.selectionData[this.tagRemark], this.tagRemark);
      }
    },
           save4() {//在分线列表处保存
      if (this.selectionData[this.tagRemark].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.adminLoading = true;
        
         let submitData = this.selectionData[this.tagRemark]
    

      if (submitData.length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.dataSave(submitData, 1);
      }
      }
    },
    // 保存
    async save(remarkTb, index, parms) {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows();//获取变更行
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          submitData.push(x.item);
        });
      }

      if (submitData.length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.dataSave(submitData, remarkTb);
      }
    },
    //恢复计划
    async recovery(remarkTb) {
      // remarkTb = 2
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        
        this.selectionData[remarkTb].forEach(m=>{
          m["ProductionStatus"]=23;

        });
       this.dataSave(this.selectionData[remarkTb],remarkTb);
      }
    },
    async dataSave(newData, remarkTb) {
      let res = await GetSearch(newData, "/APSAPI/SaveData");
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
      if (result) {
        this.$set(this.selectionData, remarkTb, []);
        this.NoWorkHour = [];
        this.dataSearch(remarkTb);
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.adminLoading = false;
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      }
    },
    async SetData(status) {
      let submitData = this.selectionData[this.tagRemark];
      if (submitData.length == 0) {
        this.$message.error("请选择数据！");
        return;
      }
      submitData.forEach((m) => {
        m.ProductionStatus = status;
      });

      this.adminLoading = true;
      let res = await GetSearch(submitData, "/APSAPI/SaveData");
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
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
    // 进入分线列表
    insertList() {
      this.getSelectionData(this.tagRemark);
      if (this.selectionData[this.tagRemark].length == 0) {
        this.$message.error("请选择要进入分线列表的数据（确认选好工艺）！");
      } else {
        // 进入预排计划

        this.setWeekData(1);
      }
    },
    //正排倒排计算，匹配拉线
    async MOPlanStep1CalculationPre() {
      let submitData = [];
      this.getSelectionData();
      this.selectionData[this.tagRemark].forEach((x) => {
        x["Type"] = 0;
        x["dicID"] = 7960;
        x["isChecked"] = true;
        x["AutoDays2"] = this.AutoDays2;
        submitData.push(x);
      });

      if (submitData.length == 0) {
        this.$message.error("请选择需要计算的数据！");
      } else {
        this.adminLoading = true;
        let res = await GetSearch(
          submitData,
          "/APSAPI/MOPlanStep1CalculationSMT"
        );
        const { data, forms, result, msg } = res.data;
        if (result) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
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
    //正排倒排计算，匹配拉线
    //正排倒排计算，匹配拉线
    async MOPlanStep1Calculation() {
      // if (this.selectionData[1].length == 0) {
      //   this.$message.error("请选择需要批量填写开始日期的数据！");
      //   return;
      // }
           let submitData = [];
      this.getSelectionData();
      this.selectionData[0].forEach((x) => {
        x["Type"] = 0;
        x["dicID"] = 7960;
        x["isChecked"] = true;
        x["AutoDays2"] = this.AutoDays2;
        submitData.push(x);
      });
   
      if (submitData.length == 0) {
        this.$message.error("请选择需要计算的数据！");
      } else {
        this.adminLoading = true;
        let res = await GetSearch(submitData, "/APSAPI/MOPlanStep1CalculationSMT");
        const { data, forms, result, msg } = res.data;
        if (result) {
          this.$set(this.tableData, 1, data);
          // 清空选中的，把选中的数据重新绑定

          this.resultMsg = res.data.resultMsg;

          let templateData = JSON.parse(JSON.stringify(this.selectionData[1]));
          this.$set(this.selectionData, 1, []);
          let newData = this.tableData[1].filter((a) =>
            templateData.some((b) => b.OrderID == a.OrderID)
          );
          if (newData.length != 0) {
            newData.forEach((c) => {
              this.$nextTick(() => {
                _this.$refs.tableRefTwo.$refs.vxeTable.setCheckboxRow(c, true);
                _this.selectionData[1].push(c);
              });
            });
          }
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
      }
    },

    // 齐套计算
    async dataComputedDate() {
      // if (this.selectionData[this.tagRemark].length == 0) {
      //   this.$message.error("请选择需要批量填写开始日期的数据！");
      //   return;
      // }
      this.adminLoading = true;
      let res = await OrderPlanMaterialForm(this.tableData[this.tagRemark]);
      const { data, forms, result, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.$set(this.tableData, 1, data);
        let templateData = JSON.parse(JSON.stringify(this.selectionData[this.tagRemark]));
        this.$set(this.selectionData, this.tagRemark, []);
        // 清空选中的，把选中的数据重新绑定
        let newData = this.tableData[1].filter((a) =>
          templateData.some((b) => b.OrderID == a.OrderID)
        );
        if (newData.length != 0) {
          newData.forEach((c) => {
            this.$nextTick(() => {
              _this.$refs.tableRefTwo.$refs.vxeTable.setCheckboxRow(c, true);
              _this.selectionData[this.tagRemark].push(c);
            });
          });
        }
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
      // }
    },
    // 更新计划
    async MOPlanSaveToDayPlan() {
      // 匹配拉线由分线列表标签移到待排产中，表格不一样需要修改以下代码
      this.getSelectionData();
      if (this.selectionData[this.tagRemark].length == 0) {
        this.$message.error("请选择需要更新的计划！");
        return;
      }
      let submitData = this.selectionData[this.tagRemark]; //this.selectionData[this.tagRemark];这里有错误，如果取selection，获取到的是旧数据（没有匹配拉线前的）
      submitData.forEach((m) => {
        m["MOSchedulingType"] = 1;
        m["dicID"] = 7960;
      });
      this.adminLoading = true;
      let res = await GetSearch(submitData, "/APSAPI/MOPlanSaveToDayPlanAll");
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(this.tagRemark);
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
  },
};
</script>