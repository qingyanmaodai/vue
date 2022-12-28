<!--恩平电机周计划排程-->
<template>
    <div class="container" v-loading="adminLoading">
      <div class="admin_head" ref="headRef">
        <div v-for="i in [0, 1, 2, 3, 4]" :key="i" v-show="labelStatus1 == i">
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
              <el-col :span="12"
                >
                <span class="title" style="margin-right:10px">{{ title }}</span>
                <span style="color: #ff9900;" v-if="tagRemark==1">周计划日期显示规则：转入周计划时当周周一 至 下周周日，2周周期。</span>
                </el-col
              >
              <el-col :span="12" class="flex_flex_end">
                <div>
                  <!-- <span>选择机台/班组：</span>
                  <el-select
                    clearable
                    filterable
                    size="mini"
                    v-model.trim="ruleForm.LineIDs"
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
                  </el-select> -->
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
                <!-- 去掉分页，因为会导致计算排期没有全选工序工时被清空问题 -->
                <span>共{{ tablePagination[1].pageTotal }}条</span>
                <!-- <el-pagination
                  background
                  @size-change="(val) => pageSize(val, 1)"
                  :current-page="tablePagination[1].pageIndex"
                  :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
                  :page-size="tablePagination[1].pageSize"
                  :total="tablePagination[1].pageTotal"
                  @current-change="(val) => pageChange(val, 1)"
                  layout="total, sizes, prev, pager, next,jumper"
                >
                </el-pagination> -->
              </div>
            </div>
          </div>
          <div
            v-for="item in [0, 2, 3, 4, 5]"
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
  
        <!-- 点击齐套率弹框-->
        <DialogTable
          title="订单齐套分析"
          :tableDialog="colDialogVisible"
          :sysID="5165"
          width="80%"
          @closeDialog="colDialogVisible = false"
          :searchForm="dialogSearchForm"
          :isToolbar="false"
        ></DialogTable>
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
  GC.Spread.Common.CultureManager.culture("zh-cn");
  import ComSearch from "@/components/ComSearch";
  import ComVxeTable from "@/components/ComVxeTable";
  import { HeaderCheckBoxCellType } from "@/static/data.js";
  import {
    GetHeader,
    GetSearchData,
    ExportData,
    SaveData,
    GetSearch,
  } from "@/api/Common";
  import DialogTable from "@/components/Dialog/dialogTable";
  export default {
    name: "EPMotorWeeklySchedule",
    components: {
      ComSearch,
      ComVxeTable,
      DialogTable,
    },
    data() {
      return {
        ////////////////// Search /////////////////
        dialogSearchForm: {
          OrderID: "",
        },
        colDialogVisible: false,
        footerLabel: ["", "", "", "", "", "", ""],
        sysID: [
          { ID: 5156 },
          { ID: 9013, ConfigStartWeek: 1 }, //一些扩展的参数，这里表示是周一
          { ID: 5156 },
          { ID: 5156 },
          { ID: 5156 },
          { ID: 5156 },
          { ID: 5156 },
        ],
        Status1: [
          { label: "待排订单", value: 0 },
          { label: "滚动周计划", value: 1 },
          // { label: "SMT待排", value: 2 },
          // { label: "SMT已排", value: 2 },
          { label: "已完成", value: 3 },
        ],
        title: this.$route.meta.title,
        labelStatus1: 1,
        PrepareDate: "",
        adminLoading: false,
        checkdBtnCodes: [],
        drawer: false,
        height: "707px",
        formSearchs: [
          {
            datas: {MFGOrganizeID:1222},
            forms: [],
          },
          {
            datas: {MFGOrganizeID:1222},
            forms: [],
          },
          {
            datas: {MFGOrganizeID:1222},
            forms: [],
          },
          {
            datas: { IsSetPrepare: "未生成",MFGOrganizeID:1222 },
            forms: [],
          },
          {
            datas: { IsSetPrepare: "已生成",MFGOrganizeID:1222 },
            forms: [],
          },
          {
            datas: {MFGOrganizeID:1222},
            forms: [],
          },
          {
            datas: {MFGOrganizeID:1222},
            forms: [],
          },
        ],
        btnForm: [],
        parmsBtn: [
          {
            ButtonCode: "to_weeks_plan",
            BtnName: "转入周计划",
            Type: "danger",
            Ghost: true,
            Size: "small",
            signName: 0,
            Methods: "ToPlan",
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
            ButtonCode: "downLoadErpData",
            BtnName: "下载ERP数据",
            Type: "warning",
            Ghost: true,
            Size: "small",
            signName: 1,
            Methods: "downERP",
            Icon: "",
          },
          {
            ButtonCode: "computedPlan",
            BtnName: "计算排期",
            Type: "warning",
            Ghost: true,
            Size: "small",
            signName: 1,
            Methods: "computedPlan",
            Icon: "",
          },
          // {
          //   ButtonCode: "SMT",
          //   BtnName: "SMT",
          //   Type: "primary",
          //   Ghost: true,
          //   Size: "small",
          //   signName: 1,
          //   Methods: "setPlan",
          //   Params: { ProcessID: "P202009092233201" },
          //   Icon: "",
          // },
          //    {
          //   ButtonCode: "TEST",
          //   BtnName: "测试",
          //   Type: "primary",
          //   Ghost: true,
          //   Size: "small",
          //   signName: 1,
          //   Methods: "setPlan",
          //   Params: { ProcessID: "P202009092233524" },
          //   Icon: "",
          // },
          //    {
          //   ButtonCode: "sanfangqi",
          //   BtnName: "三防漆",
          //   Type: "primary",
          //   Ghost: true,
          //   Size: "small",
          //   signName: 1,
          //   Methods: "setPlan",
          //   Params: { ProcessID: "P202103171023547" },
          //   Icon: "",
          // },
          {
            ButtonCode: "to_days_plan",
            BtnName: "转入日计划",
            Type: "primary",
            Ghost: true,
            Size: "small",
            signName: 1,
            Methods: "setPlan",
            Params: { ProcessID: "P2208290001" },
            Icon: "",
          },
  
          {
            ButtonCode: "returnOrder",
            BtnName: "退回",
            Type: "danger",
            Ghost: true,
            signName: 1,
            Size: "small",
            Methods: "backData",
            Icon: "",
          },
  
          //   {
          //     ButtonCode: "to_days_plan",
          //     BtnName: "转入日计划",
          //     Type: "primary",
          //     Ghost: true,
          //     Size: "small",
          //     signName: [2, 4],
          //     Methods: "setPlan",
          //     Icon: "",
          //   },
        ],
        tableData: [[], [], [], [], [], [], []],
        delData: [[], [], [], [], [], [], []],
        tableColumns: [[], [], [], [], [], [], []],
        tableLoading: [false, false, false, false, false, false],
        isClear: [false, false, false, false, false, false],
        tablePagination: [
          { pageIndex: 1, pageSize: 500, pageTotal: 0 },
          { pageIndex: 1, pageSize: 0, pageTotal: 0 },
          { pageIndex: 1, pageSize: 100, pageTotal: 0 },
          { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
          { pageIndex: 1, pageSize: 3000, pageTotal: 0 },
          { pageIndex: 1, pageSize: 100, pageTotal: 0 },
          { pageIndex: 1, pageSize: 100, pageTotal: 0 },
        ],
        height: "707px",
        showPagination: true,
        tagRemark: 1,
        isLoading: false,
        initialBtnData: [],
        // tagRremark: 1,
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
        checkBoxCellTypeLine: "",
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
      if (this.spread) {
        this.spread.refresh();
      }
    },
    mounted() {
      setTimeout(() => {
        this.setHeight();
      }, 450);
    },
    methods: {
      // 退回
      backData() {
        this.getSelectionData();
        if (this.selectionData[this.tagRemark].length == 0) {
          this.$message.error("请选择需要操作的数据！");
        } else {
          this.$confirm("确定退回吗？")
          .then(() => {
            // 确定
            this.adminLoading = true;
          this.selectionData[this.tagRemark].forEach((a) => {
            a["ElementDeleteFlag"] = 1;
          });
          this.dataBackSave(this.selectionData[this.tagRemark], this.tagRemark);
          })
          .catch(() => {
            // 取消
          });
          
        }
      },
      async dataBackSave(data1, index) {
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
        // this.parmsBtn = []
        if (routeBtn.length != 0) {
          routeBtn.forEach((x) => {
            if (x.ButtonCode == "edit") {
              permission = true;
            }
            let newData = this.parmsBtn.filter((y) => {
              // 如果页面定义了取页面的，否则取按钮权限配置中的
            if (x.ButtonCode == y.ButtonCode) {
              y.BtnName = x.ButtonName;
              y.Methods = y.Methods||x.OnClick;
              y.Type = y.Type || x.ButtonType;
              return y;
            }
              // return x.ButtonCode == y.ButtonCode
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
            if(x.name.indexOf('-')>-1){
              x.width = 80
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
        if(colInfos.length&&colInfos[0]['name']==='isChecked'){
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
        defaultStyle.showEllipsis = true;
        sheet.setDefaultStyle(defaultStyle, GC.Spread.Sheets.SheetArea.viewport);

        sheet.frozenColumnCount(this.tableColumns[this.tagRemark][1].FixCount);
  
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

        // 列筛选
        // 参数2 开始列
        // 参数3 
        // 参数4 结束列
        var cellrange =new GC.Spread.Sheets.Range(-1, -1, -1, cellIndex);
        var hideRowFilter =new GC.Spread.Sheets.Filter.HideRowFilter(cellrange);
        sheet.rowFilter(hideRowFilter)  

        var colindexs = [1, 2, 3, 4, 5];
        this.tableData[1].forEach((row, index) => {
          let cellIndex = 0;
          this.tableColumns[1].forEach((m, num) => {
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
            if(m.name ==='StockQty'){
              rowSheet3 = sheet.getCell(
                index, //行
                num, //列
                GC.Spread.Sheets.SheetArea.viewport
              );
              rowSheet3.backColor("#c2e7b0");
            }
            // 电机库存单元格背景色
            if(m.name ==='Extend17'){
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
  
        this.spread.resumePaint();
        this.adminLoading = false;
        this.tableLoading[1] = false;
        sheet.options.protectionOptions.allowResizeColumns = true; //禁用改变行高
        // sheet.options.isProtected = true; //锁定表格
        this.spread.options.tabStripVisible = false; //是否显示表单标签
        this.spread.refresh();
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
          this.selectionData[0].map((item) => {
            item["StartDate"] = this.ruleForm.ProducedDate
              ? this.$moment(this.ruleForm.ProducedDate[0]).format("YYYY-MM-DD")
              : "";
            item["EndDate"] = this.ruleForm.ProducedDate
              ? this.$moment(this.ruleForm.ProducedDate[1]).format("YYYY-MM-DD")
              : "";
          });
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
        this.selectionData[this.tagRemark] = [];
        if (newData.length != 0) {
          newData.forEach((x) => {
            if (x.isChecked) {
              this.selectionData[this.tagRemark].push(x);
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
          // this.formSearchs[2].datas["ProcessID"] = "P202009092233201";
          this.formSearchs[2].datas["CompletionStatus"] = "1";
  
          // this.formSearchs[4].datas["ProcessID"] = "P202009092233413";
          // this.formSearchs[4].datas["SchedulingStatus"] = "0";
          // //  this.formSearchs[3].datas["ProcessID"] = "P202009092233413";
          //   this.formSearchs[3].datas["CompletionStatus"] = "1";
          //   this.formSearchs[4].datas["productionstatus"] = "25";
          this.formSearchs[1].datas["productionstatus"] = [21, 22, 23, 24, 26];
          this.formSearchs[1].datas["ConfigStartWeek"] = "1";
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
        if (remarkTb == 1) {
          form["AutoDays2"] = 20;
          form["StartWeek"] = 1;
        }
  
        let res = await GetSearchData(form);
        const { result, data, count, msg } = res.data;
        if (remarkTb == 1) {
          this.tableColumns[remarkTb] = res.data.Columns[0];
        }
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
        let res = await GetSearch(submitData, "/APSAPI/SaveWeekPlan");
  
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
  
      async downERP() {
        this.adminLoading = true;
        let res = await GetSearch(null, "/APSAPI/GetErpData");
  
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
      // 计算排程
      async computedPlan(remarkTb) {
        this.getSelectionData();
        this.adminLoading = true;
        this.selectionData[1].forEach((m) => {
          m["isChecked"] = true;
        });
        let res = await GetSearch(
          this.selectionData[this.tagRemark],
          "/APSAPI/MOPlanStep1CalculationV2"
        );
        const { result, data, count, msg } = res.data;
  
        if (result) {
          this.adminLoading = false;
          this.$set(this.tableData, this.tagRemark, data);
          // 重新勾选上
          this.selectionData[this.tagRemark] = [];
          this.dataSearch(this.tagRemark);
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
        console.log("触发总排期保存");
        if (this.tableData[this.tagRemark].length) {
          this.adminLoading = true;
          let res = await SaveData(this.tableData[this.tagRemark]);
          const { result, data, count, msg } = res.data;
  
          if (result) {
            this.dataSearch(this.tagRemark);
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
        }
      },
      // 转入日计划
      async setPlan(remarkTb, index, params) {
        this.getSelectionData();
        // if (this.ruleForm.LineIDs.length == 0 ||!this.ruleForm.LineIDs) {
        //   this.$message.error("请选择生产线再转入日计划！");
        // } else {
        if (this.selectionData[remarkTb].length == 0) {
          this.$message.error("请选择需要转入日计划的数据！");
        } else {
          let isNoCapacity1 = true;
          console.log(this.selectionData[remarkTb])
          this.selectionData[remarkTb].forEach((element) => {
            if (!element.Capacity1&&element.OrderNo) {
              isNoCapacity1 = false;
              console.log(element.OrderNo)
            }
          });
          if (!isNoCapacity1) {
            this.$confirm('请检查并维护产品产能，存在产能为空，会导致数据异常，是否确定转入日计划?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.saveTodayPlan(remarkTb)
            }).catch(() => {
              
            });
          }else{
            this.saveTodayPlan(remarkTb)
          }
        }
        // }
      },
      async saveTodayPlan(remarkTb){
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
              "/APSAPI/MOPlanSaveToDayPlanV3?isPlan=1&isqty=1"
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
      // 选线获取剩余工时
      setFooterLabel(val) {
        // this.ruleForm.LineIDs = []
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
          let newData = [];
          if (data.length != 0) {
            data.forEach((a) => {
              // a["LineID"] = a.OrganizeID;
              // a["LineName"] = a.OrganizeName;
              newData.push({
                text: a.OrganizeName,
                value: a.OrganizeID,
              });
            });
          }
  
          this.checkBoxCellTypeLine = new GCsheets.CellTypes.ComboBox();
          this.checkBoxCellTypeLine.editorValueType(
            GC.Spread.Sheets.CellTypes.EditorValueType.value
          );
          this.checkBoxCellTypeLine.items(newData);
          this.checkBoxCellTypeLine.itemHeight(24);
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
      },
      // 备料任务
      async readyTask(remarkTb, index, MOSchedulingType) {
        let submitData = this.selectionData[remarkTb];
        if (submitData.length != 0) {
          this.adminLoading = true;
          let url = "/APSAPI/SetPreParePlanV2";
          let res = await GetSearch(submitData, url);
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
        } else {
          this.$message.error("请选择需要操作的数据！");
        }
      },
    },
  };
  </script>