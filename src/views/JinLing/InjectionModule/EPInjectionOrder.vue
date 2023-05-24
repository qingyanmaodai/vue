<!-- 恩平注塑周计划 -->
<template>
  <div class="container" v-loading="adminLoading">
    <div class="admin_container" style="width: 100%">
      <div class="admin_head" ref="headRef">
        <ComSearch
          ref="searchRef"
          :searchData="formSearchs[tagRemark].datas"
          :searchForm="formSearchs[tagRemark].forms"
          :remark="tagRemark"
          :btnForm="btnForm"
          :signName="tagRemark"
          @btnClick="btnClick"
        />
      </div>
      <div>
        <div class="admin_content">
          <div class="ant-table-title">
            <el-row>
              <el-col :span="12">
                <span class="title" style="margin-right: 10px">{{
                  title
                }}</span>
                <span style="color: #ff9900" v-if="tagRemark == 0"
                  >周计划日期显示规则：抓单日期范围。</span
                >
              </el-col>
              <el-col :span="12" class="flex_flex_end">
                <div v-show="labelStatus1 == 0">
                  <SPAN>抓单日期范围：</SPAN>
                  <el-date-picker
                    v-model="ReplyDate"
                    type="daterange"
                    :editable="false"
                    size="small"
                    value-format="yyyy-MM-dd"
                    placeholder="选择开始时间"
                    :clearable="false"
                  >
                  </el-date-picker>
                  <el-divider direction="vertical"></el-divider>
                </div>
              </el-col>
            </el-row>
          </div>

          <div v-show="labelStatus1 == 0">
            <div v-show="activeName">
              <div class="admin_content">
                <div class="flex_column" :style="{ height: height }">
                  <div class="spreadContainer" v-loading="tableLoading[0]">
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
                      >SysID:{{ sysID[tagRemark].ID }}
                    </span>
                  </div>
                  <div class="flex">
                    <el-pagination
                      background
                      @size-change="(val) => pageSize(val, 0)"
                      :current-page="tablePagination[0].pageIndex"
                      :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
                      :page-size="tablePagination[0].pageSize"
                      :total="tablePagination[0].pageTotal"
                      @current-change="(val) => pageChange(val, 0)"
                      layout="total, sizes, prev, pager, next,jumper"
                    >
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 点击齐套率弹框-->
    <DialogTable
      title="供需平衡"
      :tableDialog="colDialogVisible"
      :sysID="5156"
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
import {
  GetHeader,
  GetSearchData,
  ExportData,
  SaveData,
  GetSearch,
  GetOrgData,
} from "@/api/Common";
import ComFormDialog from "@/components/ComFormDialog";
import { MOPlanStep1 } from "@/api/wjApi";

