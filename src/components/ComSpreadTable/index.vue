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
    <div class="flex_row_spaceBtn">
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
      default: 9036,
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
    tableHeader: {
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
    tableHeader: {
      handler(newValue, oldValue) {
        this.$set(this, "tableHeader", newValue);
        this.setData();
      },
      deep: true,
    },
    tableData() {
      this.sheet.setDataSource(this.tableData);
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
  created() {},
  methods: {
    //初始化SpreadJS
    initSpread: function (spread) {
      this.spread = spread;
      // spread.suspendPaint();
      // // 获取活动表单
      // let sheet = spread.getActiveSheet();
    },
    // 选择一页显示多少数据
    pageSize(val) {
      this.$emit("pageSize", val, this.remark, this.filtertb);
    },
    // 分页导航
    pageChange(val) {
      this.$emit("pageChange", val, this.remark, this.filtertb);
    },
    async setData() {
      try {
        // 获取活动表单
        let sheet = this.spread.getActiveSheet();
        this.sheet = sheet;
        // 重置表单
        sheet.reset();
        // 渲染列
        let colInfos = [];
        let cellIndex = 0;
        this.tableHeader.forEach((x) => {
          if (
            x.ControlType === "comboboxMultiple" ||
            x.ControlType === "combobox"
          ) {
            colInfos.push({
              name: x.prop,
              displayName: x.label,
              cellType: "",
              size: parseInt(x.width),
            });
            let newData = [];
            let list = null;
            this.tableData.map((item, index) => {
              if (x.DataSourceID && x.DataSourceName) {
                newData = item[x.DataSourceName]; // 设置列表每行下拉菜单
                list = new GCsheets.CellTypes.ComboBox();
                list.editorValueType(
                  GC.Spread.Sheets.CellTypes.EditorValueType.value
                );
                list.editable(true);
                list.items(newData);
                list.itemHeight(24);
                sheet
                  .getCell(index, cellIndex, GCsheets.SheetArea.viewport)
                  .cellType(list);
              }
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

          //行，start,end
          if (x.isEdit) {
            sheet.getRange(-1, cellIndex, 1, 1).locked(false);
            var cell = sheet.getCell(
              -1,
              cellIndex,
              GC.Spread.Sheets.SheetArea.viewport
            );
            cell.foreColor("#2a06ecd9");
          }

          cellIndex++;
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
        if (colInfos.length && colInfos[0].name === "isChecked") {
          // 选框
          sheet.setCellType(
            0,
            0,
            new HeaderCheckBoxCellType(),
            GCsheets.SheetArea.colHeader
          );

          let checkbox = {
            name: "isChecked",
            displayName: "选择",
            cellType: new GC.Spread.Sheets.CellTypes.CheckBox(),
            size: 60,
          };
          for (var name in checkbox) {
            colInfos[0][name] = checkbox[name];
          }
        }

        // 设置整个列头的背景色和前景色。
        /**
         * 参数1:表示行
         * 参数2:列，-1表示
         * 参数3:
         * 参数4:
         * 参数5:
         */
        let colHeaderStyle = sheet.getRange(
          0,
          -1,
          1,
          -1,
          GC.Spread.Sheets.SheetArea.colHeader
        );
        colHeaderStyle.foreColor("000000d9");
        colHeaderStyle.backColor("#f3f3f3");
        colHeaderStyle.font(
          "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif"
        );
        colHeaderStyle.hAlign(GC.Spread.Sheets.HorizontalAlign.left);
        colHeaderStyle.vAlign(GC.Spread.Sheets.HorizontalAlign.left);

        //设置数据渲染的单元格默认的样式
        var defaultStyle = new GC.Spread.Sheets.Style();
        defaultStyle.font =
          "12px basefontRegular, Roboto, Helvetica, Arial, sans-serif";
        defaultStyle.hAlign = GC.Spread.Sheets.HorizontalAlign.left;
        defaultStyle.vAlign = GC.Spread.Sheets.HorizontalAlign.left;
        sheet.setDefaultStyle(
          defaultStyle,
          GC.Spread.Sheets.SheetArea.viewport
        );
        defaultStyle.showEllipsis = true;

        // 冻结
        sheet.frozenColumnCount(this.tableHeader[1].FixCount);
        //渲染数据源
        sheet.setDataSource(this.tableData);
        //渲染列
        sheet.bindColumns(colInfos); //此方法一定要放在setDataSource后面才能正确渲染列名
        this.spread.options.tabStripVisible = false; //是否显示表单标签
        // 设置行颜色，最终判断有错误整行底色红色
        this.tableData.forEach((row, index) => {
          if (row["DBResult"] && row["DBResult"].indexOf("错误") > -1) {
            sheet.getCell(index, -1).backColor("red");
          }
        });
        this.spread.resumePaint();
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
  