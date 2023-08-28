<!-- 生产订单管理-->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_container" style="width: 100%">
      <div class="admin_head" ref="headRef">
        <div v-for="i in [0, 1, 2, 3, 4]" :key="i" v-show="labelStatus1 === i">
          <ComSearch
            ref="searchRef"
            :searchData="formSearchs[i].datas"
            :searchForm="formSearchs[i].forms"
            :remark="i"
            :isLoading="isLoading"
            :btnForm="btnForm"
            :signName="i"
            :Region="Region[i]"
            @btnClick="btnClick"
          />
        </div>
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
                  v-show="labelStatus1 == 1"
                  @click="MOPlanStep1CalculationPre(0)"
                >
                  预排运算
                </el-button>
                <el-button
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
                </el-button>
                <el-divider direction="vertical"></el-divider> -->
                <div v-for="(item, y) in Status1" :key="y">
                  <span
                    @click="changeStatus(item, y)"
                    :class="
                      labelStatus1 == y ? 'statusActive cursor' : 'cursor'
                    "
                    >{{ item.label }}</span
                  >
                  <el-divider direction="vertical"></el-divider>
                </div>
              </el-col>
            </el-row>
          </div>
          <div
            class="flex_column"
            v-for="item in [0, 1, 2]"
            :key="item"
            v-show="labelStatus1 == item"
          >
            <ComSpreadTable
              ref="`spreadsheetRef${item}`"
              :height="height"
              :hasSelect="hasSelect[item]"
              :tableData="tableData[item]"
              :tableColumns="tableColumns[item]"
              :tableLoading="tableLoading[item]"
              :remark="item"
              :sysID="sysID[item]['ID']"
              :pagination="tablePagination[item]"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @workbookInitialized="workbookInitialized"
              @selectChanged="selectChanged"
            />
          </div>
          <div v-for="item in [3, 4]" :key="item" v-show="labelStatus1 == item">
            <ComVxeTable
              :rowKey="'RowNumber'"
              :ref="`tableRef${item}`"
              :height="height"
              :tableData="tableData[item]"
              :hasSelect="hasSelect[item]"
              :tableHeader="tableColumns[item]"
              :tableLoading="tableLoading[item]"
              :isEdit="isEdit"
              :remark="item"
              :cellStyle="cellStyle"
              :sysID="sysID[item].ID"
              :showPagination="false"
              :isClear="isClear[item]"
              :pagination="tablePagination[item]"
              @pageChange="pageChange"
              @pageSize="pageSize"
              @selectfun="selectFun"
              @changeline="changeline"
              @sortChange="sortChange"
            />
          </div>
          <div style="color: red; font-weight: bold">{{ this.resultMsg }}</div>
        </div>
      </div>
    </div>

    <!-- 点击齐套率弹框-->
    <DialogTable
      title="供需平衡"
      :tableDialog="colDialogVisible"
      :sysID="7968"
      width="80%"
      @closeDialog="colDialogVisible = false"
      :searchForm="dialogSearchForm"
      :isToolbar="false"
    ></DialogTable>
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
import { HeaderCheckBoxCellType } from "@/static/data.js";
import ComSpreadTable from "@/components/ComSpreadTable";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
  GetOrgData,
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import {
  MOPlanStep1,
  MOPlanStep1Calculation,
  FSLMOPlanStep1,
} from "@/api/wjApi";