import { OrderPlanMaterialForm } from "@/api/PageTwoScheduling";
import { template } from "xe-utils";
import formatDates from "@/utils/formatDate";
export default {
  name: "EPInjectionOrder",
  components: {
    ComSearch,
    ComAsideTree,
    ComVxeTable,
    ComFormDialog,
    DialogTable,
  },
  data() {
    return {
      activeName: "all",
      dialogSearchForm: {
        OrderID: "",
      },
      colDialogVisible: false,
      includeFields: ["Qty"], // 包含合计的字段
      labelStatus1: 0,
      title: this.$route.meta.title,
      resultMsg: "",
      delData: [[]],
      formSearchs: [
        {
          datas: {
            MFGOrganizeID: 1222,
          },
          forms: [],
        },
        {
          datas: { MFGOrganizeID: 1222 },
          forms: [],
        },
      ],
      parmsBtn: [
        {
          ButtonCode: "save",
          BtnName: "保存",
          isLoading: false,
          Methods: "save",
          Type: "success",
          Icon: "",
          signName: 0,
          Size: "small",
          Params: { ProcessID: "P2211070001" },
        },
        {
          ButtonCode: "to_days_plan",
          BtnName: "转入日计划",
          Type: "warning",
          Ghost: true,
          Size: "small",
          signName: 0,
          Methods: "setTodayPlan",
          Params: { ProcessID: "P2211070001" },
          Icon: "",
        },
        {
          ButtonCode: "sysData",
          BtnName: "抓需求",
          Type: "success",
          Ghost: true,
          Size: "small",
          signName: 0,
          Methods: "getOrder",
          Params: { ProcessID: "P2211070001" },
          Icon: "",
        },
      ],
      selectionData: [[], []],
      btnForm: [],
      tableData: [[], []],
      tableColumns: [[], []],
      tableLoading: [false, false],
      isClear: [false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 10000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 100, pageTotal: 0 },
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
      sysID: [{ ID: 9014 }, { ID: 5156 }],
      userInfo: {},
      IsPurchaseBoss: false,
      ReplyDate: [],
      AutoDays2: 45,
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
    // 计算周期默认时间：今天+1个月
    this.ReplyDate = [
      formatDates.formatTodayDate(),
      formatDates.formatOneMonthDate(),
    ];
  },
  activated() {
    if (this.spread) {
      this.spread.refresh();
    }
  },
  mounted() {
    setTimeout(() => {
      this.setHeight();
    }, 500);
  },
  methods: {
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

      this.tableColumns[0].forEach((x) => {
        if (
          x.ControlType === "comboboxMultiple" ||
          x.ControlType === "combobox"
        ) {
          let combobox = null;
          combobox = new GCsheets.CellTypes.ComboBox();
          combobox.editorValueType(
            GC.Spread.Sheets.CellTypes.EditorValueType.value
          );
          combobox.items(x.items);
          combobox.itemHeight(24);

          colInfos.push({
            name: x.prop,
            displayName: x.label,
            cellType: combobox,
            size: parseInt(x.width),
          });
        } else {
          // 配置表没有日期列宽需要设置
          if (x.name.indexOf("-") > -1) {
            x.width = 80;
          }
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

      // 选框
      if (colInfos.length && colInfos[0]["name"] === "isChecked") {
        sheet.setCellType(
          0,
          0,
          new HeaderCheckBoxCellType(),
          GCsheets.SheetArea.colHeader
        );
        let checkbox = {
          name: "isChecked",
          displayName: "isChecked",
          cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
          size: 80,
        };
        for (var name in checkbox) {
          colInfos[0][name] = checkbox[name];
        }
      }

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
      defaultStyle.showEllipsis = true;
      sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);
      sheet.frozenColumnCount(this.tableColumns[this.tagRemark][1].FixCount);

      sheet.setDataSource(this.tableData[0]);
      sheet.bindColumns(colInfos);

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

      // 列筛选
      // 参数2 开始列
      // 参数3
      // 参数4 结束列
      var cellrange = new GC.Spread.Sheets.Range(-1, -1, -1, cellIndex);
      var hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
      sheet.rowFilter(hideRowFilter);

      var colindexs = [1, 2, 3, 4, 5];
      this.tableData[0].forEach((row, index) => {
        let cellIndex = 0;
        this.tableColumns[0].forEach((m, num) => {
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

          var rowSheet = sheet.getRange(
            index,
            num,
            1,
            1,
            GC.Spread.Sheets.SheetArea.viewport
          );
          // SMT已排、插件已排、补焊已排、测试已排、三防漆已排字段结尾1~5区分，单元格样式动态生成
          for (let i = 0; i < colindexs.length; i++) {
            if (
              m.prop == "IsToPlanDay" + colindexs[i] &&
              row["IsToPlanDay" + colindexs[i]] == "是"
            ) {
              rowSheet.backColor("#4CD964");
              rowSheet.foreColor("balck");
            } else if (
              m.prop == "IsToPlanDay" + colindexs[i] &&
              row["IsToPlanDay" + colindexs[i]] == "否"
            ) {
              rowSheet.backColor("#FFFF00");
              rowSheet.foreColor("black");
            } else if (
              m.prop == "IsToPlanDay" + colindexs[i] &&
              row["IsToPlanDay" + colindexs[i]] == "无补焊"
            ) {
              rowSheet.foreColor("black");
              rowSheet.backColor("");
            }
          }

          rowSheet = sheet.getRange(
            index,
            num,
            1,
            1,
            GC.Spread.Sheets.SheetArea.viewport
          );
          let rowSheet3 = null;
          if (row["FormRate"] == "100.00%" && m.name === "FormRate") {
            //齐套时背景色为绿色
            rowSheet3 = sheet.getCell(
              index, //行
              num, //列
              GC.Spread.Sheets.SheetArea.viewport
            );
            rowSheet3.backColor("#67c23a");
          }
          // 齐套率字体蓝色
          if (m.name === "FormRate") {
            rowSheet3 = sheet.getCell(
              -1, //行
              num, //列
              GC.Spread.Sheets.SheetArea.viewport
            );
            rowSheet3.foreColor("#2a06ecd9");
          }
          //成品库存单元格背景色
          if (m.name === "StockQty") {
            rowSheet3 = sheet.getCell(
              index, //行
              num, //列
              GC.Spread.Sheets.SheetArea.viewport
            );
            rowSheet3.backColor("#c2e7b0");
          }
          // 电机库存单元格背景色
          if (m.name === "Extend17") {
            rowSheet3 = sheet.getCell(
              index, //行
              num, //列
              GC.Spread.Sheets.SheetArea.viewport
            );
            rowSheet3.backColor("#f0f9eb");
          }
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
      });

      // 表格单击齐套率弹框事件
      this.spread.bind(GCsheets.Events.CellClick, function (e, args) {
        console.log("this.tableColumns", _this.tableColumns);
        if (_this.tableColumns[_this.tagRemark].length) {
          _this.tableColumns[_this.tagRemark].map((item, index) => {
            if (item.name === "FormRate" && args.col === index) {
              // 显示ERP供需平衡表
              _this.colDialogVisible = true;
              _this.dialogSearchForm.OrderID =
                _this.tableData[_this.tagRemark][args.row].OrderID;
              _this.dialogSearchForm.OweQty = 0;
            }
          });
        }
      });
      sheet.options.isProtected = true;
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
      sheet.options.protectionOptions.allowSort = true;
      sheet.options.protectionOptions.allowFilter = true;
      sheet.options.allowUserDragDrop = true;

      this.spread.resumePaint();
      this.adminLoading = false;
      this.tableLoading[0] = false;
      sheet.options.protectionOptions.allowResizeColumns = true; //禁用改变行高
      // sheet.options.isProtected = true; //锁定表格 //锁定表格筛选不能用，注释
      this.spread.options.tabStripVisible = false; //是否显示表单标签
      this.spread.refresh();
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
    // // 获取选中的数据，type:0需要验证工艺，1不需要
    // getSelectionData(type) {
    //   let sheet = this.spread.getActiveSheet();
    //   let newData = sheet.getDataSource();
    //   let resultTag = false;
    //   this.selectionData[0] = [];
    //   if (newData.length != 0) {
    //     newData.forEach((x, y) => {
    //       if (x.isChecked&&x.OrderNo) {
    //         if (!x.ProcessGroupID) {
    //           resultTag = true;
    //           this.$message.error("第" + (y + 1) + "行工艺不能为空");
    //         } else {
    //           this.selectionData[0].push(x);
    //         }
    //       }
    //     });
    //   }
    //   if (resultTag && type === 0) {
    //     //
    //     this.selectionData[0] = [];
    //   }
    // },
    // 获取选中的数据
    getSelectionData() {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDataSource();
      this.selectionData[this.tagRemark] = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          if (x.isChecked) {
            this.selectionData[this.tagRemark].push(x);
          }
        });
      }
    },
    // 跳转至页面配置
    toPageSetting() {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: this.sysID[0].ID },
      });
    },
    initSpread: function (spread) {
      this.spread = spread;
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
        //   this.formSearchs[1].datas["ProcessPartName"] =['PCB','加工']; //默认待排
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

      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      //form["ControlID"] = "205";
      form["SDate"] = this.ReplyDate.length ? this.ReplyDate[0] : "";
      form["Edate"] = this.ReplyDate.length ? this.ReplyDate[1] : "";
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
    // 保存
    async save(remarkTb, index, parms) {
      let sheet = this.spread.getActiveSheet();
      let newData = sheet.getDirtyRows();
      let submitData = [];
      if (newData.length != 0) {
        newData.forEach((x) => {
          submitData.push(x.item);
        });
      }

      if (submitData.length == 0) {
        this.$message.error("当前数据没做修改，请先修改再保存");
      } else {
        this.dataSave(submitData, remarkTb);
      }
    },
    async dataSave(newData, remarkTb) {
      let res = await GetSearch(newData, "/APSAPI/SaveInjectionWeekPlan");
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
    // 转入日计划
    async setTodayPlan(remarkTb, index, params) {
      this.getSelectionData();
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要转入日计划的数据！");
      } else {
        let isNoCapacity1 = true;
        let isTodayPlan = true;
        console.log(this.selectionData[remarkTb]);
        this.selectionData[remarkTb].forEach((element) => {
          if (!element.Capacity1 && element.OrderNo) {
            isNoCapacity1 = false;
            console.log(element.OrderNo);
          }
        });
        if (!isNoCapacity1) {
          this.$confirm(
            "请检查并维护产品产能，存在产能为空，会导致数据异常，是否确定转入日计划?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.saveTodayPlan(remarkTb);
            })
            .catch(() => {});
        } else {
          this.saveTodayPlan(remarkTb);
        }
      }
    },
    async saveTodayPlan(remarkTb) {
      this.adminLoading = true;
      let errMsg = "";
      let okCount = this.selectionData[remarkTb].length;
      this.selectionData[remarkTb].forEach((d) => {
        let isOk = true;
        if (isOk) {
          d["LineID"] = d.SMTLineID;
          d["StartDate"] = this.ReplyDate
            ? this.$moment(this.ReplyDate[0]).format("YYYY-MM-DD")
            : d["StartDate1"];
          d["EndDate"] = this.ReplyDate
            ? this.$moment(this.ReplyDate[1]).format("YYYY-MM-DD")
            : d["StartDate1"];
          d["ProcessID"] = d.ProcessID1;
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
          "/APSAPI/ToInjectionDayPlan"
        );
        const { result, data, count, msg } = res.data;
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
      } else {
        this.adminLoading = false;
      }
    },
    async getOrder() {
      this.adminLoading = true;
      let res = await GetSearch(
        { ReplyDate: this.ReplyDate },
        "/APSAPI/GetInjectionDemand"
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
    },
  },
};
</script>
