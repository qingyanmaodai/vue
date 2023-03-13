<template>
  <div>
    <!--  spreadJSform表单控件  -->
    <div class="flex_column" :style="{ height: height }">
      <div class="spreadContainer" v-loading="tableLoading">
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
        <span class="primaryColor cursor">SysID:{{ sysID }} </span>
      </div>
      <div class="flex">
        <el-pagination
          background
          @size-change="(val) => pageSize(val, 0)"
          :current-page="pagination.pageIndex"
          :page-sizes="[200, 500, 1000, 2000, 3000, 5000, 10000]"
          :page-size="pagination.pageSize"
          :total="pagination.pageTotal"
          @current-change="(val) => pageChange(val, 0)"
          layout="total, sizes, prev, pager, next,jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
  <script>
var _this;
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
const GCsheets = GC.Spread.Sheets;
GC.Spread.Common.CultureManager.culture("zh-cn");
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import { HeaderCheckBoxCellType } from "@/static/data.js";

export default {
  components: {},
  props: {
    // 系统id
    sysID: {
      type: Number,
      default: 0,
    },
    // 表格的下标
    remark: {
      type: Number,
      required: false,
    },
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableColumns: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableLoading: {
      type: Boolean,
      default: false,
    },
    //单击是否可编辑
    isEdit: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default() {
        return {
          pageIndex: 0,
          pageSize: 30,
          pageTotal: 0,
        };
      },
    },
  },
  data() {
    return {
      height: "600px",
      tagRemark: 0,
      spread: null, //excel初始
      sheet: null, //Worksheet
    };
  },
  computed: {},
  watch: {
    tableColumns: {
      handler(newValue, oldValue) {
        this.setData();
      },
      deep: true,
    },
    tableData: {
      handler(newValue, oldValue) {
        this.setData();
      },
      deep: true,
      // this.sheet.setDataSource(this.tableData);

      // if (this.tableData) {
      //   // this.$refs.vxeTable.reloadData(this.tableData);//加载数据并清除所有状态,使用这个调用后端筛选、排序接口后条件被清空
      //   this.$refs.vxeTable.loadData(this.tableData); //加载数据
      // }
      // if (this.tableData && this.isSpanMethods) {
      //   this.info();
      // }
    },
  },
  mounted() {},
  created() {
    _this = this;
  },
  methods: {
    //初始化SpreadJS
    initSpread: function (spread) {
      this.spread = spread;
    },
    // 选择一页显示多少数据
    pageSize(val) {
      this.$emit("pageSize", val, this.remark);
    },
    // 分页导航
    pageChange(val) {
      this.$emit("pageChange", val, this.remark);
    },
    async setData() {
      try {
        if (this.spread && this.tableData.length) {
          //sheet获取
          this.spread.suspendPaint();
          let sheet = this.spread.getActiveSheet();
          this.sheet = sheet;
          sheet.options.allowCellOverflow = true;
          sheet.defaults.rowHeight = 23;
          sheet.defaults.colWidth = 100;
          sheet.defaults.colHeaderRowHeight = 23;
          sheet.defaults.rowHeaderColWidth = 60;
          // 重置表单
          sheet.reset();
          let colHeader1 = [];
          let colInfos = [];
          console.log(this.tableColumns, "this.tableColumns");
          this.tableColumns.forEach((x) => {
            if (x.prop == "LineID") {
              colInfos.push({
                name: x.prop,
                displayName: "线别",
                cellType: this.checkBoxCellTypeLine,
                size: parseInt(x.width),
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
                formatter: "@", //字符串格式
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
            sheet.setValue(
              0,
              index,
              value,
              GC.Spread.Sheets.SheetArea.colHeader
            );
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
              size: 60,
            };
            for (var name in checkbox) {
              colInfos[0][name] = checkbox[name];
            }
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
          sheet.setDefaultStyle(
            defaultStyle,
            GC.Spread.Sheets.SheetArea.viewport
          );

          // 冻结第一列

          sheet.frozenColumnCount(this.tableColumns[1].FixCount);
          console.log(this.tableData, "this.tableData");
          sheet.setDataSource(this.tableData);
          sheet.bindColumns(colInfos);
          this.spread.options.tabStripVisible = false; //是否显示表单标签

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

          this.tableData.forEach((row, index) => {
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
            var rowSheet3 = "";
            if (_this.tableColumns.length) {
              for (let i = 0; i < _this.tableColumns.length; i++) {
                let item = _this.tableColumns[i];
                if (item.name === "Q1") {
                  rowSheet3 = sheet.getCell(
                    index, //行
                    i, //列
                    GC.Spread.Sheets.SheetArea.viewport
                  );
                  break;
                }
              }
            }

            if (row["Code"] == null) {
              rowSheet.backColor("#A0CFFF");
              rowSheet.foreColor("balck");
              rowSheet2.backColor("#A0CFFF");
              rowSheet2.foreColor("balck");
              if (rowSheet3 && row["Q1"] != "100.00%") {
                //不齐套时字体为红色
                rowSheet3.foreColor("red");
              }
            } else if (row["MFGOrganizeID"] === 162) {
              // row.backColor();
              rowSheet.backColor("#FFFF00");
              rowSheet.foreColor("black");
              rowSheet2.backColor("#FFFF00");
              if (rowSheet3 && row["Q1"] != "100.00%") {
                //不齐套时字体为红色
                rowSheet3.foreColor("red");
              }
            } else if (row["SchedulingResult"] === "超期") {
              // row.backColor();
              rowSheet.backColor("#C2E7B0");
              rowSheet.foreColor("black");
              if (rowSheet3 && row["Q1"] != "100.00%") {
                //不齐套时字体为红色
                rowSheet3.foreColor("red");
              }
            } else if (
              row["DBResult"] &&
              row["DBResult"].indexOf("错误") > -1
            ) {
              // else if (row["DBResult"] != "计算成功"&&row["DBResult"]!=""&&row["DBResult"]!=null) {
              // row.backColor();
              // rowSheet.backColor("#C2E7B0");
              // rowSheet.foreColor("red");
              rowSheet.backColor("red");
              rowSheet.foreColor("black");
              if (rowSheet3 && row["Q1"] != "100.00%") {
                //不齐套时字体为红色
                rowSheet3.foreColor("#A0CFFF");
              }
            } else if (rowSheet3 && row["Q1"] != "100.00%") {
              //不齐套时字体为红色
              rowSheet.foreColor("black");
              rowSheet2.foreColor("balck");
              rowSheet3.foreColor("red");
            } else {
              // row.backColor();
              rowSheet.foreColor("black");
              rowSheet.backColor("");
              rowSheet.foreColor("black");
              rowSheet2.backColor("");
            }
            let cellIndex = 0;
            this.tableColumns.forEach((m) => {
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
          this.tableColumns.forEach((m) => {
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
          // 列筛选
          // 参数2 开始列
          // 参数3
          // 参数4 结束列
          var cellrange = new GC.Spread.Sheets.Range(-1, -1, -1, cellIndex);

          var hideRowFilter = new GC.Spread.Sheets.Filter.HideRowFilter(
            cellrange
          );
          sheet.rowFilter(hideRowFilter);

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
          MyContextMenu.prototype =
            new GC.Spread.Sheets.ContextMenu.ContextMenu(this.spread);
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
                _this.tableColumns.length
              );
              _this.sheetSelectObj.start = s.row;

              _this.sheetSelectObj.count = s.rowCount;
            }
          );

          // 表格单击齐套率弹框事件
          this.spread.bind(GCsheets.Events.CellClick, function (e, args) {
            if (_this.tableColumns.length) {
              _this.tableColumns.map((item, index) => {
                if (item.name === "Q1" && args.col === index) {
                  // 显示ERP供需平衡表
                  _this.colDialogVisible = true;
                  _this.dialogSearchForm.AUFNR =
                    _this.tableData[args.row].OrderNo;
                  _this.dialogSearchForm.ZQLS = 0;
                }
              });
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
          this.tableLoading = false;
          this.spread.refresh(); //重新定位宽高度
        }
      } catch (error) {
        console.log("表格渲染的错误信息:", error);
      }
      this.spread.refresh(); //重新定位宽高度
      this.spread.options.tabStripVisible = false; //是否显示表单标签
    },
  },
};
</script>
  <style lang="scss" scoped>
.comForm ::v-deep input[type="number"] {
  -moz-appearance: textfield;
}
.comForm ::v-deep .el-select {
  width: 100%;
}
</style>
  