import {
  SaveMOPlanStep4,
  SaveMOPlanStep2,
  OrderPlanMaterialForm,
} from "@/api/PageTwoScheduling";
import { template } from "xe-utils";
export default {
  name: "PlanPreview",
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComFormDialog,
    DialogTable,
    ComSpreadTable,
  },
  data() {
    return {
      dialogSearchForm: {
        OrderID: "",
      },
      colDialogVisible: false,
      includeFields: ["Qty"], // 包含合计的字段
      labelStatus1: 1,
      Status1: [
        { label: "全部", value: "" },
        { label: "待排产", value: 0 },
        { label: "已排产", value: 1 },
        { label: "暂停", value: 2 },
        { label: "分线列表", value: 4 },
      ],
      title: this.$route.meta.title,
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
        {
          ButtonCode: "save",
          BtnName: "恢复",
          isLoading: false,
          Methods: "recovery",
          Type: "success",
          signName: 3,
          Icon: "",
          Size: "small",
          Params: { dataName: "selectionData", remarkTb: 2 },
        },
        {
          ButtonCode: "save",
          BtnName: "退回",
          Type: "danger",
          Ghost: true,
          signName: 4,
          Size: "small",
          Methods: "backData",
          Icon: "",
        },
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
      selectionData: [[], [], [], [], []],
      btnForm: [],
      isLoading: false,
      tableData: [[], [], [], [], []],
      tableColumns: [[], [], []],
      tableLoading: [false, false, false, false, false],
      isClear: [false, false, false, false, false],
      hasSelect: [false, false, false, false, false],
      Region: [6, 6, 6, 6, 6],
      tablePagination: [
        { pageIndex: 1, pageSize: 10000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 10000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 10000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 10000, pageTotal: 0 },
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
      sysID: [
        { ID: 7961, AutoDays2: this.AutoDays2 },
        { ID: 7961, AutoDays2: this.AutoDays2 },
        { ID: 7961, AutoDays2: this.AutoDays2 },
        { ID: 5585 },
        { ID: 7960 },
      ],
      userInfo: {},
      IsPurchaseBoss: false,
      ReplyDate: "",
      AutoDays2: 30,
      NoWorkHour: [],
      LineViewSort: [],
      spread: [],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 },
      accountsValue: null,
    };
  },
  computed: {},
  created() {
    _this = this;
    this.userInfo = this.$store.getters.userInfo;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.judgeBtn(this.btnForm);
    this.getTableHeader();
    const params = new URLSearchParams(this.$route.meta.TargetFor);
    this.accountsValue = params.get("accounts");
  },
  // activated() {
  //   if (this.spread[remarkTb]) {
  //     this.spread[remarkTb].refresh();
  //   }
  // },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
    judgeBtn(routeBtn) {
      if (routeBtn && routeBtn.length > 0)
        routeBtn.some((item, index) => {
          if (item.ButtonCode == "save") {
            this.$set(this, "isEdit", true);
          }
        });
      this.$set(this, "btnForm", routeBtn);
    },
    //获取子组件实例
    workbookInitialized: function (workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
    },
    //获取当前选中行的值
    selectChanged(newValue, remarkTb) {
      // 在子组件计算属性发生变化时，更新父组件的计算属性
      this.selectionData[remarkTb] = newValue;
    },
    async subSAP() {
      this.adminLoading = true;
      if (this.selectionData[1].length == 0) {
        this.$message.error("请选择要提交同步申请的数据");
        this.adminLoading = false;

        return;
      }
      this.selectionData[1] = this.selectionData[1].forEach((m) => {
        m["dicID"] = 7967;
      });
      let res = await GetSearch(
        this.selectionData[1],
        "/APSAPI/UpdateOrderStartDate"
      );
      const { result, data, count, msg } = res.data;
      this.adminLoading = false;
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
    },
    // schedulingPre() {
    //   this.getSelectionData();
    // },
    setData(remarkTb) {
      //sheet获取
      this.spread[remarkTb].suspendPaint();
      let sheet = this.spread[remarkTb].getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      let colHeader1 = [];
      let colInfos = [];
      sheet.setDataSource(this.tableData[remarkTb]);

      // 渲染列
      this.tableColumns[remarkTb].forEach((x, y) => {
        x["name"] = x["prop"];
        x["displayName"] = x["label"];
        x["width"] = parseInt(x.width);
        if (x.prop === "isChecked") {
          // 选框
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader
          );
          x.cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
        } else if (
          x.ControlType === "comboboxMultiple" ||
          x.ControlType === "combobox"
        ) {
          this.tableData[remarkTb].map((item, index) => {
            if (x.DataSourceID && x.DataSourceName) {
              let newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
              // 获取要绑定下拉菜单的单元格对象
              let cell = sheet.getCell(index, y);
              // 创建下拉菜单单元格类型，并设置其选项数据
              let comboBox = new GC.Spread.Sheets.CellTypes.ComboBox();
              comboBox.editorValueType(
                GC.Spread.Sheets.CellTypes.EditorValueType.value
              );
              comboBox.editable(true);
              // 获取下拉菜单的选项数据
              comboBox.items(newData);
              comboBox.itemHeight(24);
              // 将下拉菜单单元格类型绑定到指定的单元格中
              cell.cellType(comboBox);
            }
          });
        } else if (x.ControlType === "checkbox") {
          let cellType = new GC.Spread.Sheets.CellTypes.CheckBox();
          cellType.caption("");
          cellType.textTrue("");
          cellType.textFalse("");
          cellType.textIndeterminate("");
          cellType.textAlign(
            GC.Spread.Sheets.CellTypes.CheckBoxTextAlign.center
          );
          cellType.isThreeState(false);
          sheet.getCell(-1, y).cellType(cellType);
        } else if (
          x.DataType == "datetime" ||
          x.DataType === "varchar" ||
          x.DataType === "nvarchar"
        ) {
          x.formatter = "@";
        }

        //行，start,end
        if (x.isEdit) {
          sheet.getCell(-1, y).locked(false).foreColor("#2a06ecd9");
        }
      });
      //渲染列
      sheet.bindColumns(this.tableColumns[remarkTb]); //此方法一定要放在setDataSource后面才能正确渲染列名

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
      if (this.tableColumns[remarkTb][0]["FixCount"]) {
        // 冻结
        sheet.frozenColumnCount(this.tableColumns[remarkTb][0].FixCount);
      }

      // 列筛选
      // 参数2 开始列
      // 参数3
      // 参数4 结束列
      let cellrange = new GC.Spread.Sheets.Range(
        -1,
        -1,
        -1,
        this.tableColumns[remarkTb].length
      );
      let hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);

      this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签

      //改变字体颜色
      this.tableData[remarkTb].forEach((row, rowIndex) => {
        this.tableColumns[remarkTb].forEach((column, columnIndex) => {
          // 获取当前单元格
          const cell = sheet.getCell(rowIndex, columnIndex);

          if (row["Code"] == null) {
            cell.backColor("#A0CFFF");
            cell.foreColor("balck");
          } else {
            cell.foreColor("black");
            cell.backColor("#FFFFFF");
          }
          if (row["Capacity"] && column["name"] === "Capacity") {
            cell.foreColor("red");
          }
          if (row["SchedulingStatus"] !== "OK") {
            cell.foreColor("red");
          }
        });
      });

      sheet.options.isProtected = true;
      sheet.options.protectionOptions.allowResizeColumns = true;
      sheet.options.protectionOptions.allowInsertRows = true;
      sheet.options.protectionOptions.allowDeleteRows = true;
      sheet.options.protectionOptions.allowSelectLockedCells = true;
      sheet.options.protectionOptions.allowSelectUnlockedCells = true;
      sheet.options.protectionOptions.allowDeleteColumns = true;
      sheet.options.protectionOptions.allowInsertColumns = true;
      sheet.options.protectionOptions.allowDargInsertRows = true;
      sheet.options.protectionOptions.allowDragInsertColumns = true;
      sheet.options.protectionOptions.allowSort = true;
      sheet.options.protectionOptions.allowFilter = true;
      sheet.options.allowUserDragDrop = true;
      /////////////////表格事件/////////////
      this.spread[remarkTb].bind(GCsheets.Events.ButtonClicked, (e, args) => {
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
            sheet.resumePaint();

            return true;
          }
        },
      };

      this.spread[remarkTb]
        .commandManager()
        .register("insertRowsCopyStyle", insertRowsCopyStyle);

      function MyContextMenu() {}
      MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
        this.spread[remarkTb]
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
        });
      };
      var contextMenu = new MyContextMenu();
      this.spread[remarkTb].contextMenu = contextMenu;
      // 剪贴板事件绑定
      sheet.bind(
        GC.Spread.Sheets.Events.ClipboardChanged,
        function (sender, args) {
          let s = sheet.getSelections()[0];
          _this.sheetSelectRows = sheet.getArray(
            s.row,
            0,
            s.rowCount,
            _this.tableColumns[remarkTb].length
          );
          _this.sheetSelectObj.start = s.row;

          _this.sheetSelectObj.count = s.rowCount;
        }
      );

      // 表格单击齐套率弹框事件
      this.spread[remarkTb].bind(GCsheets.Events.CellClick, function (e, args) {
        if (_this.tableColumns[remarkTb].length) {
          _this.tableColumns[remarkTb].map((item, index) => {
            if (item.name === "K1" && args.col === index) {
              console.log("OrderID", _this.tableData[_this.tagRemark]);
              // 显示ERP供需平衡表
              _this.colDialogVisible = true;
              _this.dialogSearchForm.AUFNR =
                _this.tableData[_this.tagRemark][args.row].OrderNo;
              _this.dialogSearchForm.ZQLS = 0;
            }
          });
        }
      });

      //表格编辑事件
      this.spread[remarkTb].bind(
        GCsheets.Events.EditStarting,
        function (e, args) {}
      );
      this.spread[remarkTb].bind(
        GCsheets.Events.EditEnded,
        function (e, args) {}
      );
      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[remarkTb] = false;
      this.spread[remarkTb].refresh(); //重新定位宽高度
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
      const errorNum = this.tableData[type].findIndex(
        (item) => item["isChecked"] && !item["ProcessGroupID"]
      );
      if (errorNum !== -1) {
        this.$message.error(`第${errorNum + 1}行工艺不能为空`);
        throw new Error("工艺不能为空");
      }
    },
    // 跳转至页面配置
    toPageSetting() {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: this.sysID[0].ID },
      });
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
          if (this.formSearchs[remarkTb].forms.length) {
            // 判断是否是页面显示的查询条件，是的字段才清空
            this.formSearchs[remarkTb].forms.forEach((element) => {
              if (element.prop === name) {
                this.formSearchs[remarkTb].datas[name] = null;
              }
            });
          }
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
          m.forEach((n, index) => {
            // 进行验证
            this.verifyData(n);
            if (n.children && n.children.length != 0) {
              n.children.forEach((x) => {
                this.verifyData(x);
              });
            }
            if (index === 1) {
              this.tablePagination[i]["pageSize"] = n["pageSize"];
              this.hasSelect[i] = n["IsSelect"];
              this.Region[i] = n["Region"] ? n["Region"] : this.Region[i];
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
          this.$set(
            this.formSearchs[z].datas,
            "Accounts",
            this.accountsValue
              ? [
                  "$" + `${this.userInfo["Account"]}` + "$",
                  "$" + `${this.accountsValue}` + "$",
                ]
              : ["$" + `${this.userInfo["Account"]}` + "$"]
          );
        });
        this.formSearchs[1].datas["ProductionStatus"] = [26]; //默认待排
        this.dataSearch(1);
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
      const { result, data, count, msg, Columns } = res.data;
      this.adminLoading = false;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        if (remarkTb !== 3 && remarkTb !== 4) {
          this.$set(this.tableColumns, remarkTb, Columns[0]);
          console.log(this.tableColumns, "this.tableColumns");
          this.setData(remarkTb);
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
      if (this.selectionData[0].length == 0) {
        this.$message.error("请选择需要批量填写开始日期的数据！");
      } else {
        this.selectionData[0].forEach((a) => {
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
      let s = [];
      if (index === 0) {
        s = [];
      } else if (index === 1) {
        s = [26];
      } else if (index === 2) {
        s = [21, 22, 23];
      } else if (index === 3) {
        s = [24];
      } else if (index === 4) {
        this.dataSearch(4);
        return;
      }
      this.formSearchs[index].datas["ProductionStatus"] = s;
      this.dataSearch(index);
    },
    // 计算排期与匹配拉线
    async computedScheduling() {
      let resultTag = this.getSelectionData(1);
      if (resultTag) {
        this.$message.error("工艺是否不为空！");
        return;
      }
      let submitData = this.tableData[4]; //this.selectionData[0];
      submitData.forEach((m) => {
        m.ReplyDate = this.ReplyDate;
        m["isChecked"] = true;
      });
      this.adminLoading = true;
      let res = await GetSearch(submitData, "/APSAPI/SchedulingV3");
      const { result, data, count, msg } = res.data;
      if (result) {
        this.tableData[4] = data;
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
    // 下发周计划
    async setWeekData(index) {
      //假如OrdID为空，则不传给后端
      let submitData = this.selectionData[1].filter((item) => item.OrderID);
      submitData.forEach((m) => {
        m["MOSchedulingType"] = 3;
      });
      this.adminLoading = true;
      let res = await MOPlanStep1(submitData);
      const { result, data, count, msg } = res.data;
      if (result) {
        if (index == 1) {
          this.labelStatus1 = 4;
          this.dataSearch(4);
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
    //恢复计划
    async recovery(remarkTb, index, parms, newData) {
      if (this.selectionData[3].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.selectionData[3].forEach((m) => {
          m["ProductionStatus"] = 23;
        });
        this.dataSave(3, null, null, this.selectionData[3]);
      }
    },
    // 退回
    backData() {
      if (this.selectionData[4].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.$confirm("确定退回吗？")
          .then(() => {
            // 确定
            this.adminLoading = true;
            this.selectionData[4].forEach((a) => {
              a["ElementDeleteFlag"] = 1;
            });
            this.dataSave(4, null, null, this.selectionData[4]);
          })
          .catch(() => {
            // 取消
          });
      }
    },
    //恢复计划
    async recovery(remarkTb) {
      remarkTb = 2;
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要操作的数据！");
      } else {
        this.selectionData[remarkTb].forEach((m) => {
          m["ProductionStatus"] = 23;
        });
        this.dataSave(remarkTb, null, null, this.selectionData[remarkTb]);
      }
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      const sheet = this.spread[remarkTb]?.getActiveSheet();
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (sheet && sheet.isEditing()) {
        sheet.endEdit();
      }
      // 获取修改记录
      let updateRecords = [];
      if (newData) {
        updateRecords = newData;
      } else {
        if ($table) {
          updateRecords = $table.getUpdateRecords();
        } else {
          let DirtyRows = sheet.getDirtyRows().map((row) => row.item); //获取修改过的数据
          let InsertRows = sheet.getInsertRows().map((row) => row.item); //获取插入过的数据
          let DeletedRows = sheet.getDeletedRows().map((row) => row.item);
          DeletedRows.forEach((item) => {
            item["ElementDeleteFlag"] = 1;
          }); //获取被删除的数据
          updateRecords = [...DirtyRows, ...InsertRows, ...DeletedRows];
        }
      }

      if (updateRecords.length == 0) {
        this.$set(this, "adminLoading", false);
        this.$message.error("当前数据没做修改，请先修改再保存！");
        return;
      }
      let res = await SaveData(updateRecords);
      // let res = await GetSearch(updateRecords, "/APSAPI/SaveData10093");
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true,
        });
        this.dataSearch(remarkTb);
        this.$set(this, "adminLoading", false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true,
        });
        this.$set(this, "adminLoading", false);
      }
    },
    // 进入分线列表
    insertList() {
      console.log(this.selectionData[1], "this.selectionData[1]");
      if (this.selectionData[1].length == 0) {
        this.$message.error("请选择要进入分线列表的数据（确认选好工艺）！");
        return;
      } else {
        this.getSelectionData(1);
        // 进入预排计划
        this.setWeekData(1);
      }
    },
    //正排倒排计算，匹配拉线
    async MOPlanStep1CalculationPre() {
      // if (this.selectionData[1].length == 0) {
      //   this.$message.error("请选择需要批量填写开始日期的数据！");
      //   return;
      // }
      if (this.selectionData[4].length == 0) {
        this.$message.error("请选择需要计算的数据！");
      } else {
        this.selectionData[4].forEach((x) => {
          x["Type"] = 0;
          x["dicID"] = 7960;
          x["isChecked"] = true;
          x["AutoDays2"] = this.AutoDays2;
        });
        this.adminLoading = true;
        let res = await GetSearch(
          this.selectionData[4],
          "/APSAPI/MOPlanStep1CalculationV1"
        );
        const { data, forms, result, msg } = res.data;
        if (result) {
          this.$message({
            message: msg,
            type: "success",
            dangerouslyUseHTMLString: true,
          });
          this.dataSearch(4);
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
    async MOPlanStep1Calculation() {
      // if (this.selectionData[4].length == 0) {
      //   this.$message.error("请选择需要批量填写开始日期的数据！");
      //   return;
      // }
      // [];
      let submitData = this.tableData[4].map((x) => {
        return {
          ...x,
          Type: 0,
          dicID: 7960,
          isChecked: true,
        };
      });
      const originalSelectionData = JSON.parse(
        JSON.stringify(this.selectionData[4])
      );
      if (submitData.length == 0) {
        this.$message.error("请选择需要计算的数据！");
      } else {
        this.adminLoading = true;
        let res = await GetSearch(submitData, "/APSAPI/MOPlanStep1Calculation");
        const { data, forms, result, msg } = res.data;
        if (result) {
          this.$set(this.tableData, 4, data);
          // 清空选中的，把选中的数据重新绑定

          this.resultMsg = res.data.resultMsg;
          let newData = this.tableData[4].filter((a) =>
            originalSelectionData.some((b) => b.OrderID == a.OrderID)
          );

          this.$set(this.selectionData, 4, []);
          if (newData.length != 0) {
            this.tableData[4].forEach((item1) => {
              // 使用some方法查找是否存在匹配的OrdID
              const isMatched = newData.some(
                (item2) => item2.OrderID === item1.OrderID
              );
              // 根据匹配结果设置IsChecked属性
              item1.isChecked = isMatched;
            });
          }
          this.selectionData[4] = this.tableData[4].filter(
            (item) => item["isChecked"] == true
          );

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
      // if (this.selectionData[4].length == 0) {
      //   this.$message.error("请选择需要批量填写开始日期的数据！");
      //   return;
      // }
      this.adminLoading = true;
      let res = await OrderPlanMaterialForm(this.tableData[4]);
      const { data, forms, result, msg } = res.data;
      if (result) {
        this.adminLoading = false;
        this.$set(this.tableData, 4, data);
        let templateData = JSON.parse(JSON.stringify(this.selectionData[4]));
        this.$set(this.selectionData, 4, []);
        // 清空选中的，把选中的数据重新绑定
        let newData = this.tableData[4].filter((a) =>
          templateData.some((b) => b.OrderID == a.OrderID)
        );
        if (newData.length != 0) {
          newData.forEach((c) => {
            this.$nextTick(() => {
              _this.$refs[
                `tableRef${_this.labelStatus1}`
              ]?.[0].$refs.vxeTable.setCheckboxRow(c, true);
              _this.selectionData[4].push(c);
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
    // 下达
    async MOPlanSaveToDayPlan() {
      if (this.selectionData[4].length == 0) {
        this.$message.error("请选择需要更新的计划！");
        return;
      }
      let submitData = this.selectionData[4]; //this.selectionData[1];这里有错误，如果取selection，获取到的是旧数据（没有匹配拉线前的）
      submitData.forEach((m) => {
        m["MOSchedulingType"] = 1;
        m["dicID"] = 7960;
      });
      this.adminLoading = true;
      console.log(submitData, "submitData");
      let res = await GetSearch(submitData, "/APSAPI/MOPlanSaveToDayPlan");
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(4);
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
