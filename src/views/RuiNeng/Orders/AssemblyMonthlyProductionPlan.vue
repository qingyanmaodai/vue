<!--菜单设置-->
<!-- 四部日计划 -->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0]" :key="i" v-show="labelStatus1 === i">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[i].datas"
          :searchForm="formSearchs[i].forms"
          :remark="i"
          :isLoading="isLoading"
          :btnForm="btnForm"
          :signName="i"
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
            <el-col :span="20" class="flex_flex_end"
              ><el-divider direction="vertical"></el-divider>
              <el-button type="primary" size="mini" @click="changeEvent(0)">
                复制
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div
          class="flex_column"
          v-for="item in [0]"
          :key="item"
          v-show="labelStatus1 === item"
        >
          <ComSpreadTable
            ref="`spreadsheetRef${remarkTb}`"
            :height="height"
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
      </div>
    </div>

    <!-- 弹框-->
    <DialogTable
      title="全局欠料"
      :tableDialog="colDialogVisible"
      :sysID="5165"
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
import { mapState } from "vuex";
GC.Spread.Common.CultureManager.culture("zh-cn");
import ComSearch from "@/components/ComSearch";
import ComReportTable from "@/components/ComReportTable";
import ComAsideTree from "@/components/ComAsideTree";
import ComSpreadTable from "@/components/ComSpreadTable";
import { HeaderCheckBoxCellType } from "@/static/data.js";
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
  GetOrgData
} from "@/api/Common";
import { SaveMOPlanStep4 } from "@/api/PageTwoScheduling";
import DialogTable from "@/components/Dialog/dialogTable";
export default {
  name: "AssemblyMonthlyProductionPlan",
  components: {
    ComSearch,
    ComReportTable,
    ComAsideTree,
    DialogTable,
    ComSpreadTable
  },
  data() {
    return {
      labelStatus1: 0,
      spread: [[], [], [], [], []],
      dialogSearchForm: {
        OrderID: ""
      },
      colDialogVisible: false,
      //////////////左侧树节点//////////////
      LineName: "",
      OrganizeName: "",
      clickData: {},
      treeProps: {
        label: "OrganizeName",
        children: "children"
      },
      treeListTmp: [],
      treeListTmp2: [],
      treeData: [],
      treeData2: [],
      autoGenerateColumns: true,
      ////////////////// Search /////////////////
      title: this.$route.meta.title,
      drawer: false,
      delData: [[]],
      formSearchs: [
        {
          datas: {},
          forms: []
        }
      ],
      btnForm: [],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          isLoading: false,
          Methods: "dataSaveDay",
          Type: "success",
          Icon: "",
          Size: "small"
        },
        {
          ButtonCode: "save",
          BtnName: "暂停",
          isLoading: false,
          Methods: "suspend",
          Type: "warning",
          Icon: "",
          Size: "small",
          Params: { dataName: "selectionData" }
        },
        {
          ButtonCode: "save",
          BtnName: "退回",
          isLoading: false,
          Methods: "dataDel",
          Type: "danger",
          Icon: "",
          Size: "small",
          Params: { dataName: "selectionData" }
        },
        {
          ButtonCode: "SyncSAP",
          BtnName: "同步SAP",
          isLoading: false,
          Methods: "updateSAP",
          Type: "danger",
          Icon: "",
          Size: "small",
          Params: { dataName: "selectionData" }
        },
        {
          ButtonCode: "save",
          BtnName: "重排",
          isLoading: false,
          Methods: "resetScheduling",
          Type: "danger",
          Icon: "",
          Size: "small",
          Params: { dataName: "resetScheduling" }
        }
      ],
      tableData: [[]],
      tableColumns: [[]],
      tableLoading: [false],
      isClear: [false],
      tablePagination: [{ pageIndex: 1, pageSize: 3000, pageTotal: 0 }],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isLoading: false,
      isEdit: false,
      sysID: [{ ID: 6734 }],
      adminLoading: false,
      checkBoxCellTypeLine: "",
      isOpen: true,
      selectionData: [[]],
      NoWorkHour: [],
      LineViewSort: [],
      sheetSelectRows: [],
      sheetSelectObj: { start: 0, end: 0, count: 0 }
    };
  },
  watch: {},
  created() {
    _this = this;
    this.adminLoading = true;
    // 获取所有按钮
    this.btnForm = this.$route.meta.btns;
    this.$common.judgeBtn(this, this.btnForm);
    this.getTableHeader();
  },
  // activated() {
  //   if (this.spread) {
  //     this.spread.refresh();
  //   }
  // },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 300);
    this.keyDown();
  },
  methods: {
    // 监听键盘
    keyDown() {
      document.onkeydown = e => {
        //事件对象兼容
        let e1 =
          e || event || window.event || arguments.callee.caller.arguments[0];

        if (e.ctrlKey && e.keyCode == 83) {
          e.preventDefault();
          e.returnValue = false;

          this.dataSave(this.labelStatus1);
          return false;
        }
      };
    },
    //获取子组件实例
    workbookInitialized: function(workbook, remarkTb) {
      this.spread[remarkTb] = workbook;
    },
    //获取当前选中行的值
    selectChanged(newValue, remarkTb) {
      // 在子组件计算属性发生变化时，更新父组件的计算属性
      this.selectionData[remarkTb] = newValue;
    },
    // 高度控制
    setHeight() {
      this.treeHeight = document.documentElement.clientHeight - 150 + "px";
      let headHeight = this.$refs.headRef.offsetHeight;
      let newHeight = "";
      let rem =
        document.documentElement.clientHeight -
        headHeight -
        this.$store.getters.reduceHeight;
      if (this.$store.getters.reduceHeight == 138) {
        newHeight = rem + "px";
      } else {
        newHeight = rem + "px";
      }
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
    // 复制
    async changeEvent(val) {
      // let sheet = this.spread[this.labelStatus1].getActiveSheet();
      if (val == 0) {
        if (this.selectionData[0].length === 0) {
          this.$message.error("请选择需要复制的数据的数据！");
          return;
        }
        this.tableData[0] = this.tableData[0].flatMap(obj => {
          if (obj["isChecked"]) {
            const objKeys = Object.keys(obj);
            let copyObj = JSON.parse(JSON.stringify(obj)); //深拷贝
            objKeys.forEach(key => {
              if (key.endsWith("dy")) {
                copyObj[key.replace(/dy$/, "")] = null;
              }
            });
            return [
              obj,
              {
                ...copyObj,
                LineID: null,
                ProcessPlanID: null,
                PlanQty: null,
                HasQty: null
              }
            ];
          } else {
            return [obj];
          }
        });
        // .sort((a, b) => a.SalesOrderDetailPlanID - b.SalesOrderDetailPlanID);
        this.setData(0);
        console.log(this.tableData[0], "this.tableData[0]");
        // sheet.setDataSource(this.tableData[0]);
        // let res = await GetSearch(
        //   this.selectionData[1],
        //   "/APSAPI/OrderTaskDownload"
        // );
        // const { datas, forms, result, msg } = res.data;
        // if (result) {
        //   this.$message({
        //     message: msg,
        //     type: "success",
        //     dangerouslyUseHTMLString: true
        //   });
        //   this.dataSearch(1);
        //   this.$set(this, "adminLoading", false);
        // } else {
        //   this.$message({
        //     message: msg,
        //     type: "error",
        //     dangerouslyUseHTMLString: true
        //   });
        //   this.$set(this, "adminLoading", false);
        // }
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
    // 导出
    async dataExport(remarkTb) {
      this.adminLoading = true;
      let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
      form["rows"] = 0;
      let res = await ExportData(form);
      this.adminLoading = false;
      this.$store.dispatch("user/exportData", res.data);
    },
    // 获取选中的数据
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[0] = [];
      if (newData.length != 0) {
        newData.forEach(x => {
          if (x.isChecked) {
            this.selectionData[0].push(x);
          }
        });
      }
    },
    // 退回
    async dataDel(remarkTb, index, parms) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请点击需要操作的数据！");
        return;
      }
      this.$confirm(
        "确定要退回的【" +
          this.selectionData[remarkTb].length +
          "】数据吗，如果已经报工则无法退回？"
      )
        .then(_ => {
          this.selectionData[remarkTb].forEach(x => {
            x["ElementDeleteFlag"] = 1;
          });
          this.adminLoading = true;
          _this.dataSave(remarkTb, index, null, this.selectionData[remarkTb]);
        })
        .catch(_ => {});
    },
    updateSAP(remarkTb, index, parms) {
      let res = null;
      this.getSelectionData();
      let newData = [];
      if (parms && parms.dataName) {
        if (this[parms.dataName][remarkTb].length == 0) {
          this.$message.error("请单击需要操作的数据！");
          return;
        } else {
          this[parms.dataName][remarkTb].forEach(x => {
            let obj = x;

            newData.push(obj);
          });
        }
      } else {
        this.tableData[remarkTb].forEach(y => {
          let obj2 = y;

          newData.push(obj2);
        });
      }
      this.$confirm(
        "确定要同步的【" +
          newData.length +
          "】数据吗，如果已经同步过则无法再次同步"
      )
        .then(async _ => {
          this.adminLoading = true;

          let res = await GetSearch(newData, "/APSAPI/UpdateERPInfo");
          const { result, data, count, msg } = res.data;

          if (result) {
            this.adminLoading = false;
            this.$message({
              message: msg,
              type: "success",
              dangerouslyUseHTMLString: true
            });
          } else {
            this.adminLoading = false;
            this.$message({
              message: msg,
              type: "error",
              dangerouslyUseHTMLString: true
            });
          }
        })
        .catch(_ => {});
    },
    resetScheduling() {
      this.$confirm("确定要重新排全部数据吗？")
        .then(async _ => {
          this.adminLoading = true;

          let sheet = this.spread[this.labelStatus1].getActiveSheet();
          let submitData = sheet.getDataSource();
          submitData.forEach(m => {
            m["isChecked"] = true;
          });
          if (submitData.length >= 0) {
            this.adminLoading = true;
            let res = await GetSearch(
              submitData,
              "/APSAPI/MOPlanSaveToDayPlan?isPlan=1"
            );
            const { result, data, count, msg } = res.data;
            if (result) {
              this.dataSearch(0);
              this.adminLoading = false;
              this.$message({
                message: msg,
                type: "success",
                dangerouslyUseHTMLString: true
              });
            } else {
              this.adminLoading = false;
              this.$message({
                message: msg,
                type: "error",
                dangerouslyUseHTMLString: true
              });
            }
          } else {
            this.$message({
              message: "未有数据",
              type: "error",
              dangerouslyUseHTMLString: true
            });
          }
        })
        .catch(_ => {});
    },
    // 单击行
    handleRowClick(row, remarkTb) {
      this.delData[remarkTb] = [];
      this.delData[remarkTb].push(row);
    },
    // 保存
    async dataSave(remarkTb, index, parms, newData) {
      this.adminLoading = true;
      const sheet = this.spread[remarkTb]?.getActiveSheet();
      const $table = this.$refs[`tableRef${remarkTb}`]?.[0].$refs.vxeTable;
      if (sheet.isEditing()) {
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
          updateRecords = sheet.getDirtyRows(); //获取修改过的数据
          updateRecords = updateRecords.map(x => {
            return x["item"];
          });
        }
      }

      if (updateRecords.length == 0) {
        this.$set(this, "adminLoading", false);
        this.$message.error("当前数据没做修改，请先修改再保存！");
        return;
      }
      let res = await SaveMOPlanStep4(updateRecords);
      // let res = await GetSearch(updateRecords, "/APSAPI/SaveData10093");
      const { datas, forms, result, msg } = res.data;
      if (result) {
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true
        });
        this.dataSearch(remarkTb);
        this.$set(this, "adminLoading", false);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
        this.$set(this, "adminLoading", false);
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
          this.$set(this.tableColumns, i, m);
        });
        // 获取查询的初始化字段 组件 按钮
        forms.some((x, z) => {
          this.$set(this.formSearchs[z].datas, "dicID", IDs[z].ID);
          x.forEach(y => {
            if (y.prop && y.value) {
              this.$set(this.formSearchs[z].datas, [y.prop], y.value);
            } else {
              this.$set(this.formSearchs[z].datas, [y.prop], "");
            }
          });
          this.$set(this.formSearchs[z], "forms", x);
        });
        console.log("gettable");
        this.getOrgData();
        // this.dataSearch(0);
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
      form["dicID"] = this.sysID[remarkTb]["ID"];
      form["ControlID"] = this.userInfo.WorkFlowInstanceID;
      let res = await GetSearchData(form);

      const { result, data, count, msg } = res.data;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.setData(remarkTb);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
      } else {
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
      this.$set(this.tableLoading, remarkTb, false);
    },
    // 渲染数据
    setData(remarkTb) {
      this.spread[remarkTb].suspendPaint();
      let sheet = this.spread[remarkTb].getActiveSheet();
      sheet.options.allowCellOverflow = true;
      sheet.defaults.rowHeight = 23;
      sheet.defaults.colWidth = 100;
      sheet.defaults.colHeaderRowHeight = 23;
      sheet.defaults.rowHeaderColWidth = 60;
      let colHeader1 = [];
      let colInfos = [];
      console.log(this.checkBoxCellTypeLine);
      this.tableColumns[0].forEach(x => {
        if (x.prop == "LineID") {
          colInfos.push({
            name: x.prop,
            displayName: "线别",
            cellType: this.checkBoxCellTypeLine,
            size: parseInt(x.width)
          });
        } else if (
          x.DataType == "datetime" ||
          x.DataType === "varchar" ||
          x.DataType === "nvarchar"
        ) {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width),
            formatter: "@" //字符串格式
          });
        } else {
          colInfos.push({
            name: x.prop,
            displayName: x.label,
            size: parseInt(x.width)
          });
        }
        colHeader1.push(x.label);
      });
      sheet.setRowCount(1, GC.Spread.Sheets.SheetArea.colHeader);
      colHeader1.forEach(function(value, index) {
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
        size: 60
      };
      for (var name in checkbox) {
        colInfos[0][name] = checkbox[name];
      }

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

      sheet.frozenColumnCount(this.tableColumns[0][0].FixCount);

      sheet.setDataSource(this.tableData[0]);
      sheet.bindColumns(colInfos);
      this.spread[remarkTb].options.tabStripVisible = false; //是否显示表单标签

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
        if (row["Code"] == null) {
          rowSheet.backColor("#A0CFFF");
          rowSheet.foreColor("balck");
          rowSheet2.backColor("#A0CFFF");
          rowSheet2.foreColor("balck");
        } else if (row["MFGOrganizeID"] === 162) {
          // row.backColor();
          rowSheet.backColor("#FFFF00");
          rowSheet.foreColor("black");
          rowSheet2.backColor("#FFFF00");
        } else {
          // row.backColor();
          rowSheet.foreColor("black");
          rowSheet.backColor("#FFFFFF");
          rowSheet.foreColor("black");
          rowSheet2.backColor("#FFFFFF");
        }
        let cellIndex = 0;
        this.tableColumns[0].forEach(m => {
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

      let cellIndex = 0;
      let viewSortIndex = 0; //排序的索引
      let lineIDIndex = 0;
      this.tableColumns[0].forEach(m => {
        //行，start,end
        if (m.prop == "ViewSort") {
          viewSortIndex = cellIndex;
        }
        if (m.prop == "LineID") {
          lineIDIndex = cellIndex;
        }
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
      sheet.options.protectionOptions.allowResizeColumns = true;
      //sheet.options.isProtected = true;

      var insertRowsCopyStyle = {
        canUndo: true,
        name: "insertRowsCopyStyle",
        execute: function(context, options, isUndo) {
          var Commands = GC.Spread.Sheets.Commands;
          if (isUndo) {
            Commands.undoTransaction(context, options);
            return true;
          } else {
            sheet.suspendPaint();
            sheet.addRows(options.activeRow, _this.sheetSelectRows.length);
            //  sheet.setArray(options.activeRow, 0,_this.sheetSelectRows);
            // console.log(_this.sheetSelectRows);

            // console.log(_this.sheetSelectObj.start+_this.sheetSelectRows.length)
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
                GC.Spread.Sheets.CopyToOptions.all
              );

              //   sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
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
              //  sheet.setArray(options.activeRow, 0, _this.sheetSelectRows);
              sheet.deleteRows(
                _this.sheetSelectObj.start,
                _this.sheetSelectObj.count
              );
            }
            let count = sheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport);

            let lineID = _this.sheetSelectRows[0][lineIDIndex];
            let isFind = false;
            let viewSort = 1;

            for (var i = 0; i < count; i++) {
              if (isFind == false && sheet.getValue(i, lineIDIndex) == lineID) {
                isFind = true;
              }
              if (isFind && sheet.getValue(i, lineIDIndex) != lineID) {
                break;
              }
              if (isFind) {
                sheet.setValue(i, viewSortIndex, viewSort);
                viewSort++;
              }
            }

            // Commands.startTransaction(context, options);

            // sheet.suspendPaint();

            // var beforeRowCount = 0;

            //  sheet.suspendPaint();

            // Commands.endTransaction(context, options);
            sheet.resumePaint();

            return true;
          }
        }
      };

      this.spread[remarkTb]
        .commandManager()
        .register("insertRowsCopyStyle", insertRowsCopyStyle);

      function MyContextMenu() {}
      MyContextMenu.prototype = new GC.Spread.Sheets.ContextMenu.ContextMenu(
        this.spread[remarkTb]
      );
      MyContextMenu.prototype.onOpenMenu = function(
        menuData,
        itemsDataForShown,
        hitInfo,
        spread
      ) {
        itemsDataForShown.forEach(function(item, index) {
          // console.log(item);
          if (item && item.name === "gc.spread.rowHeaderinsertCutCells") {
            item.command = "insertRowsCopyStyle";
          }
          //  else if (item && item.name === "gc.spread.cut") {

          //     item.command = "insertRowsCut";
          //   }
        });
      };
      var contextMenu = new MyContextMenu();
      this.spread[remarkTb].contextMenu = contextMenu;
      // 剪贴板事件绑定
      sheet.bind(GC.Spread.Sheets.Events.ClipboardChanged, function(
        sender,
        args
      ) {
        let s = sheet.getSelections()[0];
        console.log(sheet.getDataItem(s.row));
        _this.sheetSelectRows = sheet.getArray(
          s.row,
          0,
          s.rowCount,
          _this.tableColumns[0].length
        );
        _this.sheetSelectObj.start = s.row;

        _this.sheetSelectObj.count = s.rowCount;
      });

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
      //表格编辑事件

      this.spread[remarkTb].bind(GCsheets.Events.EditStarting, function(
        e,
        args
      ) {});
      this.spread[remarkTb].bind(GCsheets.Events.EditEnded, function(e, args) {
        // 自动计算数量

        _this.computedNum(args.row, args.col, args.editingText);
        // for (var i = args.col + 1; i < _this.tableColumns[0].length; i++) {
        //   sheet.setArray(args.row, i, [2021]);
        // }
      });

      // 表格单击单元格弹框事件
      this.spread[remarkTb].bind(GCsheets.Events.CellClick, function(e, args) {
        if (_this.tableColumns[0].length) {
          _this.tableColumns[0].map((item, index) => {
            if (item.name === "Q1" && args.col === index) {
              // 显示ERP供需平衡表
              _this.colDialogVisible = true;
              _this.dialogSearchForm.OrderID =
                _this.tableData[_this.tagRemark][args.row].OrderID;
              _this.dialogSearchForm.OweQty = 0;
            }
          });
        }
      });

      this.spread[remarkTb].resumePaint();
      this.adminLoading = false;
      this.tableLoading[0] = false;
      this.spread[remarkTb].refresh(); //重新定位宽高度
    },
    // 自动计算数量
    computedNum(rowIndex, colIndex, val) {
      let sheet = this.spread[this.labelStatus1].getActiveSheet();
      let dataSource = sheet.getDataSource();
      if (val == null) {
        val = 0;
      } else if (val == 0) {
        //输入0不触发自动计算
        return;
      }
      let currentRow = dataSource[rowIndex];
      if (currentRow.ID == -1) {
        return false;
      }
      let currentlabel = this.tableColumns[0][colIndex].prop + "dy";
      if (!currentRow[currentlabel]) {
        //不是天日的数量
        currentlabel = this.tableColumns[0][colIndex].prop;
        if (currentlabel == "ViewSort") {
          val = currentRow[currentlabel];
          if (val) {
            let newRowindex = 1;
            let flag = false;
            let lineID = currentRow["LineID"];
            //循环上面
            for (var r = 0; r < dataSource.length - 1; r++) {
              let row = dataSource[r];
              if (lineID != row["LineID"]) {
                continue;
              }
              let thisValue = newRowindex; //row[currentlabel];
              if (row["Code"] == null || row["Code"] == "") {
                break;
              }
              if (r < rowIndex) {
                //当前循环的在当前操作行的上面
                if (thisValue >= val && flag === false) {
                  newRowindex = val + 1;
                  flag = true;
                }

                thisValue = newRowindex;
                newRowindex++;
              } else if (r > rowIndex) {
                //当前循环的在当前操作行的下面
                if (newRowindex == val) {
                  newRowindex++;
                }

                thisValue = newRowindex;
                newRowindex++;
              } else {
                thisValue = val;
              }
              sheet.setValue(r, colIndex, thisValue);
            }
          }
        } else {
        }
        sheet.setDataSource(this.tableData[0]);
        return;
      }
      if (
        !currentRow[currentlabel].TotalHours ||
        parseInt(currentRow[currentlabel].TotalHours) <= 0
      ) {
        this.$message.error("该天休息，上班时间为0");

        sheet.setValue(rowIndex, colIndex, "");

        return;
      }

      let Qty = parseInt(currentRow.OweQty);
      let Capacity = parseInt(currentRow.Capacity);
      let list = [];
      let editNum = 0;
      let remainNum = 0;
      // 填一个数量自动将之后的全清干净，前面的累计 prop2有值
      this.tableColumns[0].some((x, i) => {
        if (i <= colIndex) {
          list.push(currentRow[x.prop]);
          if (x.prop2 && i != colIndex && currentRow[x.prop]) {
            editNum = parseInt(editNum) + parseInt(currentRow[x.prop]);
          }
        } else {
          list.push("");
        }
      });
      remainNum = Qty - editNum;

      if (parseInt(val) > remainNum) {
        this.$message.error(
          "输入的数量不能大于剩余排产数，剩余排产数为：" + remainNum
        );
        list[colIndex] = "";
        for (var j = 0; j < this.tableColumns[0].length; j++) {
          sheet.setArray(rowIndex, j, [list[j]]);
        }
        return;
      } else {
        // 接着计算下面每一个空格该有的数
        for (var j = colIndex + 1; j < this.tableColumns[0].length; j++) {
          let label = this.tableColumns[0][j].prop + "dy";
          let obj = currentRow[label];
          remainNum = remainNum - parseInt(val);
          let maxNum =
            parseInt(Capacity) *
            parseInt(obj.TotalHours) *
            parseInt(obj.DayCapacity);
          // parseInt(obj.StandardPeoples)
          if (remainNum <= 0) {
            list[j] = null;
          } else {
            if (remainNum <= maxNum) {
              list[j] = remainNum;
              break;
            } else {
              list[j] = maxNum;
              remainNum -= maxNum;
            }
          }
        }
        for (var j = 0; j < this.tableColumns[0].length; j++) {
          sheet.setArray(rowIndex, j, [list[j]]);
        }
      }
    },
    // 刷新页面
    refrshPage() {
      this.$store.dispatch("tagsView/delCachedView", this.$route).then(() => {
        const { fullPath } = this.$route;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
    },
    //////////////////////////////
    async getOrgData() {
      this.getLineData(this.userInfo.WorkFlowInstanceID);
      return;
      this.treeListTmp = [];
      this.treeData = [];
      let form = {
        OrganizeIDs: this.userInfo.CenterID,
        OrganizeTypeID: 5,
        dicID: 3026,
        Status: 1
      };
      let res = await GetSearchData(form);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.treeData = JSON.parse(JSON.stringify(data));
        this.treeListTmp = this.treeData;
        if (data.length != 0) {
          this.$nextTick(function() {
            _this.$refs.asideTreeRef.setCurrentKey(data[0].OrganizeID);
          });
          // this.$set(
          //   this.formSearchs[0].datas,
          //   "ControlID",
          //   data[0].ERPOrderCode
          // );
          this.getLineData(this.userInfo.CenterID);
        }
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
    },
    // 获取线别数据
    async getLineData(ERPOrderCode) {
      this.lines = [];
      let res = await GetSearchData({
        dicID: 36,
        OrganizeTypeID: 6,
        ERPOrderCode: ERPOrderCode
      });
      const { data, forms, result, msg } = res.data;
      if (result) {
        let newData = [];
        this.treeData2 = data;
        this.treeListTmp2 = data;
        this.adminLoading = false;
        if (data.length != 0) {
          data.forEach(x => {
            newData.push({ text: x.OrganizeName, value: x.OrganizeID });
          });
        }
        this.lines = newData;
        this.checkBoxCellTypeLine = new GCsheets.CellTypes.ComboBox();
        this.checkBoxCellTypeLine.editorValueType(
          GC.Spread.Sheets.CellTypes.EditorValueType.value
        );
        this.checkBoxCellTypeLine.items(newData);
        this.checkBoxCellTypeLine.itemHeight(24);
        // this.formSearchs[0].datas.ControlID="202";
        this.getTableData(this.formSearchs[0].datas, 0);
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
    },
    searchTree(msg, dataName, dataName2, valueName) {
      this[dataName] = [];
      let treeListTmp = JSON.parse(JSON.stringify(this[dataName2]));
      let tmp = msg
        ? this.rebuildData(msg, treeListTmp, valueName)
        : JSON.parse(JSON.stringify(treeListTmp));
      this[dataName].push(...tmp);
    },
    rebuildData(value, arr, valueName) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        arr.forEach(element => {
          if (element[valueName].indexOf(value) > -1) {
            // const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: element.children
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children, valueName);
              const obj = {
                ...element,
                children: ab
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
    // 单击出来组织人员
    handleNodeClick(data, node) {
      this.clickData = data;
      // this.formSearchs[0].datas["ControlID"] = data.ERPOrderCode;
      //this.dataSearch(0);
      this.getLineData(data.OrganizeID);
    },
    // 单击出来线别
    handleNodeClick2(data, node) {
      this.$set(this.formSearchs[0].datas, "LineID", data.OrganizeID);
      this.dataSearch(0);
    },
    changeStatus(item, index) {
      this.labelStatus1 = index;
    },
    // 保存日计划
    async dataSaveDay() {
      let sheet = this.spread[this.labelStatus1].getActiveSheet();
      if (sheet.isEditing()) {
        sheet.endEdit();
      }
      let newData = sheet.getDirtyRows();
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach(x => {
          submitData.push(x.item);
        });
      }
      newData = sheet.getInsertRows();
      if (newData.length != 0) {
        newData.forEach(x => {
          x.item["dicID"] = this.sysID[this.labelStatus1]["ID"];
          submitData.push(x.item);
        });
      }
      if (submitData.length == 0) {
        this.$message.error("没修改过任何数据！");
        return;
      }

      this.adminLoading = true;
      let res = await SaveMOPlanStep4(submitData);
      const { result, data, count, msg } = res.data;
      if (result) {
        this.dataSearch(0);
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "success",
          dangerouslyUseHTMLString: true
        });
      } else {
        this.adminLoading = false;
        this.$message({
          message: msg,
          type: "error",
          dangerouslyUseHTMLString: true
        });
      }
    },
    async suspend(remarkTb, index, parms) {
      let res = null;
      this.getSelectionData();
      let newData = [];

      this.$confirm(
        "确定要暂停【" + this[parms.dataName][remarkTb].length + "】数据吗？"
      )
        .then(_ => {
          if (parms && parms.dataName) {
            if (this[parms.dataName][remarkTb].length == 0) {
              this.$message.error("请选择需要操作的数据！");
              return;
            } else {
              this[parms.dataName][remarkTb].forEach(x => {
                let obj = x;
                obj["ProductionStatus"] = 24;
                newData.push(obj);
              });
            }
          } else {
            this.tableData[remarkTb].forEach(y => {
              let obj2 = y;
              obj["ProductionStatus"] = 24;
              newData.push(obj2);
            });
          }
          this.adminLoading = true;
          _this.dataSave(remarkTb, index, null, newData);
        })
        .catch(_ => {});
    },

    // 下拉选择事件
    handleCommand(val) {
      if (val == 1 && !this.isOpen) {
        this.isOpen = true;
        this.changeTreeNodeStatus(this.$refs.asideTreeRef.store.root);
      } else if (val == 2 && this.isOpen) {
        // 改变每个节点的状态
        this.isOpen = false;
        this.changeTreeNodeStatus(this.$refs.asideTreeRef.store.root);
      }
    },
    // 改变节点状态
    changeTreeNodeStatus(node) {
      node.expanded = this.isOpen;
      for (let i = 0; i < node.childNodes.length; i++) {
        // 改变节点的自身expanded状态
        node.childNodes[i].expanded = this.isOpen;
        // 遍历子节点
        if (node.childNodes[i].childNodes.length > 0) {
          this.changeTreeNodeStatus(node.childNodes[i]);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.spreadContainer {
  position: relative;
  overflow: hidden;
  height: 100%;
  flex: 1;
  border: 1px solid #ababab;
}

.sample-spreadsheets {
  width: 100%;
  height: 100%;
}
</style>
