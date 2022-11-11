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
                <div style="margin-right: 10px">
                <span>日期范围</span>
                <el-date-picker
                  v-model="machineCycle"
                  type="daterange"
                  size="small"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择"
                  :clearable="false"
                  :editable="false"
                >
                </el-date-picker>
              </div>
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
                <span>共{{ tablePagination[tagRemark].pageTotal }}条</span>
                <!-- <el-pagination
                  background
                  @size-change="(val) => pageSize(val, 1)"
                  :current-page="tablePagination[tagRemark].pageIndex"
                  :page-sizes="[200, 500, 1000, 3000, 5000, 10000]"
                  :page-size="tablePagination[tagRemark].pageSize"
                  :total="tablePagination[tagRemark].pageTotal"
                  @current-change="(val) => pageChange(val, 1)"
                  layout="total, sizes, prev, pager, next,jumper"
                >
                </el-pagination> -->
              </div>
            </div>
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
  import { HeaderCheckBoxCellType } from "@/static/data.js";
  import {
    GetHeader,
    GetSearchData,
    ExportData,
    SaveData,
    GetSearch,
  } from "@/api/Common";
  import formatDates from "@/utils/formatDate";
  export default {
    name: "ArrearsTracking",
    components: {
      ComSearch,
      ComVxeTable,
    },
    data() {
      return {
        machineCycle: "",
        ////////////////// Search /////////////////
        footerLabel: ["", "", "", "", "", "", ""],
        sysID: [
          { ID: 9007 }, //一些扩展的参数，这里表示是周一
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
          {
            ButtonCode: "save",
            BtnName: "保存",
            Type: "success",
            Ghost: true,
            Size: "small",
            Methods: "dataSave",
            Icon: "",
          },
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
    created() {
      _this = this;
    this.getTableHeader();
      // 获取所有按钮
      this.judgeBtn();
      // 计算周期默认时间：今天~1.5月
    _this.machineCycle = [
      formatDates.formatTodayDate(),
      formatDates.formatOneMonthDate(),
    ];
    },
    activated() {
      if (this.spread) {
        console.log('1111')
        this.spread.refresh();
      }
    },
    mounted() {
      setTimeout(() => {
        this.setHeight();
      }, 450);
    },
    methods: {
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
          }else if(x.DataType=='datetime'||x.DataType==='varchar'||x.DataType==='nvarchar'){
            colInfos.push({
              name: x.prop,
              displayName: x.label,
              size: parseInt(x.width),
              formatter: '@'//字符串格式
            });
          }else {
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
          } 
          // 列宽自适应
          // if(m.name.indexOf('-')>-1){
          //   sheet.autoFitColumn(cellIndex)
          // }
  
          cellIndex++;
        });
        // 列筛选
        // 参数2 开始列
        // 参数3
        // 参数4 结束列
        // var cellrange = new GC.Spread.Sheets.Range(-1, -1, -1, cellIndex);
        // var hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(
        //   cellrange
        // );
        // sheet.rowFilter(hideRowFilter);
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
  
        this.spread.resumePaint();
        this.adminLoading = false;
        this.tableLoading[this.tagRemark] = false;
        sheet.options.protectionOptions.allowResizeColumns = true; //禁用改变行高
        sheet.options.isProtected = true; //锁定表格
        this.spread.options.tabStripVisible = false; //是否显示表单标签
        this.spread.refresh();
        this.spread.options.autoFitType = GC.Spread.Sheets.AutoFitType.cellWithHeader;
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
      // 导出
      async dataExport(remarkTb) {
        this.adminLoading = true;
        let form = JSON.parse(JSON.stringify(this.formSearchs[remarkTb].datas));
        form["rows"] = 0;
        let res = await ExportData(form);
        this.adminLoading = false;
        this.$store.dispatch("user/exportData", res.data);
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
          m.forEach((n, index) => {
            if (n.Required) {
              this.formSearchs[this.tagRemark].required.push(n);
            }
          });
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
          this.formSearchs[this.tagRemark].datas["OweQty"] = 0;
          this.getTableData(this.formSearchs[z].datas, z);
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
      async getTableData(params, index) {
        this.$set(this.tableLoading, index, true);
        params["SDate"] = this.machineCycle.length ? this.machineCycle[0] : "";
        params["Edate"] = this.machineCycle.length ? this.machineCycle[1] : "";
        params["rows"] = this.tablePagination[index].pageSize;
        params["page"] = this.tablePagination[index].pageIndex;
        let res = await GetSearchData(params);
        const { result, data, count, msg, Columns } = res.data;
        if (result) {
          this.$set(this.tableData, index, data);
          this.$set(this.tablePagination[index], "pageTotal", count);
          // 查询时重新获取列渲染
          if (Columns.length) {
            this.tableColumns[index] = Columns[0];
          }
          this.setData();
        } else {
          this.$message({
            message: msg,
            type: "error",
            dangerouslyUseHTMLString: true,
          });
        }
        this.$set(this.tableLoading, index, false);
      },
      // 保存
      async dataSave(remarkTb) {
        let sheet = this.spread.getActiveSheet();
        let newData = sheet.getDirtyRows(); //获取修改过的数据
        let submitData = [];
        if (newData.length != 0) {
          newData.forEach((x) => {
            submitData.push(x.item);
          });
          this.adminLoading = true;
          let res = await SaveData(submitData);
          const { datas, forms, result, msg } = res.data;
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
          this.$message.error("当前数据没做修改，请先修改再保存！");
        }
      },
    },
  };
  </script>