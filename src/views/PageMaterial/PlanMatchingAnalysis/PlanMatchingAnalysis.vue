<!--计划配套分析-->
<template>
    <div class="container" v-loading="adminLoading">
      <div class="admin_head" ref="headRef">
        <div>
          <ComSearch
            ref="searchRef"
            :searchData="formSearchs[tagRemark].datas"
            :searchForm="formSearchs[tagRemark].forms"
            :remark="tagRemark"
            :isLoading="isLoading"
            :btnForm="btnForm"
            :signName="tagRemark"
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
                </el-col
              >
              <el-col :span="12" class="flex_flex_end">
                <el-radio-group v-model="radioValue" @change="radioChange">
                  <el-radio v-for="(item,index) in parmsBtn2" :key="index" :label="item.value" :value="item.value">{{item.label}}</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
          <div
            class="flex_column"
            :style="{ height: height }"
          >
            <div class="spreadContainer" v-loading="tableLoading[tagRemark]">
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
                  @click="toPageSetting(sysID[tagRemark].ID)"
                  class="primaryColor cursor"
                  >SysID:{{ sysID[tagRemark].ID }}
                </span>
              </div>
              <div class="flex">
                <!-- 去掉分页，因为会导致计算排期没有全选工序工时被清空问题 -->
                <!-- <span>共{{ tablePagination[tagRemark].pageTotal }}条</span> -->
                <el-pagination
                  background
                  @size-change="(val) => pageSize(val, 1)"
                  :current-page="tablePagination[tagRemark].pageIndex"
                  :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
                  :page-size="tablePagination[tagRemark].pageSize"
                  :total="tablePagination[tagRemark].pageTotal"
                  @current-change="(val) => pageChange(val, 1)"
                  layout="total, sizes, prev, pager, next,jumper"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 点击齐套率弹框-->
        <DialogTable
          title="欠料明细"
          :tableDialog="colDialogVisible"
          :sysID="5594"
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
    name: "PlanMatchingAnalysis",
    components: {
      ComSearch,
      ComVxeTable,
      DialogTable,
    },
    data() {
      return {
        parmsBtn2:[
          {label:'显示欠数',value:0},
          {label:'显示配套率',value:1}
        ],
        radioValue:0,
        ////////////////// Search /////////////////
        dialogSearchForm: {
          OrderID: "",
        },
        colDialogVisible: false,
        footerLabel: ["", "", "", "", "", "", ""],
        sysID: [
          { ID: 5158, ConfigStartWeek: 1 }, //一些扩展的参数，这里表示是周一
        ],
        Status1: [
          
        ],
        title: this.$route.meta.title,
        labelStatus1: 0,
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
        ],
        btnForm: [],
        parmsBtn: [
        ],
        tableData: [[]],
        delData: [[]],
        tableColumns: [[]],
        tableLoading: [false],
        isClear: [false],
        tablePagination: [
          { pageIndex: 1, pageSize: 200, pageTotal: 0 },
        ],
        height: "707px",
        showPagination: true,
        tagRemark: 0,
        isLoading: false,
        initialBtnData: [],
        selectionData: [[]],
        hasSelect: [true],
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
      radioChange(val){
        this.dataSearch(this.tagRemark);
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
                y.BtnName = y.BtnName||x.ButtonName;
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
        // 重置表单
        sheet.reset();
        sheet.options.allowCellOverflow = true;
        sheet.defaults.rowHeight = 23;
        sheet.defaults.colWidth = 100;
        sheet.defaults.colHeaderRowHeight = 23;
        sheet.defaults.rowHeaderColWidth = 60;
        let colHeader1 = [];
        let colInfos = [];
  
        this.tableColumns[this.tagRemark].forEach((x) => {
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
  
        sheet.setDataSource(this.tableData[this.tagRemark]);
        sheet.bindColumns(colInfos);
  
        let cellIndex = 0;
  
        this.tableColumns[this.tagRemark].forEach((m) => {
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
          // 列宽自适应
          if(m.name.indexOf('-')>-1){
            sheet.autoFitColumn(cellIndex)
            if(sheet.getColumnWidth(cellIndex)<=60){
              sheet.setColumnWidth(cellIndex, parseInt(m.width))
            }
          }
  
          cellIndex++;
        });
        var colindexs = [1, 2, 3, 4, 5];
        this.tableData[this.tagRemark].forEach((row, index) => {
          let cellIndex = 0;
          this.tableColumns[this.tagRemark].forEach((m, num) => {
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
            // 日期列包含负数字体红色
            if(m.name.indexOf('-')>-1&&row[m.prop]&&row[m.prop].indexOf('-')>-1){
              rowSheet3 = sheet.getCell(
                index, //行
                num, //列
                GC.Spread.Sheets.SheetArea.viewport
              );
              rowSheet3.foreColor("red");
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
          if (_this.tableColumns[_this.tagRemark].length) {
            _this.tableColumns[_this.tagRemark].map((item, index) => {
              if (item.name.indexOf('-')>-1 && args.col === index&&_this.radioValue===0) {
                // 显示ERP供需平衡表
                _this.colDialogVisible = true;
                _this.dialogSearchForm.ProductCode =
                _this.tableData[_this.tagRemark][args.row].ProductCode;
                _this.dialogSearchForm.OweQty = 0;
              }
            });
          }
        });
  
        this.spread.resumePaint();
        this.adminLoading = false;
        this.tableLoading[this.tagRemark] = false;
        sheet.options.protectionOptions.allowResizeColumns = true; //禁用改变行高
        sheet.options.isProtected = true; //锁定表格
        this.spread.options.tabStripVisible = false; //是否显示表单标签
        this.spread.refresh();
        this.spread.options.autoFitType = GC.Spread.Sheets.AutoFitType.cellWithHeader;
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
          this.formSearchs[this.tagRemark].datas["productionstatus"] = [21, 22, 23, 24, 26];
          this.formSearchs[this.tagRemark].datas["ConfigStartWeek"] = "1";
          this.formSearchs[this.tagRemark].datas["New5158"] = "true";
          this.formSearchs[this.tagRemark].datas["vt"] = "";
          this.getTableData(this.formSearchs[this.tagRemark].datas, this.tagRemark);
  
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
        // 欠数、配套率
        form["vt"] = this.radioValue;
        if (remarkTb == 1) {
          form["StartWeek"] = 1;
        }
  
        let res = await GetSearchData(form);
        const { result, data, count, msg } = res.data;
        
        if (result) {
          this.$set(this.tableData, remarkTb, data);
          this.setData();
          this.$set(this.tableLoading, remarkTb, false)
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
        if (this.tagRemark != 0) {
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
      // 清空排期
      clearPlan(remarkTb) {
        if (this.selectionData[remarkTb].length != 0) {
          this.selectionData[remarkTb].forEach((a) => {
            a.StartDate = "";
          });
        }
      },
    },
  };
  </script>