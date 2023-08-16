<!-- 生产订单管理-->
<template>
  <div class="container flex_column content_height" v-loading="adminLoading">
    <div class="admin_head" ref="headRef">
      <div v-for="i in [0, 1, 2]" :key="i" v-show="labelStatus1 === i">
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
    <div class="ant-table-title pd-0-6">
      <el-row>
        <el-col :span="12">
          <span class="title" style="margin-right: 10px">{{ title }}</span>
          <span style="color: #ff9900" v-if="tagRemark == 1"
            >周计划日期显示规则：转入周计划时当周周一 至
            下周周日，2周周期。</span
          >
        </el-col>

        <el-col :span="12" class="flex_flex_end">
          <div>
            <span>生产时段：</span>
            <el-date-picker
              v-model="ruleForm.ProducedDate"
              type="daterange"
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
      class="admin_content flex_grow"
      v-for="item in [1]"
      :key="item"
      v-show="labelStatus1 === item"
    >
      <ComSpreadTable
        ref="spreadsheetRef"
        height="100%"
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
    <div
      class="admin_content flex_grow"
      v-for="item in [0, 2]"
      :key="item"
      v-show="labelStatus1 === item"
    >
      <ComVxeTable
        :ref="`tableRef${item}`"
        :rowKey="'RowNumber'"
        height="100%"
        :tableData="tableData[item]"
        :tableHeader="tableColumns[item]"
        :tableLoading="tableLoading[item]"
        :remark="item"
        :sysID="sysID[item]['ID']"
        :hasSelect="hasSelect[item]"
        :isEdit="isEdit[item]"
        :isClear="isClear[item]"
        :keepSource="true"
        :pagination="tablePagination[item]"
        @pageChange="pageChange"
        @pageSize="pageSize"
        @sortChange="sortChange"
        @selectfun="selectFun"
      />
      <!-- <div style="color: red; font-weight: bold">{{ this.resultMsg }}</div> -->
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
        { label: "待排订单", value: 0 },
        { label: "滚动周计划", value: 1 },
        { label: "已完成", value: 2 },
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
          datas: { CompletionStatus: 1 },
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
      selectionData: [[], [], []],
      btnForm: [],
      isLoading: false,
      tableData: [[], [], []],
      tableColumns: [[], [], []],
      tableLoading: [false, false, false],
      isClear: [false, false, false],
      hasSelect: [false, false, false],
      tablePagination: [
        { pageIndex: 1, pageSize: 10000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 1000, pageTotal: 0 },
        { pageIndex: 1, pageSize: 10000, pageTotal: 0 },
      ],
      height: "707px",
      treeHeight: "765px",
      showPagination: true,
      tagRemark: 0,
      isEdit: [false, false, false],
      clickData: {},
      isUpdate: true,
      adminLoading: false,
      dialogImport: false,
      fileList: [],
      file: [],
      sysID: [
        { ID: 9013 },
        { ID: 11168, ConfigStartWeek: 1 }, //一些扩展的参数，这里表示是周一
        { ID: 9013 },
      ],
      userInfo: {},
      ruleForm: {
        LineIDs: [],
        ProducedDate: [],
      },
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
            if (!item["signName"] || item["signName"].length === 0) {
              this.isEdit.fill(true);
            } else if (item["signName"] && item["signName"].length > 0) {
              item["signName"].map((item) => {
                this.$set(this.isEdit, item, true);
              });
            }
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
    // 转入日计划
    async setPlan(remarkTb, index, params) {
      if (this.selectionData[remarkTb].length == 0) {
        this.$message.error("请选择需要转入日计划的数据！");
      } else {
        let isNoCapacity1 = true;
        let isTodayPlan = true;
        console.log(this.selectionData[remarkTb]);
        this.selectionData[remarkTb].forEach((element) => {
          if (!element.Capacity1 && element.OrderNo) {
            isNoCapacity1 = false;
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
    //
    async saveTodayPlan(remarkTb) {
      // let ProcessID = "";
      this.adminLoading = true;
      // if (remarkTb == 1) {
      //   ProcessID = "P202009092233201";
      // } else if (remarkTb == 3) {
      //   ProcessID = "P202009092233413";
      // }

      let errMsg = "";
      // let okCount = 0;
      let okCount = this.selectionData[remarkTb].length;
      this.selectionData[remarkTb].forEach((d) => {
        let isOk = true;
        //判断是否转入
        // if (
        //   params.ProcessID == "P202009092233201" &&
        //   d["IsToPlanDay1"] != "否"
        // ) {
        //   isOk = false;
        // } else if (
        //   params.ProcessID == "P202009092233413" &&
        //   d["IsToPlanDay2"] != "否"
        // ) {
        //   isOk = false;
        // }

        if (isOk) {
          d["LineID"] = d.SMTLineID;
          // d["ProducedDate"] = this.ruleForm.ProducedDate;
          d["StartDate"] = this.ruleForm.ProducedDate
            ? this.$moment(this.ruleForm.ProducedDate[0]).format("YYYY-MM-DD")
            : d["StartDate1"];
          d["EndDate"] = this.ruleForm.ProducedDate
            ? this.$moment(this.ruleForm.ProducedDate[1]).format("YYYY-MM-DD")
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
          "/APSAPI/MOPlanSaveToDayPlanV3?isPlan=1"
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
    },
    async ToPlan(remarkTb) {
      //转入周计划
      if (this.selectionData[remarkTb].length == 0) {
        this.$message({
          message: "请选择要操作的数据",
          type: "error",
          dangerouslyUseHTMLString: true,
        });
      } else {
        this.selectionData[remarkTb].map((item) => {
          item["StartDate"] = this.ruleForm.ProducedDate
            ? this.$moment(this.ruleForm.ProducedDate[0]).format("YYYY-MM-DD")
            : "";
          item["EndDate"] = this.ruleForm.ProducedDate
            ? this.$moment(this.ruleForm.ProducedDate[1]).format("YYYY-MM-DD")
            : "";
        });
        this.adminLoading = true;
        let res = await GetSearch(
          this.selectionData[remarkTb],
          "/APSAPI/InsertIntoIMByOrderID"
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
      }
    },
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

          this.dataSave();
          return false;
        }
      };
    },
    // 跳转至页面配置
    toPageSetting() {
      this.$router.push({
        name: "FieldInfo",
        params: { ID: this.sysID[0].ID },
      });
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
          // this.$set(
          //   this.formSearchs[z].datas,
          //   "Accounts",
          //   this.accountsValue
          //     ? [
          //         "$" + `${this.userInfo["Account"]}` + "$",
          //         "$" + `${this.accountsValue}` + "$",
          //       ]
          //     : ["$" + `${this.userInfo["Account"]}` + "$"]
          // );
        });
        // this.formSearchs[1].datas["ProductionStatus"] = [26]; //默认待排
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
      // if (remarkTb == 0) {
      //   form["AutoDays2"] = this.AutoDays2;
      // }

      form["rows"] = this.tablePagination[remarkTb].pageSize;
      form["page"] = this.tablePagination[remarkTb].pageIndex;
      let res = await GetSearchData(form);
      const { result, data, count, msg, Columns } = res.data;
      this.adminLoading = false;
      if (result) {
        this.$set(this.tableData, remarkTb, data);
        this.$set(this.tablePagination[remarkTb], "pageTotal", count);
        if (remarkTb == 1) {
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
    // 行内列样式
    cellStyle({ row, column }) {},
    // 改变状态
    changeStatus(x, index) {
      this.labelStatus1 = index;
      this.dataSearch(index);
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
  },
};
</script>
